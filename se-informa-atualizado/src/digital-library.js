// Discovery configuration, not a claim that any library has indexed our catalog.
export const libraries = [
  { name: 'Marxists Internet Archive', url: 'https://www.marxists.org/portugues/', focus: 'Teoria política e marxismo; conferir os direitos da tradução.' },
  { name: 'Wikisource', url: 'https://pt.wikisource.org/', focus: 'Textos e transcrições; conferir a licença de cada edição.' },
  { name: 'Portal Domínio Público', url: 'http://www.dominiopublico.gov.br/', focus: 'Obras digitalizadas em português.' },
  { name: 'Biblioteca Brasiliana USP', url: 'https://www.bbm.usp.br/', focus: 'Edições históricas e estudos brasileiros.' },
  { name: 'Project Gutenberg', url: 'https://www.gutenberg.org/', focus: 'Clássicos em diversos idiomas; verificar também os direitos no Brasil.' },
  { name: 'Biblioteca Nacional Digital', url: 'https://bndigital.bn.gov.br/', focus: 'Livros e documentos históricos brasileiros.' },
];
export const rightsLabels = {
  public_domain: 'Domínio público', open_license: 'Licença aberta', unconfirmed: 'Direitos pendentes de verificação',
};
export const digitalStatusLabels = {
  indexed: 'Texto completo indexado', pending: 'Direitos pendentes de verificação',
  bibliography: 'Somente ficha bibliográfica', unavailable: 'Índice temporariamente indisponível',
};
