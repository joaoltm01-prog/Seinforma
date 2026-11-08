import { createHash } from 'node:crypto';

export function mayImport(book) {
  return ['public_domain', 'open_license'].includes(book.rights) && book.rightsVerifiedBrazil === true &&
    Boolean(book.rightsNote && book.rightsUrl && book.textUrl);
}

export function extractGutenberg(raw, book) {
  if (!mayImport(book)) throw new Error('Direitos não confirmados: importação recusada.');
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const start = text.match(/\*\*\* START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/);
  const end = text.match(/\*\*\* END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/);
  if (!start || !end || end.index <= start.index) throw new Error('Texto incompleto ou formato desconhecido; revisar manualmente.');
  const body = text.slice(start.index + start[0].length, end.index);
  const starts = [...body.matchAll(new RegExp(book.bodyStart, 'gm'))];
  if (!starts.length) throw new Error('Início da obra não localizado; importação recusada.');
  // Exclude tables of contents and introductions by other authors.
  const content = body.slice(starts.at(-1).index).trim();
  if (content.length < 10000) throw new Error('Conteúdo insuficiente para confirmar a obra.');
  return { content, checksum: createHash('sha256').update(raw).digest('hex') };
}

export function chunkText(content, maxLength = 2200) {
  const paragraphs = content.split(/\n\s*\n+/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const chunks = [];
  let section = 'Texto da obra', bookHeading = '', buffer = '', from = 1, to = 1;
  const flush = () => {
    if (buffer) chunks.push({ ordinal: chunks.length + 1, section, paragraphStart: from, paragraphEnd: to, page: null, content: buffer });
    buffer = '';
  };
  paragraphs.forEach((paragraph, i) => {
    const heading = paragraph.length < 240 && /^(?:BOOK\s+[IVXLCDM]+\.|CHAPTER[.\s]+[IVXLCDM]+\.|PART\s+[IVXLCDM]+\.|INTRODUCTION AND PLAN)/.test(paragraph);
    if (heading) {
      flush();
      if (/^(BOOK|PART)\s/.test(paragraph)) bookHeading = paragraph;
      section = [bookHeading, paragraph !== bookHeading ? paragraph : ''].filter(Boolean).join(' / ');
    }
    // Split long paragraphs without truncating them; each part retains its paragraph locator.
    const parts = paragraph.match(new RegExp(`[\\s\\S]{1,${maxLength}}(?:\\s|$)|[\\s\\S]{1,${maxLength}}`, 'g')) || [paragraph];
    for (const part of parts) {
      if (buffer && buffer.length + part.length + 2 > maxLength) flush();
      if (!buffer) from = i + 1;
      to = i + 1;
      buffer += (buffer ? '\n\n' : '') + part.trim();
    }
  });
  flush();
  return chunks;
}
