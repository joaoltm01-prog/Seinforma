import { writeFile, access } from 'node:fs/promises';
import { fontes } from '../src/corpus.js';
import { pilot, pending } from './library-pilot.mjs';
import { extractGutenberg, chunkText, mayImport } from '../lib/book-ingestion.mjs';

const target = process.argv[2];
if (!target || !/^netlify\/database\/migrations\/\d+_[a-z_]+\.sql$/.test(target)) {
  throw new Error('Informe um NOVO arquivo SQL em netlify/database/migrations com prefixo cronológico. Nunca sobrescreva migrações aplicadas.');
}
try { await access(target); throw new Error('Arquivo já existe; use uma nova migração.'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const quote = v => v == null ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replaceAll("'", "''")}'`;
const sql = ['-- Audited library seed. Content persists in Netlify Database; no live crawling during questions.'];
const checkedAt = new Date().toISOString();
const report = [];
async function get(url) {
  const host = new URL(url).hostname;
  for (let hop = 0; hop < 4; hop++) {
    const response = await fetch(url, { signal: AbortSignal.timeout(25000), redirect: 'manual' });
    if ([301,302,303,307,308].includes(response.status)) {
      const next = new URL(response.headers.get('location'), url);
      if (next.hostname === host && next.protocol === 'http:') next.protocol = 'https:';
      if (next.hostname !== host || next.protocol !== 'https:') throw new Error('Redirecionamento fora da biblioteca recusado.');
      url = next.href;
      await response.body?.cancel();
      continue;
    }
    if (!response.ok) throw new Error(`Biblioteca respondeu ${response.status}; sem contornar bloqueios.`);
    const text = await response.text();
    if (text.length > 6000000) throw new Error('Documento excede o limite do piloto.');
    return text;
  }
  throw new Error('Redirecionamentos excessivos.');
}
const robots = await get('https://www.gutenberg.org/robots.txt');
if (/Disallow:\s*\/(?:ebooks\/?|$)\s*$/m.test(robots)) throw new Error('robots.txt impede o acesso; revisar antes de importar.');
for (const book of [...pilot, pending]) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const source = fontes.find(f => f.title === book.title && f.author === book.author);
  if (!source) throw new Error(`Obra ausente do catálogo: ${book.title}`);
  const page = await get(book.originUrl);
  let chunks = [], checksum = null;
  if (mayImport(book)) {
    if (!page.includes('Public domain in the USA.') || !page.includes(`/ebooks/${book.number}.txt.utf-8`)) throw new Error('Edição ou direitos da origem mudaram; revisar.');
    // Only the exact UTF-8 download link verified on the edition page is fetched.
    const raw = await get(book.textUrl);
    const header = raw.slice(0, raw.indexOf('*** START')).replace(/\s+/g, ' ');
    if (!header.includes(`Title: ${book.originalTitle}`) || !header.includes(`Author: ${book.author === 'Platão' ? 'Plato' : book.author}`) ||
        (book.translator && !header.includes('Translator: Benjamin Jowett'))) throw new Error('Título, autoria ou tradutor não correspondem ao catálogo.');
    const parsed = extractGutenberg(raw, book);
    chunks = chunkText(parsed.content);
    checksum = parsed.checksum;
    if (!chunks.length) throw new Error('Nenhum trecho extraído.');
  }
  const columns = ['id','source_id','title','original_title','author','language','translator','edition','institution','origin_url','text_url','rights','rights_note','rights_url','status','checksum','chunk_count','checked_at'];
  const values = [book.id,source.id,book.title,book.originalTitle,book.author,book.language,book.translator,book.edition,book.institution,book.originUrl,book.textUrl,book.rights,book.rightsNote,book.rightsUrl,chunks.length ? 'indexed':'pending',checksum,chunks.length,checkedAt];
  sql.push(`INSERT INTO book_editions (${columns.join(',')}) VALUES (${values.map(quote).join(',')}) ON CONFLICT (id) DO UPDATE SET ${columns.slice(1).map(c => `${c}=EXCLUDED.${c}`).join(',')};`);
  sql.push(`DELETE FROM book_passages WHERE edition_id=${quote(book.id)};`);
  for (let i=0;i<chunks.length;i+=60) {
    const batch = chunks.slice(i,i+60).map(c => [book.id+'-'+c.ordinal,book.id,c.ordinal,c.section,c.paragraphStart,c.paragraphEnd,c.page,c.content]);
    sql.push(`INSERT INTO book_passages (id,edition_id,ordinal,section,paragraph_start,paragraph_end,page,content) VALUES\n${batch.map(r=>'('+r.map(quote).join(',')+')').join(',\n')};`);
  }
  report.push({ title: book.title, status: chunks.length ? 'indexed':'pending', chunks: chunks.length, characters: chunks.reduce((sum,c)=>sum+c.content.length,0), checksum });
}
await writeFile(target, sql.join('\n--> statement-breakpoint\n')+'\n', { flag: 'wx' });
console.log(JSON.stringify(report,null,2));
