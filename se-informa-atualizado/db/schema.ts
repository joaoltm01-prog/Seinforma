import { sql } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const editions = pgTable('book_editions', {
  id: text().primaryKey(),
  sourceId: text('source_id').notNull(),
  title: text().notNull(),
  originalTitle: text('original_title').notNull(),
  author: text().notNull(),
  language: text().notNull(),
  translator: text(),
  edition: text().notNull(),
  institution: text().notNull(),
  originUrl: text('origin_url').notNull(),
  textUrl: text('text_url'),
  rights: text().notNull(),
  rightsNote: text('rights_note').notNull(),
  rightsUrl: text('rights_url').notNull(),
  status: text().notNull(),
  checksum: text(),
  chunkCount: integer('chunk_count').notNull().default(0),
  checkedAt: timestamp('checked_at', { withTimezone: true }).notNull(),
});

export const passages = pgTable('book_passages', {
  id: text().primaryKey(),
  editionId: text('edition_id').notNull().references(() => editions.id, { onDelete: 'cascade' }),
  ordinal: integer().notNull(),
  section: text().notNull(),
  paragraphStart: integer('paragraph_start').notNull(),
  paragraphEnd: integer('paragraph_end').notNull(),
  page: text(),
  content: text().notNull(),
}, table => [index('book_passages_edition_idx').on(table.editionId), index('book_passages_search_idx').using('gin', sql`to_tsvector('english', ${table.content})`)]);
