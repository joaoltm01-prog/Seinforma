// Obras em domínio público com repositório aberto. Os links levam ao repositório, não a uma edição verificada:
// a edição e a tradução específicas ainda precisam ser conferidas antes de qualquer importação.
const R = {
  bbm: ["Biblioteca Brasiliana Guita e José Mindlin (USP)", "https://www.bbm.usp.br/"],
  dp: ["Portal Domínio Público (MEC)", "http://www.dominiopublico.gov.br/"],
  gut: ["Project Gutenberg", "https://www.gutenberg.org/"],
  wiki: ["Wikisource em português", "https://pt.wikisource.org/"],
  mia: ["Marxists Internet Archive", "https://www.marxists.org/portugues/"],
};
const slug = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const A = (spectrum, repo, rows) => rows.map(([title, author, year, thesis]) => ({
  id: slug(title), title, author, year, type: "livro", spectrum, tags: ["domínio público"], thesis, evidence: "", critique: "",
  open: { repo: R[repo][0], url: R[repo][1], rights: "public_domain" },
}));

export const abertos = [
  ...A("brasil", "bbm", [
    ["O Abolicionismo", "Joaquim Nabuco", "1883", "Argumento político e jurídico contra a escravidão, com atenção às suas marcas na sociedade brasileira."],
    ["Populações Meridionais do Brasil", "Oliveira Vianna", "1920", "Tipos sociais do centro-sul. Obra muito citada e muito criticada pelo viés racial e autoritário."],
  ]),
  ...A("brasil", "dp", [
    ["Os Sertões", "Euclides da Cunha", "1902", "Reportagem e ensaio sobre Canudos; mistura ciência da época, literatura e denúncia."],
    ["O Problema Nacional Brasileiro", "Alberto Torres", "1914", "Crítica ao Brasil importador de modelos; influente no nacionalismo e no pensamento autoritário."],
    ["A América Latina: Males de Origem", "Manoel Bomfim", "1905", "Leitura crítica da herança colonial e das elites, contrária ao racismo científico da época."],
  ]),
  ...A("internacional", "gut", [
    ["Sobre a Liberdade", "John Stuart Mill", "1859", "Defesa dos limites do poder da sociedade e do Estado sobre o indivíduo."],
    ["A Democracia na América", "Alexis de Tocqueville", "1835", "Igualdade, associações e risco de tirania da maioria, a partir dos EUA."],
    ["Reflexões sobre a Revolução na França", "Edmund Burke", "1790", "Base da tradição conservadora: cautela com rupturas e valor das instituições herdadas."],
    ["Dois Tratados sobre o Governo", "John Locke", "1689", "Direitos naturais, consentimento e limites ao poder; base do liberalismo clássico."],
  ]),
  ...A("internacional", "wiki", [
    ["Do Contrato Social", "Jean-Jacques Rousseau", "1762", "Soberania popular e vontade geral; muito lido por republicanos, democratas e críticos."],
  ]),
  ...A("esquerda", "mia", [
    ["O 18 Brumário de Luís Bonaparte", "Karl Marx", "1852", "Análise de um golpe: classes, representação e política. A tradução precisa ser conferida."],
    ["O Direito à Preguiça", "Paul Lafargue", "1880", "Crítica ao culto do trabalho feita por um marxista. A tradução precisa ser conferida."],
  ]),
];
