# Biblioteca digital — piloto

O catálogo preserva as 555 referências do PDF e as fichas editoriais. A biblioteca digital acrescenta edições verificadas, sem presumir que um cadastro bibliográfico contém a obra. A descoberta e a importação são etapas de curadoria anteriores à consulta; a IA não navega nesses sites durante uma pergunta.

## Edições verificadas

| Obra no catálogo | Edição digital | Idioma | Trechos |
| --- | --- | --- | ---: |
| A Riqueza das Nações — Adam Smith | https://www.gutenberg.org/ebooks/3300 | Inglês original | 1.324 |
| Sobre a Liberdade — John Stuart Mill | https://www.gutenberg.org/ebooks/34901 | Inglês original | 171 |
| Segundo Tratado sobre o Governo — John Locke | https://www.gutenberg.org/ebooks/7370 | Inglês original | 190 |
| Leviatã — Thomas Hobbes | https://www.gutenberg.org/ebooks/3207 | Inglês original | 707 |
| A República — Platão | https://www.gutenberg.org/ebooks/1497 | Tradução inglesa de Benjamin Jowett | 328 |

Foram conferidos título original, autoria, idioma, tradutor quando aplicável, link de download e declaração de direitos no catálogo da origem. Para o Brasil, o registro identifica o falecimento do autor/tradutor e o encerramento do prazo de proteção patrimonial, com referência à Lei 9.610/98. A declaração de domínio público nos EUA, sozinha, não foi usada como autorização brasileira. As edições inglesas não autorizam importar traduções modernas em português.

O Manifesto Comunista está localizado no Marxists Internet Archive, mas sem texto importado: os direitos da tradução específica continuam pendentes. Wikisource, Portal Domínio Público, Brasiliana USP e Biblioteca Nacional Digital são diretórios prioritários para ampliar a pesquisa. Não há alegação de importação desses acervos. O acesso à Wikisource retornou HTTP 403 e não foi contornado.

## Armazenamento e implantação

`db/schema.ts` define edições e passagens no Netlify Database, com metadados, direitos, data da conferência e SHA-256 do download. As migrações de esquema, índice textual e dados estão em `netlify/database/migrations/`. O conteúdo do piloto foi incluído como dados de inicialização do banco, não como arquivo JSON ou estado em memória usado pela aplicação. A plataforma aplica as migrações durante o deploy. Nenhuma migração deve ser aplicada manualmente.

A API `GET /api/biblioteca` lê o estado persistido. A interface só mostra “Texto completo indexado” depois de receber esse estado; falhas de banco são informadas. A consulta preserva a resposta com fichas quando o índice está indisponível e identifica essa condição.

## Busca e referências

A recuperação usa o índice textual PostgreSQL em inglês, expansão explícita de vocabulário português–inglês e priorização das obras nomeadas. Até nove trechos são enviados à IA, com limite de três por obra na busca por relevância. Quando uma obra é explicitamente nomeada, mas não há correspondência lexical, os primeiros trechos das edições disponíveis podem dar contexto inicial. Isso não equivale a uma busca semântica completa.

`[S1]` referencia uma ficha editorial. `[S1:T1]` referencia um trecho específico da edição digital. A API rejeita marcadores para fontes ou trechos inexistentes e parágrafos sem referência. Somente os trechos citados são apresentados como suporte da resposta. A validação de marcadores não prova, sozinha, que uma interpretação esteja correta; o texto de suporte permanece visível para conferência.

Os localizadores de parágrafo pertencem ao índice desta transcrição, não a uma edição impressa. Não são fabricadas páginas. O campo `pdfPage` do catálogo é a página da lista bibliográfica e não entra como página da obra.

## Ampliação do piloto

1. Pesquisar nos seis diretórios por título em português, autoria e títulos alternativos/originais; confirmar a edição e o acesso ao texto completo.
2. Registrar tradução, edição, origem e fundamento dos direitos no Brasil. Manter direitos não confirmados como pendentes, sem extrair o conteúdo.
3. Adicionar uma receita revisada em `scripts/library-pilot.mjs`. Esse arquivo é configuração de importação, não o estado consultado pela aplicação. Licenças abertas são uma categoria distinta e exigem nota de licença e verificação específica antes de autorizar a importação.
4. Para o adaptador Gutenberg, gerar uma NOVA migração de dados com `node scripts/import-library.mjs netlify/database/migrations/AAAAMMDDHHMMSS_seed_books.sql`, substituindo o prefixo por um timestamp posterior às migrações existentes. O importador não sobrescreve arquivos, só usa links verificados, limita redirecionamentos ao mesmo domínio e encerra em erros/bloqueios. Revisar os metadados e o SQL resultantes antes de publicar. Nunca alterar uma migração já aplicada.
5. Para outros formatos ou bibliotecas, implementar um adaptador separado e revisar seus termos de acesso. O piloto usa textos UTF-8 nativos: não foi necessário OCR. PDFs digitalizados ainda precisam de um adaptador de extração/OCR com validação humana; não são silenciosamente tratados como texto acessível.

## Validação e limites

`npm test` verifica direitos, extração, integridade dos 2.720 trechos, vocabulário de perguntas em português, citações, indisponibilidade do banco, preservação do catálogo e interface. Há perguntas de validação sobre divisão do trabalho em Smith, dano em Mill, propriedade em Locke, soberania em Hobbes e a caverna em Platão, com passagens efetivamente presentes nos textos importados.

As chamadas ao modelo e ao repositório são simuladas nos testes da API e da interface. Não foi executada validação integrada com o banco já migrado e a IA real: essa etapa requer o deploy. Não houve aplicação manual de migrações, execução de build nem publicação por CLI nesta implementação.

Limitações: o piloto contém cinco corpos de obras em inglês; são excluídos sumários/preliminares antes do ponto de início configurado e introduções editoriais de terceiros. A edição e seu recorte estão identificados. O idioma de resposta é português, com tradução explicativa gerada pela IA. A busca lexical tem cobertura limitada de sinônimos e não substitui revisão acadêmica. Novas edições não são importadas automaticamente, e não há pesquisa de notícias ou dados atuais na web.
