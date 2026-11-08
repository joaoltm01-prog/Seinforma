import test, { beforeEach } from 'node:test';
import { libraryStore } from '../lib/library.ts';
beforeEach(t => t.mock.method(libraryStore, 'findPassages', async () => []));
import assert from 'node:assert/strict';
import { fontes, spectrumLabels } from '../src/corpus.js';
import { pdfBooks } from '../src/pdf-books.js';
import { trails } from '../src/trails.js';
import { selectSources } from '../src/retrieval.js';
import consulta from '../netlify/functions/consulta.mts';

test('todas as referências do PDF continuam no acervo, com IDs únicos e classificação', () => {
  assert.equal(pdfBooks.length, 555);
  assert.equal(new Set(fontes.map(f => f.id)).size, fontes.length);
  for (const book of pdfBooks) assert(fontes.some(f => f.title === book.title && f.author === book.author));
  for (const book of fontes.filter(f => f.type === 'livro')) {
    assert(spectrumLabels[book.spectrum]);
    assert(book.political.reason && book.political.caveat);
  }
});

test('perguntar sobre 1984 inclui a obra em vez de perder a seleção para fichas genéricas', () => {
  const sources = selectSources('Como 1984 dialoga com dados oficiais, críticas e outras correntes?');
  assert(sources.some(source => source.title === '1984'));
  assert(!sources.some(source => ['Kadiwéu', 'Migo', 'O Mulo'].includes(source.title)));
});

test('comparações conservam títulos nomeados, mesmo quando são da mesma corrente', () => {
  const question = 'Compare O Caminho da Servidão, Capitalismo e Liberdade e A Riqueza das Nações.';
  const books = selectSources(question, ['livro']);
  for (const id of ['hayek', 'friedman', 'smith']) assert(books.some(book => book.id === id));
  assert(books.every(source => source.type === 'livro'));
});

test('busca lida com acentos e respeita tipos de fonte', () => {
  assert(selectSources('Vigiar e Punir', ['livro']).some(f => f.id === 'foucault'));
  assert(selectSources('inflação dados oficiais', ['oficial']).every(f => f.type === 'oficial'));
  assert.deepEqual(selectSources('zzzxxyyinexistente'), []);
});

test('trilhas apontam para obras existentes e preservam perspectivas distintas', () => {
  for (const trail of trails) {
    const books = trail.steps.map(step => fontes.find(f => f.title === step.title));
    assert(books.every(Boolean), trail.title);
    assert(new Set(books.map(book => book.spectrum)).size >= 3, trail.title);
  }
});

const request = body => new Request('https://example.test/api/consulta', { method: 'POST', body });
test('API rejeita bytes UTF-8 inválidos com erro legível, sem chamar IA', async () => {
  const response = await consulta(request(new Uint8Array([0x7b, 0xff, 0x7d])));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /UTF-8/);
});

test('API valida JSON, tamanho em bytes, campos e métodos antes de chamar IA', async () => {
  for (const body of ['{', 'null', '[]', '{}', JSON.stringify({question: 'Brasil', types: []}), JSON.stringify({question: 'Brasil', types: ['inexistente']})]) {
    assert.equal((await consulta(request(body))).status, 400);
  }
  assert.equal((await consulta(request('á'.repeat(7000)))).status, 413);
  assert.equal((await consulta(request(JSON.stringify({question: 'zzzxxyyinexistente'})))).status, 422);
  const response = await consulta(new Request('https://example.test/api/consulta'));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
});

test('API exige cinco seções com citações e entrega referências numeradas para a interface', async (t) => {
  const { default: OpenAI } = await import('openai');
  t.mock.method(OpenAI.Chat.Completions.prototype, 'create', async payload => {
    const schema = payload.response_format.json_schema.schema.properties.sections;
    assert.equal(schema.minItems, 5);
    assert.equal(schema.maxItems, 5);
    const pattern = new RegExp(schema.items.properties.paragraphs.items.pattern);
    assert(pattern.test('Interpretação [S2].'));
    assert(!pattern.test('Interpretação sem referência.'));
    return { choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({
      sections: Array.from({ length: 5 }, (_, i) => ({ title: `Seção ${i + 1}`, paragraphs: ['Interpretação da ficha [S2].'] }))
    }) } }] };
  });
  const response = await consulta(request(JSON.stringify({ question: 'O que é democracia?' })));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.sections.length, 5);
  assert.equal(data.sources.length, 1);
  assert.equal(data.sources[0].id, selectSources('O que é democracia?')[1].id);
  assert(data.sections.every(section => section.paragraphs[0].includes('[S1]')));
});
