import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pilot, pending } from '../scripts/library-pilot.mjs';
import { mayImport, extractGutenberg, chunkText } from '../lib/book-ingestion.mjs';
import { searchTerms, namedSources, attachPassages } from '../lib/library-search.mjs';
import { fontes } from '../src/corpus.js';
import { libraryStore } from '../lib/library.ts';
import consulta from '../netlify/functions/consulta.mts';
import biblioteca from '../netlify/functions/biblioteca.mts';
import OpenAI from 'openai';

beforeEach(t => t.mock.method(libraryStore, 'findPassages', async () => []));
const request = question => new Request('https://example.test/api/consulta', { method: 'POST', body: JSON.stringify({ question, types: ['livro'] }) });
const sections = paragraph => Array.from({ length: 5 }, (_, i) => ({ title: `Seção ${i+1}`, paragraphs: [paragraph] }));
const mockAI = (t, callback) => t.mock.method(OpenAI.Chat.Completions.prototype, 'create', async payload => ({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({ sections: sections(callback(payload)) }) } }] }));
const edition = { ...pilot[0], sourceId: 'smith', status: 'indexed', chunkCount: 1324, checkedAt: '2026-11-04T00:55:00Z' };
const row = { id: 'pg-3300-35', sourceId: 'smith', edition, section: 'BOOK I / CHAPTER I. OF THE DIVISION OF LABOUR.', paragraphStart: 45, paragraphEnd: 46, page: null, content: 'The greatest improvement in the productive powers of labour seem to have been the effects of the division of labour.' };

test('a autorização precisa cobrir o Brasil, a edição e o texto; licença aberta é distinta', () => {
  for (const book of pilot) assert(mayImport(book));
  assert(!mayImport(pending));
  assert(!mayImport({ ...pilot[0], rightsVerifiedBrazil: false }));
  assert(!mayImport({ ...pilot[0], rights: 'unconfirmed' }));
  assert(mayImport({ ...pilot[0], rights: 'open_license' }));
  assert(!mayImport({ ...pilot[0], rightsUrl: '' }));
});

test('a extração recusa texto incompleto e direitos pendentes, removendo preliminares', () => {
  assert.throws(() => extractGutenberg('texto', pilot[0]), /incompleto/);
  assert.throws(() => extractGutenberg('texto', pending), /Direitos/);
  const raw = 'Prefácio\n*** START OF THE PROJECT GUTENBERG EBOOK TEST ***\nIntrodução editorial\nCHAPTER I.\n\n' + 'Original autorizado. '.repeat(700) + '\n*** END OF THE PROJECT GUTENBERG EBOOK TEST ***\nLicença e rodapé';
  const parsed = extractGutenberg(raw, { ...pilot[1], bodyStart: '^CHAPTER I\\.$' });
  assert(!parsed.content.includes('editorial'));
  assert(!parsed.content.includes('rodapé'));
  assert.equal(parsed.checksum.length, 64);
});

test('trechos preservam o texto, a seção e os parágrafos sem inventar páginas', () => {
  const content = 'BOOK I.\n\nCHAPTER I. OF LABOUR.\n\n' + 'work and exchange '.repeat(600) + '\n\nCHAPTER II. OF MONEY.\n\nCoins and trade.';
  const chunks = chunkText(content);
  assert(chunks.length > 4);
  assert(chunks.every(c => c.page === null && c.paragraphEnd >= c.paragraphStart));
  assert.equal(chunks.map(c => c.content).join(' ').replace(/\s+/g,' '), content.replace(/\s+/g,' '));
  assert(chunks.at(-1).section.includes('BOOK I.') && chunks.at(-1).section.includes('CHAPTER II.'));
});

test('perguntas em português encontram vocabulário inglês e títulos/autores explícitos', () => {
  for (const [question, term, id] of [
    ['Smith: como a divisão do trabalho aumenta a produtividade?', 'division', 'smith'],
    ['Sobre a Liberdade: o que é o princípio do dano?', 'harm', 'pdf-193'],
    ['Locke: trabalho e propriedade dependem de consentimento?', 'property', 'segundo-tratado-sobre-o-governo'],
    ['Leviatã: por que a guerra leva à soberania?', 'sovereignty', 'pdf-261'],
    ['A República: como a caverna se relaciona à educação?', 'cave', 'pdf-256'],
  ]) {
    assert(searchTerms(question).includes(term), question);
    assert(namedSources(question, fontes).includes(id), question);
  }
  assert(searchTerms("x'); DROP TABLE books; --").every(t => /^[a-z]+$/.test(t)));
});

test('o piloto contém os cinco corpos textuais e nenhum trecho do livro pendente', async () => {
  const seed = await readFile(new URL('../netlify/database/migrations/20261104005500_seed_library_pilot.sql', import.meta.url), 'utf8');
  const rows = [...seed.matchAll(/\('(pg-\d+-\d+)','(pg-\d+)',(\d+),'((?:[^']|'')*)',(\d+),(\d+),NULL,'((?:[^']|'')*)'\)/g)].map(m => ({ id:m[1], edition:m[2], ordinal:Number(m[3]), section:m[4], content:m[7].replaceAll("''", "'") }));
  assert.equal(rows.length, 2720);
  const expectations = [ ['pg-3300', /division of labour/i], ['pg-34901', /harm to others/i], ['pg-7370', /mixed his labour/i], ['pg-3207', /solitary, poore, nasty, brutish, and short/i], ['pg-1497', /underground den/i] ];
  for (const [id, phrase] of expectations) {
    const passages = rows.filter(r => r.edition === id);
    assert(passages.length > 100, id);
    assert(passages.some(r => phrase.test(r.content)), id);
    assert.equal(new Set(passages.map(p => p.ordinal)).size, passages.length);
  }
  assert(!seed.includes("('mia-manifesto-"));
  assert(seed.includes("'unconfirmed'"));
});

test('consulta entrega trechos e valida as citações, preservando a numeração após filtrar fontes', async t => {
  t.mock.method(libraryStore, 'findPassages', async () => [row]);
  mockAI(t, payload => {
    const sources = JSON.parse(payload.messages[1].content).fichas;
    const source = sources.find(s => s.id === 'smith');
    assert(source.passages[0].content.includes('division of labour'));
    assert.equal(source.passages[0].page, null);
    assert(payload.messages[0].content.includes('pdfPage'));
    return `O trecho descreve a divisão do trabalho [${source.referencia}:T1].`;
  });
  const response = await consulta(request('Smith: como a divisão do trabalho aumenta a produtividade?'));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.sources[0].id, 'smith');
  assert.equal(data.sources[0].digitalEdition.language, 'en');
  assert(data.sections.every(s => s.paragraphs[0].includes('[S1:T1]')));
});

test('consulta rejeita trechos inexistentes e parágrafos sem referência', async t => {
  t.mock.method(libraryStore, 'findPassages', async () => [row]);
  mockAI(t, () => 'Uma citação inventada [S1:T999].');
  assert.equal((await consulta(request('A Riqueza das Nações'))).status, 503);
  mockAI(t, () => 'Texto sem referência.');
  assert.equal((await consulta(request('A Riqueza das Nações'))).status, 503);
});

test('falha no banco preserva fichas e informa que nenhum trecho foi recuperado', async t => {
  t.mock.method(libraryStore, 'findPassages', async () => { throw new Error('indisponível'); });
  mockAI(t, () => 'A ficha apresenta esta interpretação [S1].');
  const response = await consulta(request('A Riqueza das Nações'));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.retrieval, 'unavailable');
  assert(data.sources.every(s => !s.passages));
});

test('filtro sem livros não busca trechos e a API de catálogo não aceita escrita', async t => {
  let calls = 0;
  t.mock.method(libraryStore, 'findPassages', async () => { calls++; return [row]; });
  mockAI(t, () => 'A ficha descreve dados institucionais [S1].');
  const response = await consulta(new Request('https://example.test/api/consulta', { method: 'POST', body: JSON.stringify({ question: 'dados oficiais', types: ['oficial'] }) }));
  assert.equal(response.status, 200);
  assert.equal(calls, 0);
  assert.equal((await biblioteca(new Request('https://example.test/api/biblioteca', {method:'POST'}))).status,405);
});

test('catálogo informa status persistido e falhas de disponibilidade sem resultados fictícios', async t => {
  t.mock.method(libraryStore, 'listEditions', async () => [edition, { ...pending, status:'pending', chunkCount:0 }]);
  const response = await biblioteca(new Request('https://example.test/api/biblioteca'));
  const data = await response.json();
  assert.equal(data.editions[0].status,'indexed');
  assert.equal(data.editions[1].status,'pending');
  t.mock.method(libraryStore,'listEditions', async () => { throw new Error('falha'); });
  assert.equal((await biblioteca(new Request('https://example.test/api/biblioteca'))).status,503);
});
