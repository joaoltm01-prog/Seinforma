import { classifyBook, politicalLabels } from "./political-profiles.js";
import { pdfBooks } from "./pdf-books.js";
import { extras } from "./acervo.js";

export const typeLabels = {
  livro: "Livro",
  oficial: "Fonte oficial",
  noticia: "Notícia",
  checagem: "Checagem"
};

export const spectrumLabels = {
  ...politicalLabels,
  institucional: "Fonte institucional",
  brasil: "Fonte brasileira",
  internacional: "Fonte internacional"
};

const base = [
  {
    id: "hayek",
    title: "O Caminho da Servidão",
    author: "Friedrich Hayek",
    year: "1944",
    type: "livro",
    spectrum: "liberal",
    tags: ["planejamento", "mercado", "liberdade", "estado", "inflação"],
    thesis: "Argumenta que a concentração crescente de decisões econômicas no Estado tende a reduzir liberdades individuais, mesmo quando começa com objetivos igualitários.",
    evidence: "Usa a experiência europeia do entre-guerras para alertar sobre planejamento central, controles de preços e burocracia econômica.",
    critique: "Críticos respondem que mercados também concentram poder e que ausência de regulação pode gerar monopólios, crises e exclusão."
  },
  {
    id: "friedman",
    title: "Capitalismo e Liberdade",
    author: "Milton Friedman",
    year: "1962",
    type: "livro",
    spectrum: "liberal",
    tags: ["mercado", "educação", "moeda", "inflação", "estado mínimo"],
    thesis: "Defende mercados competitivos como condição para liberdade política e propostas como vouchers, renda mínima negativa e regras monetárias estáveis.",
    evidence: "Conecta política econômica a liberdade civil e trata inflação como fenômeno monetário.",
    critique: "A literatura empírica posterior questiona a suficiência de regras monetárias e os efeitos distributivos de reformas pró-mercado."
  },
  {
    id: "smith",
    title: "A Riqueza das Nações",
    author: "Adam Smith",
    year: "1776",
    type: "livro",
    spectrum: "liberal",
    tags: ["divisão do trabalho", "mercado", "comércio", "produtividade"],
    thesis: "Mostra como divisão do trabalho, trocas e acumulação aumentam produtividade, sem reduzir Smith a um defensor ingênuo do laissez-faire.",
    evidence: "Clássico fundador da economia política moderna, útil para distinguir mercado, moral e instituições.",
    critique: "Leituras atuais lembram que Smith também discutia simpatia moral, salários e limites do poder mercantil."
  },
  {
    id: "burke",
    title: "Reflexões sobre a Revolução na França",
    author: "Edmund Burke",
    year: "1790",
    type: "livro",
    spectrum: "conservador",
    tags: ["tradição", "reforma", "revolução", "prudência"],
    thesis: "Desconfia de rupturas totais guiadas por razão abstrata e valoriza instituições herdadas, reforma gradual e prudência política.",
    evidence: "Torna-se referência para críticas a projetos revolucionários que prometem recompletar a sociedade do zero.",
    critique: "A tradição pode preservar privilégios; o desafio é distinguir prudência de imobilismo diante de injustiças."
  },
  {
    id: "popper",
    title: "A Sociedade Aberta e Seus Inimigos",
    author: "Karl Popper",
    year: "1945",
    type: "livro",
    spectrum: "institucional",
    tags: ["historicismo", "falibilidade", "democracia", "ciência"],
    thesis: "Ataca a ideia de leis históricas inevitáveis e defende instituições que permitam corrigir governos sem violência.",
    evidence: "Fornece critério antifatalista: boas instituições não acertam sempre, mas tornam erros corrigíveis.",
    critique: "Pode subestimar como desigualdades materiais limitam, na prática, a abertura política."
  },
  {
    id: "marx",
    title: "O Capital",
    author: "Karl Marx",
    year: "1867",
    type: "livro",
    spectrum: "esquerda",
    tags: ["mais-valia", "classes", "acumulação", "trabalho", "capitalismo"],
    thesis: "Analisa a produção capitalista como relação social baseada na exploração do trabalho e na acumulação de capital.",
    evidence: "Oferece vocabulário para discutir valor, crise, concentração e conflito distributivo.",
    critique: "Economias de mercado mudaram desde o século XIX; há debate sobre teoria do valor, serviços, Estado de bem-estar e inovação."
  },
  {
    id: "foucault",
    title: "Vigiar e Punir",
    author: "Michel Foucault",
    year: "1975",
    type: "livro",
    spectrum: "esquerda",
    tags: ["poder", "disciplina", "prisão", "instituições", "corpos"],
    thesis: "Descreve a passagem de punições espetaculares para formas disciplinares de vigilância presentes em prisões, escolas, hospitais e quartéis.",
    evidence: "Ajuda a ler poder como prática difusa, não apenas como ordem estatal.",
    critique: "É criticado por ampliar tanto o conceito de poder que fica difícil medir responsabilidade institucional e resultados."
  },
  {
    id: "piketty",
    title: "O Capital no Século XXI",
    author: "Thomas Piketty",
    year: "2013",
    type: "livro",
    spectrum: "esquerda",
    tags: ["desigualdade", "renda", "patrimônio", "tributação", "r>g"],
    thesis: "Sustenta que, quando o retorno sobre o capital supera o crescimento econômico por longos períodos, a concentração de patrimônio tende a aumentar.",
    evidence: "Mobiliza séries históricas de renda e riqueza para discutir desigualdade em economias avançadas.",
    critique: "Há contestações sobre mensuração de capital, papel da habitação, transferências públicas e efeitos de políticas redistributivas."
  },
  {
    id: "tocqueville",
    title: "A Democracia na América",
    author: "Alexis de Tocqueville",
    year: "1835/1840",
    type: "livro",
    spectrum: "institucional",
    tags: ["democracia", "associações", "costumes", "maioria", "liberdade"],
    thesis: "Estuda como igualdade de condições, associações civis e costumes sustentam — ou ameaçam — a liberdade democrática.",
    evidence: "Equilibra instituições formais com vida associativa e cultura cívica.",
    critique: "A América observada era excludente; escravatura e exclusão de mulheres limitam generalizações diretas."
  },
  {
    id: "weber",
    title: "Economia e Sociedade",
    author: "Max Weber",
    year: "1922",
    type: "livro",
    spectrum: "institucional",
    tags: ["burocracia", "legitimidade", "poder", "racionalização", "ética"],
    thesis: "Oferece ferramentas para comparar dominação tradicional, carismática e legal-racional, além da burocracia como forma de organização.",
    evidence: "Permite analisar Estado, partidos e administração sem reduzi-los a interesse econômico imediato.",
    critique: "O modelo ideal de burocracia pode normalizar impessoalidade e menosprezar conflitos de classe, raça e gênero."
  },
  {
    id: "acemoglu",
    title: "Por que as Nações Fracassam",
    author: "Daron Acemoglu e James A. Robinson",
    year: "2012",
    type: "livro",
    spectrum: "institucional",
    tags: ["instituições", "desenvolvimento", "desigualdade", "poder"],
    thesis: "Defende que instituições inclusivas sustentam prosperidade de longo prazo, enquanto instituições extrativistas concentram renda e poder.",
    evidence: "Compara trajetórias nacionais e colônias para explicar divergências de desenvolvimento.",
    critique: "Críticos apontam risco de circularidade: instituições boas explicam crescimento, mas crescimento também pode melhorar instituições."
  },
  {
    id: "freyre",
    title: "Casa-Grande & Senzala",
    author: "Gilberto Freyre",
    year: "1933",
    type: "livro",
    spectrum: "brasil",
    tags: ["brasil", "escravidão", "mestiçagem", "formação social", "cultura"],
    thesis: "Interpreta a formação brasileira pela convivência entre portugueses, indígenas e africanos, com ênfase em cultura, alimentação, família e arquitetura.",
    evidence: "Marco da sociologia brasileira e da ideia de mestiçagem como eixo nacional.",
    critique: "Leituras posteriores criticam a suavização da violência escravocrata e o uso político da mestiçagem como mito de harmonia."
  },
  {
    id: "sergio-buarque",
    title: "Raízes do Brasil",
    author: "Sérgio Buarque de Holanda",
    year: "1936",
    type: "livro",
    spectrum: "brasil",
    tags: ["brasil", "patrimonialismo", "cordialidade", "estado", "cultura política"],
    thesis: "Investiga traços duradouros da cultura política brasileira, incluindo a dificuldade de separar interesse público e relações pessoais.",
    evidence: "Central para debates sobre patrimonialismo, burocracia e sociabilidade no Brasil.",
    critique: "O 'homem cordial' é frequentemente lido de forma rasa; o próprio debate acadêmico alerta contra essencialismo cultural."
  },
  {
    id: "caio-prado",
    title: "Formação do Brasil Contemporâneo",
    author: "Caio Prado Jr.",
    year: "1942",
    type: "livro",
    spectrum: "esquerda",
    tags: ["brasil", "colônia", "economia", "escravidão", "capitalismo"],
    thesis: "Lê a formação brasileira a partir da inserção colonial na economia internacional e das estruturas de trabalho compulsório.",
    evidence: "Contraponto econômico-material a leituras mais culturais da formação nacional.",
    critique: "Pode subestimar mediações culturais e políticas que não derivam diretamente da estrutura econômica."
  },
  {
    id: "ibge",
    title: "IBGE — estatísticas e censos",
    author: "Instituto Brasileiro de Geografia e Estatística",
    year: "contínuo",
    type: "oficial",
    spectrum: "brasil",
    tags: ["população", "renda", "desigualdade", "censo", "pnad", "brasil"],
    thesis: "Produz dados primários sobre população, domicílios, trabalho, renda, educação e território.",
    evidence: "Base factual para ancorar debate sobre desigualdade, demografia e políticas públicas no Brasil.",
    critique: "Dados oficiais têm defasagem, cortes amostrais e limites de comparação; precisam de nota metodológica."
  },
  {
    id: "bcb",
    title: "Banco Central do Brasil",
    author: "Autoridade monetária",
    year: "contínuo",
    type: "oficial",
    spectrum: "brasil",
    tags: ["inflação", "juros", "câmbio", "focus", "crédito", "brasil"],
    thesis: "Publica séries de inflação, juros, câmbio, crédito, expectativas e relatórios de estabilidade.",
    evidence: "Fonte primária para perguntas macroeconômicas brasileiras.",
    critique: "A instituição é produtora e parte interessada do regime de política monetária; convém confrontar com literatura e dados fiscais."
  },
  {
    id: "transparencia",
    title: "Portal da Transparência",
    author: "Controladoria-Geral da União",
    year: "contínuo",
    type: "oficial",
    spectrum: "brasil",
    tags: ["gasto público", "orçamento", "servidores", "contratos", "brasil"],
    thesis: "Disponibiliza dados sobre execução orçamentária, transferências, contratos, servidores e benefícios.",
    evidence: "Permite checar afirmações sobre gasto público com registros administrativos.",
    critique: "Classificações orçamentárias podem ocultar finalidade real; dados precisam de cruzamento e contexto."
  },
  {
    id: "worldbank",
    title: "World Bank Open Data",
    author: "Banco Mundial",
    year: "contínuo",
    type: "oficial",
    spectrum: "internacional",
    tags: ["pib", "pobreza", "educação", "saúde", "desigualdade", "comparação internacional"],
    thesis: "Reúne indicadores comparáveis de desenvolvimento para países e agregados regionais.",
    evidence: "Útil para contextualizar o Brasil em séries internacionais.",
    critique: "Indicadores harmonizados podem perder especificidades institucionais nacionais."
  },
  {
    id: "reuters-ap",
    title: "Reuters / Associated Press",
    author: "Agências internacionais",
    year: "contínuo",
    type: "noticia",
    spectrum: "internacional",
    tags: ["atualidade", "agência", "verificação", "cobertura", "internacional"],
    thesis: "Fornecem cobertura factual rápida, com padrões de verificação, correção e distribuição para múltiplos veículos.",
    evidence: "Servem como trilha para eventos recentes antes de análises mais lentas.",
    critique: "Rapidez pode privilegiar declarações oficiais e cortes de contexto; notícia não substitui dado estrutural."
  },
  {
    id: "lupa",
    title: "Agência Lupa",
    author: "Fact-checking brasileiro",
    year: "contínuo",
    type: "checagem",
    spectrum: "brasil",
    tags: ["fact-checking", "eleições", "saúde", "economia", "brasil"],
    thesis: "Verifica afirmações públicas e conteúdos virais, classificando precisão, contexto e origem.",
    evidence: "Boa camada para checar frases prontas, números soltos e discurso de autoridade.",
    critique: "Checagem avalia afirmações específicas; não encerra disputas sobre valores, prioridades ou modelos de sociedade."
  },
  {
    id: "aos-fatos",
    title: "Aos Fatos",
    author: "Fact-checking brasileiro",
    year: "contínuo",
    type: "checagem",
    spectrum: "brasil",
    tags: ["fact-checking", "política", "transparência", "brasil"],
    thesis: "Checa declarações de agentes públicos e monitora desinformação em política e economia.",
    evidence: "Complementa agências ao documentar método, fontes e grau de confiança.",
    critique: "A escolha do que checar também é editorial; por isso o sistema deve registrar cobertura e critérios."
  }
];

// Preserve existing editorial fichas when title and author already match.
const key = (title, author) => `${title}|${author}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9|]/g, "");
const catalog = [...base, ...extras];
for (const [index, book] of pdfBooks.entries()) {
  const existing = catalog.find(source => key(source.title, source.author) === key(book.title, book.author));
  if (existing) {
    Object.assign(existing, { pdfPage: book.pdfPage, category: book.category });
    continue;
  }
  catalog.push({ ...book, id: `pdf-${index + 1}`, type: "livro", spectrum: "nao-classificado",
    tags: [book.category], bibliographyOnly: true,
    thesis: "Referência bibliográfica do PDF. Tese central e crítica ainda não foram revisadas.",
    evidence: "O documento fornecido informa título, autoria e ano; não inclui o texto da obra.", critique: "" });
}
export const fontes = catalog.map(source => {
  if (source.type !== "livro") return source;
  const political = classifyBook(source);
  return { ...source, spectrum: political.spectrum, political };
});

