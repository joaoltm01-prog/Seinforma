// Taxonomia editorial do Se Informe. Hipóteses de leitura, não filiação partidária.
export const politicalLabels = {
  marxista: 'Marxismo e materialismo histórico',
  socialista: 'Socialismo democrático e anarquismo',
  critica: 'Teoria crítica e pós-estruturalismo',
  progressista: 'Progressismo e justiça social',
  anticolonial: 'Pensamento anticolonial e antirracista',
  indigena: 'Pensamento indígena e socioambiental',
  desenvolvimentista: 'Desenvolvimentismo e estruturalismo',
  socialdemocrata: 'Social-democracia e reformismo',
  liberal: 'Liberalismo',
  libertario: 'Libertarianismo e objetivismo',
  conservador: 'Conservadorismo',
  autoritario: 'Direita autoritária e integralismo',
  classico: 'Filosofia clássica e moderna',
  academico: 'Análise acadêmica sem eixo único',
  literario: 'Literatura e testemunho',
  plural: 'Perspectivas plurais ou disputadas'
};

const profiles = new Map();
function group(spectrum, tradition, authors, reason, caveat) {
  for (const author of authors.split('|')) {
    if (profiles.has(author)) throw new Error(`Perfil duplicado: ${author}`);
    profiles.set(author, { spectrum, tradition, reason, caveat });
  }
}

group('marxista', 'Marxismo e materialismo histórico',
'Karl Marx|Karl Marx e Friedrich Engels|Friedrich Engels|Antonio Gramsci|Georg Lukács|Louis Althusser|Rosa Luxemburgo|Leon Trótski|Vladimir Lenin|Nikolai Bukharin e Evgeni Preobrazhenski|István Mészáros|David Harvey|Immanuel Wallerstein|Giovanni Arrighi|Eric Williams|C. L. R. James|Walter Rodney|E. P. Thompson|Eric Hobsbawm|Eric Hobsbawm e Terence Ranger|Perry Anderson|Ernest Mandel|Caio Prado Jr.|Ruy Mauro Marini|José Carlos Mariátegui|Theotonio dos Santos|Vânia Bambirra|André Gunder Frank|Florestan Fernandes|Roger Bastide e Florestan Fernandes|Francisco de Oliveira|Nelson Werneck Sodré|Jacob Gorender|Fernando Novais|Emília Viotti da Costa|Clóvis Moura|Octavio Ianni|Leandro Konder|Nicos Poulantzas|René Dreifuss|Ricardo Antunes|Marcelo Ridenti|Christopher Hill|Kohei Saito|Silvia Federici|Guy Debord',
'A tradição intelectual associada à autoria privilegia relações de classe, produção, exploração ou desenvolvimento histórico do capitalismo.',
'O campo inclui correntes e métodos divergentes; marxismo não implica apoio a um regime ou partido. A aplicação a cada obra exige considerar gênero e contexto.');

group('critica', 'Teoria crítica, hegemonia e crítica da modernidade',
'Theodor Adorno e Max Horkheimer|Herbert Marcuse|Walter Benjamin|Raymond Williams|Mark Fisher|Chantal Mouffe|Ernesto Laclau e Chantal Mouffe|Nancy Fraser|Cinzia Arruzza, Tithi Bhattacharya e Nancy Fraser|Jürgen Habermas|Marilena Chaui|Pierre Bourdieu|Pierre Bourdieu e Jean-Claude Passeron|Michel Foucault|Jean-François Lyotard|Byung-Chul Han|Zygmunt Bauman|Ulrich Beck|Stuart Hall|Luiz Werneck Vianna|Roberto Schwarz|Antonio Candido',
'A inserção intelectual da autoria envolve crítica da dominação, das instituições, da cultura ou da reprodução das desigualdades.',
'Teoria crítica, estudos culturais e pós-estruturalismo não formam uma escola única. A categoria aproxima problemas de pesquisa, sem equiparar métodos ou posições políticas.');

group('socialista', 'Socialismo democrático, autogestão e crítica libertária',
'Pierre-Joseph Proudhon|David Graeber|Noam Chomsky|Edward Herman e Noam Chomsky|André Gorz|Paul Singer|George Orwell|Albert Camus|Jean-Paul Sartre',
'A trajetória intelectual da autoria se relaciona à crítica da concentração de poder e a vertentes da esquerda, com diferenças sobre Estado, liberdade e transformação social.',
'Anarquismo, socialismo democrático e existencialismo político não são equivalentes; há divergências profundas entre estes autores, inclusive sobre o marxismo.');

group('progressista', 'Feminismo e crítica das desigualdades',
'Simone de Beauvoir|Betty Friedan|bell hooks|Judith Butler|Kate Millett|Chimamanda Ngozi Adichie|Djamila Ribeiro|Michelle Alexander|Isabel Wilkerson|Guy Standing|Paulo Freire|Anísio Teixeira|Naomi Klein|Boaventura de Sousa Santos|Boaventura de Sousa Santos e Maria Paula Meneses|Eduardo Galeano|Luis Felipe Miguel|Rosana Pinheiro-Machado|Jessé Souza',
'A obra intelectual da autoria se aproxima de agendas de emancipação, direitos, educação crítica ou enfrentamento de desigualdades sociais.',
'Progressismo reúne tradições distintas. Este enquadramento não atribui filiação partidária nem pressupõe acordo entre feminismos, pedagogias e teorias sociais.');

group('anticolonial', 'Crítica colonial e pensamento antirracista',
'José Martí|Frantz Fanon|Edward Said|Achille Mbembe|W. E. B. Du Bois|Aimé Césaire|Gayatri Spivak|Homi Bhabha|Paul Gilroy|Kwame Nkrumah|Amílcar Cabral|Steve Biko|Malcolm X|Ta-Nehisi Coates|Angela Davis|Silvio Almeida|Abdias Nascimento|Kabengele Munanga|Carlos Hasenbalg|Sueli Carneiro|Lélia Gonzalez',
'A tradição intelectual da autoria trata de colonialismo, racialização, emancipação e distribuição do poder entre grupos historicamente desiguais.',
'Anticolonialismo e antirracismo incluem correntes liberais, socialistas e nacionalistas; o rótulo não resolve suas divergências sobre classe, cultura ou estratégias políticas.');

group('indigena', 'Pensamento indígena e crítica socioambiental',
'Ailton Krenak|Davi Kopenawa e Bruce Albert|Daniel Munduruku|Eliane Brum|Eduardo Viveiros de Castro|Manuela Carneiro da Cunha (org.)|Pierre Clastres',
'A produção da autoria dialoga com povos indígenas, território, crítica da centralização do poder ou contestação dos custos sociais e ambientais do desenvolvimento.',
'Autores indígenas, antropólogos e jornalistas ocupam lugares diferentes. A categoria não transforma povos diversos em uma ideologia única nem atribui identidade indígena a todos os autores.');

group('desenvolvimentista', 'Estruturalismo, dependência e desenvolvimento',
'Celso Furtado|Maria da Conceição Tavares|Maria da Conceição Tavares e José Luís Fiori|Raúl Prebisch|Ignácio Rangel|Luiz Carlos Bresser-Pereira|Hélio Jaguaribe|Darcy Ribeiro|Darcy Ribeiro e Carlos de Araújo Moreira Neto|Josué de Castro|Ha-Joon Chang|Mariana Mazzucato|John Kenneth Galbraith|John Maynard Keynes|Dani Rodrik',
'A produção intelectual da autoria enfatiza instituições, transformação produtiva, ação pública ou limites estruturais do desenvolvimento.',
'Keynesianismo, estruturalismo e nacional-desenvolvimentismo têm diferenças importantes. A posição sobre Estado e mercado varia por obra e período.');

group('socialdemocrata', 'Reformismo, redistribuição e economia do bem-estar',
'Thomas Piketty|Anthony Atkinson|Branko Milanovic|Joseph Stiglitz|Rutger Bregman|Mark Blyth|Tony Judt|André Singer|Fernando Gabeira|Celso Rocha de Barros|Kate Raworth|Michael Walzer|Michael Sandel|Charles Taylor',
'A produção da autoria dialoga com reformas democráticas, justiça distributiva, crítica das desigualdades ou limites sociais dos mercados.',
'O enquadramento é aproximativo: comunitarismo, economia ecológica e social-democracia não coincidem. Uma crítica ao mercado não implica sua rejeição integral.');

group('liberal', 'Liberalismo clássico, econômico ou igualitário',
'Friedrich Hayek|Milton Friedman|Milton e Rose Friedman|Milton Friedman e Anna Schwartz|Adam Smith|Ludwig von Mises|Henry Hazlitt|Hernando de Soto|John Locke|José Guilherme Merquior|Roberto Campos|Frédéric Bastiat|Benjamin Constant|Alexis de Tocqueville|John Stuart Mill|Isaiah Berlin|Karl Popper|John Rawls|Amartya Sen|Deirdre McCloskey|James Buchanan|James Buchanan e Gordon Tullock|Ronald Coase|Johan Norberg|Matt Ridley|Antonio Paim|José Osvaldo de Meira Penna|Eugênio Gudin|Edmar Bacha|Gustavo Franco|Eduardo Giannetti|Mario Vargas Llosa|Plínio Apuleyo Mendoza, Carlos Alberto Montaner e Mario Vargas Llosa|Bruno Garschagen|Denis Rosenfield|Thomas Paine|Mary Wollstonecraft',
'A tradição intelectual da autoria se relaciona a liberdades individuais, limites ao poder, direitos ou instituições de mercado.',
'O liberalismo igualitário de Rawls e Sen diverge do liberalismo econômico de Hayek e Mises. A categoria não implica uma posição única sobre redistribuição ou intervenção pública.');

group('libertario', 'Libertarianismo e objetivismo',
'Murray Rothbard|Robert Nozick|Ayn Rand',
'A produção filosófica da autoria destaca propriedade, liberdade individual e forte limitação ou rejeição da ação estatal.',
'Estado mínimo, anarcocapitalismo e objetivismo são posições diferentes e por vezes incompatíveis. Obras de ficção exigem leitura própria.');

group('conservador', 'Conservadorismo e crítica da modernidade política',
'Edmund Burke|Joseph de Maistre|Michael Oakeshott|Russell Kirk|Roger Scruton|Patrick Deneen|Thomas Sowell|Leo Strauss|Allan Bloom|Yoram Hazony|Jordan Peterson|Olavo de Carvalho|Flávio Gordon|Luiz Felipe Pondé|Rodrigo Constantino|Leandro Narloch|Denis Rosenfield, João Pereira Coutinho e Luiz Felipe Pondé|Gilberto Freyre|Aleksandr Soljenítsin|Samuel Huntington|Henry Kissinger|Oswald Spengler|Alasdair MacIntyre|Flávio Bolsonaro',
'A produção ou a intervenção pública da autoria se associa a tradições conservadoras, crítica de projetos progressistas ou valorização da ordem e da continuidade histórica.',
'Conservadorismo cultural, liberalismo econômico, tradicionalismo e realismo diplomático não são equivalentes. A etiqueta da trajetória não determina cada argumento de uma obra.');

group('autoritario', 'Autoritarismo, decisionismo e integralismo',
'Carl Schmitt|Plínio Salgado|Oliveira Vianna',
'A produção política da autoria se vincula a projetos de autoridade concentrada, crítica do parlamentarismo liberal ou organização nacional autoritária.',
'Decisionismo, integralismo e autoritarismo brasileiro têm contextos próprios. Estudar esses textos não equivale a endossá-los.');

group('classico', 'Filosofia política anterior aos eixos contemporâneos',
'Platão|Aristóteles|Nicolau Maquiavel|Thomas Hobbes|Jean-Jacques Rousseau|Montesquieu|Hamilton, Madison e Jay|Immanuel Kant|G. W. F. Hegel|Friedrich Nietzsche',
'O texto pertence a debates fundadores sobre poder, justiça, conhecimento ou organização social que antecedem as divisões políticas atuais.',
'Aplicar diretamente esquerda, centro ou direita produziria anacronismo. As apropriações posteriores desses autores são diversas e conflitantes.');

group('academico', 'Pesquisa histórica e social; sem posição política única da obra',
'Max Weber|Émile Durkheim|Marcel Mauss|Norbert Elias|Norbert Elias e John Scotson|Claude Lévi-Strauss|Clifford Geertz|Bronisław Malinowski|Benedict Anderson|Theda Skocpol|Barrington Moore Jr.|Robert Dahl|Anthony Downs|Adam Przeworski|Robert Putnam|Arend Lijphart|Daron Acemoglu e James Robinson|Daron Acemoglu e James A. Robinson|Abhijit Banerjee e Esther Duflo|Angus Deaton|Paul Collier|Jeffrey Sachs|Mancur Olson|Rodrigo Patto Sá Motta|Steven Levitt e Stephen Dubner|Niall Kishtainy|Tomáš Sedláček|Joseph Schumpeter|Thorstein Veblen|Manuel Castells|Hans Rosling|Jonathan Haidt|Steven Pinker|Thomas Kuhn|E. H. Carr|Robert Paxton|Jason Stanley|Timothy Snyder|Anne Applebaum|Orlando Figes|Simon Sebag Montefiore|Jung Chang e Jon Halliday|Frank Dikötter|Jung Chang|Ian Kershaw|Richard Evans|Christopher Browning|John Lewis Gaddis|Alfred Stepan|Thomas Skidmore|Carlos Fico|Daniel Aarão Reis|Maria Helena Moreira Alves|Maud Chirio|Elio Gaspari|Lira Neto|Jorge Ferreira|Maria Helena Capelato|Angela Alonso|Fernando Limongi e Argelina Figueiredo|Marcos Nobre|Sérgio Abranches|Steven Levitsky e Daniel Ziblatt|Camila Rocha|Bruno Paes Manso|Piero Leirner|João Cezar de Castro Rocha|Luiz Maklouf Carvalho|José Murilo de Carvalho|Victor Nunes Leal|Raymundo Faoro|Sérgio Buarque de Holanda|Roberto DaMatta|Luiz Felipe de Alencastro|Lilia Schwarcz|Lilia Schwarcz e Heloisa Starling|Boris Fausto|Mary del Priore|Laurentino Gomes|Sidney Chalhoub|João José Reis|Luís da Câmara Cascudo|Wanderley Guilherme dos Santos',
'O cadastro trata a obra como pesquisa, interpretação histórica ou análise de instituições; o tema estudado não estabelece por si só uma filiação política.',
'Esta categoria não significa neutralidade. Pressupostos, seleção de evidências e posições pessoais podem ser discutidos; classificar o autor não basta para classificar o texto.');

group('plural', 'Perspectiva plural ou de enquadramento disputado',
'Umberto Eco|Hannah Arendt|Norberto Bobbio|Norberto Bobbio, Nicola Matteucci e Gianfranco Pasquino|F. H. Cardoso e Enzo Faletto|Fernando Henrique Cardoso|Francis Fukuyama|Octavio Paz|Martin Heidegger|Stéphane Courtois et al.|Luiz Bernardo Pericás e Lincoln Secco (orgs.)|Coletânea (Quipá Editora)|Nina Rodrigues',
'A diversidade de gêneros, a evolução intelectual ou a composição coletiva impedem reduzir esta autoria a uma posição única válida para todas as obras.',
'Ambiguidade não é isenção: investigue argumentos, contexto e recepção. Autoria coletiva e mudança histórica exigem discriminar contribuições.');

group('literario', 'Literatura, memória e testemunho social',
'Virginia Woolf|Anne Frank|Primo Levi|Victor Klemperer|Carolina Maria de Jesus|Conceição Evaristo|Machado de Assis|Lima Barreto|João Guimarães Rosa|Jorge Amado|Aluísio Azevedo|Graciliano Ramos|Mário de Andrade|Oswald de Andrade|Euclides da Cunha|Marcelo Rubens Paiva|Fernando Morais',
'O gênero literário, memorialístico ou biográfico exige distinguir a voz narrativa, a experiência relatada e as posições políticas da autoria.',
'Literatura e testemunho têm implicações políticas, mas personagens e acontecimentos narrados não são automaticamente teses endossadas pelo autor.');

// Distinções mais específicas e exceções por obra prevalecem sobre a trajetória do autor.
const nuances = new Map([
  ['Friedrich Hayek', 'Liberalismo clássico · Escola Austríaca'],
  ['Ludwig von Mises', 'Liberalismo econômico · Escola Austríaca'],
  ['John Rawls', 'Liberalismo igualitário'], ['Amartya Sen', 'Liberalismo igualitário · abordagem das capacidades'],
  ['Thomas Sowell', 'Liberalismo econômico · conservadorismo social'],
  ['Gilberto Freyre', 'Interpretação culturalista · recepção conservadora'],
  ['Milton Santos', 'Geografia crítica · crítica da globalização'],
  ['Darcy Ribeiro', 'Antropologia · nacional-desenvolvimentismo'],
  ['Florestan Fernandes', 'Sociologia crítica · socialismo'],
  ['Hannah Arendt', 'Republicanismo · crítica do totalitarismo'],
  ['Norberto Bobbio', 'Liberal-socialismo · democracia e direitos'],
  ['Fernando Henrique Cardoso', 'Sociologia da dependência · trajetória social-democrata'],
  ['Martin Heidegger', 'Filosofia existencial · vínculo histórico com o nazismo'],
  ['Nina Rodrigues', 'Racialismo científico histórico'],
  ['Patrick Deneen', 'Conservadorismo pós-liberal'],
  ['Noam Chomsky', 'Socialismo libertário'],
  ['Joseph de Maistre', 'Tradicionalismo contrarrevolucionário'],
  ['Karl Polanyi', 'Economia institucional · crítica da sociedade de mercado']
]);
// Perfis adicionais explicitamente definidos para não inferir posições pela seção do PDF.
group('socialista', 'Socialismo e crítica da sociedade de mercado', 'Karl Polanyi',
'A obra de Polanyi é associada à crítica do mercado autorregulado e à inserção da economia nas relações sociais.',
'Sua crítica dialoga com o socialismo e o institucionalismo, sem se reduzir ao marxismo ou à oposição simples entre Estado e mercado.');
group('critica', 'Geografia crítica', 'Milton Santos|Milton Santos e Maria Laura Silveira',
'A produção geográfica da autoria examina território, cidadania e desigualdades na organização econômica do espaço.',
'O enquadramento crítico não dispensa examinar a escala territorial, os dados e os conceitos próprios de cada obra.');
group('liberal', 'Liberalismo e abolicionismo', 'Joaquim Nabuco',
'A produção política de Nabuco se insere no abolicionismo e na tradição liberal do Brasil imperial.',
'A defesa da abolição coexistiu com posições monarquistas; categorias políticas atuais não se transferem integralmente ao século XIX.');
group('progressista', 'Direitos humanos e denúncia da repressão', 'Arquidiocese de São Paulo',
'A obra documenta repressão e tortura sob uma perspectiva de direitos humanos.',
'A autoria institucional religiosa não deve ser convertida em filiação partidária ou posição única da Igreja.');

const fiction = new Set(['A Revolta de Atlas', 'A Nascente', 'A Revolução dos Bichos', '1984', 'Maíra', 'Utopia Selvagem', 'O Mulo', 'Migo']);
export function classifyBook(book) {
  const profile = profiles.get(book.author);
  if (!profile) throw new Error(`Autoria sem classificação: ${book.author}`);
  let result = { ...profile, tradition: nuances.get(book.author) || profile.tradition };
  if (fiction.has(book.title)) result = {
    ...result, spectrum: 'literario', tradition: `Ficção · contexto: ${result.tradition}`,
    reason: 'Obra de ficção com interpretação política. A tradição da autoria é apresentada como contexto, sem equiparar narrador e autor.',
    caveat: 'Leia a construção literária e as interpretações concorrentes; uma alegoria ou romance não é evidência factual direta.'
  };
  if (book.title === 'Estruturas Sintáticas e Poder') result = {
    spectrum: 'plural', tradition: 'Referência bibliográfica a conferir',
    reason: 'O PDF registra este título sob Noam Chomsky e o ano de 1957; o título parece combinar a obra linguística Estruturas Sintáticas com outro tema.',
    caveat: 'A identificação da edição precisa de confirmação. Não atribua uma tese política a este registro antes da conferência bibliográfica.'
  };
  if (book.author === 'Nina Rodrigues') result = { ...result, spectrum: 'conservador',
    reason: 'A produção histórica da autoria se insere em teorias racialistas e hierarquizantes do período, hoje cientificamente rejeitadas.',
    caveat: 'Trata-se de racialismo histórico, não de categoria partidária atual. O interesse documental não valida seus pressupostos racistas.' };
  return { ...result, status: 'Enquadramento editorial provisório', basis: 'Tradição intelectual da autoria, gênero e contexto; não é uma avaliação do texto integral.', version: 'P1' };
}
