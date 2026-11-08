// Audited seed recipe. The database, populated by the generated migration, is the runtime source of truth.
const base = { institution: 'Project Gutenberg', language: 'en', rights: 'public_domain', rightsVerifiedBrazil: true,
  rightsUrl: 'https://www.planalto.gov.br/ccivil_03/leis/l9610.htm', translator: null };
export const pilot = [
  { ...base, id: 'pg-3300', title: 'A Riqueza das Nações', originalTitle: 'An Inquiry into the Nature and Causes of the Wealth of Nations', author: 'Adam Smith', number: 3300,
    edition: 'Transcrição Gutenberg #3300; obra original de 1776, em inglês.', bodyStart: '^INTRODUCTION AND PLAN OF THE WORK\\.$',
    rightsNote: 'Original em inglês; Adam Smith faleceu em 1790. Prazo patrimonial brasileiro de 70 anos após o falecimento encerrado (art. 41). Sem tradução. Origem declara domínio público nos EUA; o prazo brasileiro foi verificado separadamente.' },
  { ...base, id: 'pg-34901', title: 'Sobre a Liberdade', originalTitle: 'On Liberty', author: 'John Stuart Mill', number: 34901,
    edition: 'Transcrição Gutenberg #34901, Walter Scott Publishing; texto original de 1859. Introdução de W. L. Courtney excluída.', bodyStart: '^CHAPTER I\\.$',
    rightsNote: 'Texto original em inglês de John Stuart Mill (falecido em 1873); prazo brasileiro encerrado (art. 41). Sem tradução. Introdução editorial excluída para evitar atribuição ao autor.' },
  { ...base, id: 'pg-7370', title: 'Segundo Tratado sobre o Governo', originalTitle: 'Second Treatise of Government', author: 'John Locke', number: 7370,
    edition: 'Transcrição Gutenberg #7370 do texto de 1690; a fonte declara excluir o material editorial moderno de C. B. Macpherson.', bodyStart: '^CHAPTER\\. I\\.$',
    rightsNote: 'Texto original em inglês de John Locke (falecido em 1704); prazo brasileiro encerrado (art. 41). Sem tradução. A fonte declara incluir somente o texto original de 1690, sem o material editorial moderno.' },
  { ...base, id: 'pg-3207', title: 'Leviatã', originalTitle: 'Leviathan', author: 'Thomas Hobbes', number: 3207,
    edition: 'Transcrição Gutenberg #3207, baseada no texto da primeira edição de 1651; notas iniciais do transcritor excluídas.', bodyStart: '^CHAPTER I\\. OF SENSE$',
    rightsNote: 'Original em inglês de Thomas Hobbes (falecido em 1679); prazo brasileiro encerrado (art. 41). Sem tradução. Notas editoriais iniciais excluídas.' },
  { ...base, id: 'pg-1497', title: 'A República', originalTitle: 'The Republic', author: 'Platão', number: 1497, translator: 'Benjamin Jowett (1817–1893)',
    edition: 'Transcrição Gutenberg #1497, tradução inglesa de Benjamin Jowett; introdução e análise excluídas.', bodyStart: '^ BOOK I\\.$',
    rightsNote: 'Platão é autor da Antiguidade. A tradução inglesa é de Benjamin Jowett, falecido em 1893; prazo brasileiro da tradução encerrado (arts. 7, XI, e 41). Não corresponde a uma tradução portuguesa moderna.' },
].map(b => ({ ...b, originUrl: `https://www.gutenberg.org/ebooks/${b.number}`, textUrl: `https://www.gutenberg.org/ebooks/${b.number}.txt.utf-8` }));
export const pending = {
  id: 'mia-manifesto', title: 'O Manifesto Comunista', originalTitle: 'Manifesto do Partido Comunista', author: 'Karl Marx e Friedrich Engels',
  language: 'pt', translator: null, edition: 'Edição portuguesa do Marxists Internet Archive; tradução e licença específica ainda não confirmadas.',
  institution: 'Marxists Internet Archive', originUrl: 'https://www.marxists.org/portugues/marx/1848/ManifestoDoPartidoComunista/index.htm',
  textUrl: null, rights: 'unconfirmed', rightsNote: 'Página bibliográfica acessível. O domínio público dos autores não confirma os direitos da tradução. Nenhum texto importado.',
  rightsUrl: 'https://www.marxists.org/admin/legal/cc/by-sa.htm',
};
