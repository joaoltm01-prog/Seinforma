import { sql, eq, and, inArray, desc, asc } from 'drizzle-orm';
import { editions, passages } from '../db/schema.js';
import { searchTerms, namedSources } from './library-search.mjs';
import { fontes } from '../src/corpus.js';

// Lazy initialization lets editorial-only queries and validation work during database outages.
async function database() { return (await import('../db/index.js')).db; }
export async function listEditions() {
  const db = await database();
  return db.select().from(editions).orderBy(editions.title);
}
export async function findPassages(question: string) {
  const terms = searchTerms(question);
  if (!terms.length) return [];
  const db = await database();
  const named = namedSources(question, fontes.filter(f => f.type === 'livro'));
  const vector = sql`to_tsvector('english', ${passages.content})`;
  const query = sql`to_tsquery('english', ${terms.join(' | ')})`;
  const rank = sql<number>`ts_rank_cd(${vector}, ${query})`;
  const matches = await db.select({ id: passages.id, sourceId: editions.sourceId, edition: editions,
    section: passages.section, paragraphStart: passages.paragraphStart, paragraphEnd: passages.paragraphEnd,
    page: passages.page, content: passages.content, rank })
    .from(passages).innerJoin(editions, eq(editions.id, passages.editionId))
    .where(and(eq(editions.status, 'indexed'), inArray(editions.rights, ['public_domain','open_license']),
      named.length ? inArray(editions.sourceId, named) : undefined, sql`${vector} @@ ${query}`))
    .orderBy(desc(rank), passages.id).limit(80);
  if (!matches.length && named.length) {
    return db.select({ id: passages.id, sourceId: editions.sourceId, edition: editions,
      section: passages.section, paragraphStart: passages.paragraphStart, paragraphEnd: passages.paragraphEnd,
      page: passages.page, content: passages.content })
      .from(passages).innerJoin(editions, eq(editions.id, passages.editionId))
      .where(and(eq(editions.status, 'indexed'), inArray(editions.rights, ['public_domain','open_license']), inArray(editions.sourceId, named)))
      .orderBy(asc(passages.ordinal), passages.id).limit(6);
  }
  const perBook = new Map<string, number>();
  return matches.filter(row => {
    const count = perBook.get(row.sourceId) || 0;
    perBook.set(row.sourceId, count + 1);
    return count < 3;
  }).slice(0, 9);
}

export const libraryStore = { findPassages, listEditions };
