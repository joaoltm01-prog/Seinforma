// Curadoria e perguntas do Se Informe: roteiros de estudo, não resumos dos livros.
export const trails = [
  {
    id: 'mercado', number: '01', title: 'Quem organiza a economia?',
    theme: 'Mercado, Estado e liberdade',
    intro: 'Mude a pergunta de “mais ou menos Estado?” para “quem decide, com que limites e com quais consequências?”.',
    question: 'Em quais condições a intervenção pública amplia a liberdade, e em quais concentra poder?',
    steps: [
      { title: 'O Caminho da Servidão', lens: 'Comece pelo limite ao poder', prompt: 'Que riscos de concentração de decisões você identifica? Separe o argumento do autor dos exemplos que exigem verificação.' },
      { title: 'A Grande Transformação', lens: 'Troque a unidade de análise', prompt: 'Como investigar as relações entre mercados e proteção social? Compare as premissas desta leitura com as de Hayek.' },
      { title: 'Teoria Geral do Emprego, do Juro e da Moeda', lens: 'Acrescente emprego e demanda', prompt: 'Que mecanismos podem conectar decisões individuais e desemprego agregado? Quais hipóteses precisam de evidência?' },
      { title: 'Desenvolvimento como Liberdade', lens: 'Reavalie o critério de sucesso', prompt: 'O que muda quando a avaliação inclui capacidades e oportunidades, além de renda e escolha de mercado?' }
    ],
    synthesis: 'Monte uma tabela com decisão, benefício esperado, risco de concentração e indicador que permitiria testar cada proposta.'
  },
  {
    id: 'brasil', number: '02', title: 'Que Brasil cada autor enxerga?',
    theme: 'Formação social, raça e desigualdade',
    intro: 'Confronte interpretações do país sem transformar um clássico em retrato definitivo da sociedade brasileira.',
    question: 'Como cultura, escravidão, classe e organização econômica se combinam na formação das desigualdades brasileiras?',
    steps: [
      { title: 'Casa-Grande & Senzala', lens: 'Examine a interpretação cultural', prompt: 'Como relações familiares e escravidão aparecem na explicação do Brasil? Que experiências essa perspectiva pode deixar em segundo plano?' },
      { title: 'Formação do Brasil Contemporâneo', lens: 'Desloque o foco para a economia', prompt: 'Qual o alcance de uma explicação centrada na organização colonial da produção? Compare suas unidades de análise com as de Freyre.' },
      { title: 'A Integração do Negro na Sociedade de Classes', lens: 'Confronte integração e exclusão', prompt: 'Que evidências seriam necessárias para avaliar mobilidade, discriminação e permanências após a abolição?' },
      { title: 'O Genocídio do Negro Brasileiro', lens: 'Interrogue a narrativa nacional', prompt: 'Como avaliar criticamente a ideia de democracia racial? Registre onde a crítica converge ou entra em tensão com as leituras anteriores.' }
    ],
    synthesis: 'Escolha uma afirmação sobre desigualdade racial e descreva como a investigaria com dados do IBGE, recorte temporal e limitações explícitas.'
  },
  {
    id: 'desigualdade', number: '03', title: 'Desigualdade de quê?',
    theme: 'Propriedade, classe e justiça',
    intro: 'Diferencie uma explicação sobre como a desigualdade surge de um argumento sobre quais desigualdades seriam justificáveis.',
    question: 'Como comparar a defesa dos direitos de propriedade, a crítica de classe e os critérios de justiça distributiva?',
    steps: [
      { title: 'O Capital', lens: 'Investigue relações de produção', prompt: 'Quais conceitos conectam propriedade, trabalho e acumulação? O que precisaria ser medido para examinar essas relações hoje?' },
      { title: 'Uma Teoria da Justiça', lens: 'Mude da explicação para a justificação', prompt: 'Que critérios podem justificar instituições e distribuições? Separe a discussão normativa de uma previsão econômica.' },
      { title: 'Anarquia, Estado e Utopia', lens: 'Teste a objeção da titularidade', prompt: 'Como direitos de aquisição e transferência desafiam critérios distributivos? Qual o papel de injustiças anteriores?' },
      { title: 'O Capital no Século XXI', lens: 'Volte às séries históricas', prompt: 'Que dados seriam necessários para confrontar hipóteses de concentração de renda e patrimônio? Compare períodos e países.' }
    ],
    synthesis: 'Escreva uma conclusão com duas colunas: “o que os dados permitem afirmar” e “qual princípio de justiça estou adotando”.'
  },
  {
    id: 'democracia', number: '04', title: 'Quando o poder perde seus limites?',
    theme: 'Democracia, tradição e autoritarismo',
    intro: 'Aproxime prudência conservadora, instituições liberais e crítica do totalitarismo, preservando diferenças de contexto e método.',
    question: 'Como distinguir mudança institucional legítima de erosão das condições democráticas?',
    steps: [
      { title: 'Reflexões sobre a Revolução na França', lens: 'Comece pela prudência', prompt: 'Que objeções à ruptura política merecem exame? Quais podem também servir à preservação de desigualdades?' },
      { title: 'A Democracia na América', lens: 'Investigue costumes e instituições', prompt: 'Como associações, igualdade e participação podem entrar na avaliação de uma democracia? Quais limites históricos precisam ser considerados?' },
      { title: 'As Origens do Totalitarismo', lens: 'Diferencie as formas de dominação', prompt: 'Que cuidados impedem usar “totalitarismo” como insulto genérico? Identifique conceitos e contextos antes de comparar regimes.' },
      { title: 'Como as Democracias Morrem', lens: 'Construa critérios de observação', prompt: 'Quais sinais institucionais você buscaria para avaliar uma hipótese de erosão democrática? Como evitar selecionar só casos favoráveis?' }
    ],
    synthesis: 'Crie critérios aplicáveis a governos de campos diferentes e inclua um caso que colocaria sua hipótese inicial em dúvida.'
  },
  {
    id: 'territorio', number: '05', title: 'Desenvolvimento para quem?',
    theme: 'Território, ambiente e modos de vida',
    intro: 'Compare direitos de propriedade, organização produtiva e perspectivas indígenas sem reduzir bem-estar a uma única medida.',
    question: 'Como avaliar um projeto de desenvolvimento quando renda, território e modos de vida entram em conflito?',
    steps: [
      { title: 'O Mistério do Capital', lens: 'Examine a proposta da formalização', prompt: 'Que mecanismos poderiam conectar direitos de propriedade e acesso a oportunidades? Em quais contextos não funcionariam?' },
      { title: 'Formação Econômica do Brasil', lens: 'Acrescente a trajetória histórica', prompt: 'Como a organização produtiva herdada pode limitar oportunidades? Compare escalas e períodos com a leitura anterior.' },
      { title: 'Ideias para Adiar o Fim do Mundo', lens: 'Questione a medida do progresso', prompt: 'Quais custos ficam invisíveis em uma avaliação apenas monetária? Evite generalizar uma perspectiva para todos os povos indígenas.' },
      { title: 'A Queda do Céu', lens: 'Escute outra posição de conhecimento', prompt: 'Como trabalhar com um testemunho situado e sua mediação editorial? Diferencie perspectiva cosmológica e indicadores econômicos.' }
    ],
    synthesis: 'Desenhe uma avaliação que inclua renda, direitos territoriais, impactos ambientais e participação das comunidades atingidas.'
  }
  ,{
    id: 'anticomunismo', number: '06', title: 'O fio do anticomunismo',
    theme: 'Do integralismo ao bolsonarismo · trilha autoral',
    intro: 'Tese do curador: o anticomunismo liga as ondas da extrema direita brasileira. A trilha inclui a leitura contrária, e você decide quanto da tese se sustenta.',
    question: 'O anticomunismo explica a continuidade entre o integralismo, 1964 e o bolsonarismo, ou esconde diferenças maiores que as semelhanças?',
    steps: [
      { title: 'Em Guarda contra o Perigo Vermelho', lens: 'Comece pelo medo', prompt: 'Que papel o anticomunismo teve em cada momento estudado? Separe o que o autor documenta do que ele interpreta.' },
      { title: 'O Que É o Integralismo', lens: 'Ouça a fonte primária', prompt: 'Como o movimento define seus inimigos e a si mesmo? Marque onde o anticomunismo aparece como argumento e onde é só retórica.' },
      { title: '1964: A Conquista do Estado', lens: 'Veja 1964 pelas elites', prompt: 'Que atores civis e empresariais o autor aponta no golpe? O anticomunismo aparece como causa, pretexto ou ferramenta?' },
      { title: 'Anatomia do Fascismo', lens: 'Teste a tese contra um critério', prompt: 'Pelos critérios de Paxton, o que cabe e o que não cabe no integralismo, em 1964 e no bolsonarismo? Anote onde a tese do fio condutor enfraquece.' }
    ],
    synthesis: 'Monte uma tabela com três períodos, a presença do anticomunismo em cada um, a evidência e a objeção mais forte. Conclua dizendo o que você manteria da tese e o que abandonaria.'
  }
];
