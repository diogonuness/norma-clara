# Norma Clara

Assistente que responde dúvidas sobre as normativas do IFTO citando o artigo que
sustenta a resposta e o link do PDF oficial. Pergunta por voz ou por texto.

Feito para o **V Ideathon Maker da 17ª JICE** (Chamada Pública nº 17/2026 — IFTO).

---

## O problema

O IFTO publica mais de 1.800 documentos normativos. O estudante não sabe onde
está a regra de que precisa e, quando encontra, o texto jurídico é difícil. O
resultado é fila de dúvidas repetidas na secretaria e alunos que perdem direitos
por não conhecê-los — ou que levam punição sem saber que tinham três dias úteis
para recorrer.

## Como rodar

Não tem build nem dependência. Para usar a voz, sirva a pasta por
`http://localhost` — extensão Live Server do VS Code, ou `python -m http.server`
e abra `http://localhost:8000`. O navegador bloqueia o microfone quando o
`index.html` é aberto direto do disco (`file://`); nesse caso a pergunta pode ser
digitada e todo o resto funciona, inclusive o visualizador de PDF.

O fluxo: clique no microfone, a página escurece e o campo mostra "Pode falar...".
O que a pessoa fala aparece no campo em tempo real. Depois de uma pausa (ou de um
novo clique no microfone) a escuta termina, a pessoa confere o texto e clica em
**Perguntar**. Se nada foi dito, ou o microfone foi bloqueado, a página volta ao
início e a linha abaixo do campo diz o motivo.

A voz usa a Web Speech API, que existe no Chrome e no Edge e precisa de internet
para transcrever. Sem ela (Firefox, por exemplo), o botão do microfone fica
desabilitado com a dica "Seu navegador não suporta voz. Digite sua pergunta." e o
campo continua aceitando texto.

`Enter` envia, `Shift+Enter` quebra a linha, e "Reiniciar" volta ao estado inicial.
`index.html?demo=0` tira o selo "IFTO · Demonstração" do cabeçalho.

## Estrutura

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Marcação da página: cabeçalho, hero, conversa, composer, modal do PDF |
| `styles.css` | Estilos e design tokens (cores, tipografia, raios, sombras) |
| `app.js` | Motor de busca (até o comentário `interface`), depois a interface: máquina de estados do composer, voz e digitação da resposta |
| `visor-pdf.js` | Modal do PDF com PDF.js: acha a página do artigo pela busca no texto e destaca o trecho |
| `normas.js` | Base de artigos, metadados dos documentos e explicações |
| `normativas/` | Os 4 PDFs oficiais (`01-recorte-do-professor/`, `02-acrescimos/`), `indice.csv` e um `pdf-data-<chave>.js` por documento, cópia em base64 usada só quando a página é aberta por `file://` |
| `gerar-pdf-data.js` | Gera os `pdf-data-<chave>.js` a partir de `PDF_LOCAIS` (em `app.js`) |
| `vendor/` | PDF.js 3.11 (build que dispensa módulos ES e roda em `file://`) |
| `assets/fonts/` | Archivo, Source Serif 4 e JetBrains Mono, self-hosted |
| `testes.js` | Perguntas-gabarito e checagem de integridade, rodadas com Node |

### PDFs locais

`PDF_LOCAIS`, no topo da interface em `app.js`, liga cada chave de documento
(`odp`, `disciplinar`, `docente`, `polae`) ao seu PDF em `normativas/`. Ao trocar
ou acrescentar um PDF, atualize `PDF_LOCAIS` e gere de novo as cópias em base64:

```
node gerar-pdf-data.js
```

O script cria `normativas/pdf-data-<chave>.js` para cada documento. Esses
arquivos só são lidos quando a página é aberta direto do disco (`file://`), e o
visor carrega apenas o do documento aberto. Por `http://` ou no GitHub Pages, o
visor lê o PDF diretamente.

## Como a busca funciona

O pipeline reproduz, em JavaScript puro, a arquitetura proposta para o MVP final.

1. **Normalização.** A pergunta vai para minúsculas, sem acentos, e é dividida em
   termos. Palavras sem carga temática são descartadas.
2. **Radicalização.** Um radicalizador leve do português reduz as palavras ao
   radical, para que "trancar", "trancamento" e "trancada" casem entre si.
3. **Expansão por significado.** Um dicionário de sinônimos acrescenta termos
   relacionados: "bolsa" puxa "auxílio", "prova" puxa "avaliação".
4. **Dois braços de busca em paralelo.**
   - *Palavra exata*: BM25 sobre o texto do artigo.
   - *Significado*: BM25 sobre as tags de contexto, com o assunto pesando o dobro.
5. **Referência explícita.** Se a pergunta cita "Art. 75" ou "Resolução 197/2023",
   esse braço localiza o artigo diretamente e pula o reranking.
6. **Fusão RRF.** Os rankings são combinados por Reciprocal Rank Fusion com k=60.
7. **Reranking.** Os 8 melhores são reordenados por cobertura: quantos termos
   distintos da pergunta o trecho cobre, pesados por idf. Fusão e cobertura pesam
   igual — acima disso, um trecho que aparece nas duas listas vence outro que
   aparece só numa, mesmo quando essa única lista o coloca muito à frente.
8. **Filtro de vigência.** Artigos de normas revogadas são descartados
   (`buscar(pergunta, false)`).
9. **Abstenção.** Se o melhor trecho não cobrir termos temáticos suficientes da
   pergunta, o sistema responde que não sabe e indica a secretaria.

A abstenção vem com saída. Abaixo da frase, "Posso ajudar com estes assuntos:"
mostra um chip por tema que a base cobre: o campo `tema` de cada artigo, com a
pergunta-exemplo de `TEMAS` em `normas.js`. O clique envia essa pergunta. Quando
a busca ficou perto de responder, aparece também "Talvez você queira saber
sobre:" com o assunto do artigo mais próximo, que abre o card dele. "Perto" é
estrito: o mesmo artigo ficou em 1º lugar nos dois braços da busca e faltou um
só termo de cobertura. Com um critério frouxo, "horário da biblioteca"
sugeriria "Onde acontece a recuperação". `node testes.js` confere que todo
artigo tem tema e que cada pergunta-exemplo traz um artigo do próprio tema.

`buscar()` continua devolvendo os dois rankings, a pontuação RRF e a do
reranking, para quem quiser inspecionar o pipeline no console.

## A resposta

A ordem do cartão é fixa e proposital:

1. Nome da normativa e botão "Ver PDF"
2. Artigo e assunto, com o selo "texto oficial" quando a redação é literal
3. **O que diz o artigo**, digitando primeiro
4. **Em linguagem simples**, digitando depois, em ritmo de leitura
5. Referência da resolução e "Baixar PDF"

A explicação vem sempre depois do texto e nunca o substitui. Se ela falhar, o
texto do artigo continua na tela. As alturas dos dois blocos são reservadas antes
da digitação começar, então o cartão não pula.

**Artigo recolhido.** Com o texto literal, muitos artigos ficaram longos (o
maior passa de 1.700 caracteres), e a explicação ia parar fora da tela. Por
isso "O que diz o artigo" mostra no máximo 6 linhas, com um degradê na base, e
o botão "Ler artigo completo" expande o resto ("Mostrar menos" recolhe). A
decisão de recolher vem da altura real do texto, medida depois que as fontes
carregam, e não da contagem de caracteres: artigos que cabem em 6 linhas não
ganham botão nem degradê. Ao mudar a largura da janela, os cards são medidos de
novo. A expansão usa `interpolate-size: allow-keywords`; sem ele, usa
`grid-template-rows: minmax(6 linhas, 0fr) → 1fr`. Com `prefers-reduced-motion`,
ela é instantânea. Só a parte visível do artigo é digitada (em até 1 s); o resto
entra pronto, escondido. "Ver PDF" continua destacando o artigo inteiro, e o
leitor de tela recebe o texto completo.

A digitação segue uma linha do tempo, com pausa extra depois de `.` e `,`. O
ritmo é de no máximo 18 ms por caractere no artigo e 55 ms na linguagem simples,
e os tetos são de 1,4 s e 3,8 s: texto curto mantém o ritmo e texto longo é
comprimido para caber. Do envio ao fim, uma resposta leva menos de 6 s, mesmo
com o Art. 75 da ODP (1.729 caracteres). Um clique ou toque no card, o botão
"Toque para ver tudo" ou a tecla `Esc` completam os textos na hora. Com
`prefers-reduced-motion`, não há digitação: o texto aparece inteiro, com fade.

"Ver PDF" abre o PDF oficial num modal, já na página do artigo e com o trecho
destacado, nos quatro documentos. A página não é fixada no código: o visor
procura o texto no PDF.

- **Texto literal:** cada linha do artigo é procurada a partir do título
  "Art. N", em ordem, e o trecho inteiro fica em azul. Se uma linha atravessa uma
  quebra de página, a busca cai para frase a frase.
- **Resumo, ou literal não encontrado:** o visor destaca o parágrafo que começa
  em "Art. N".
- **Nada encontrado:** abre na página 1 com o aviso "Não conseguimos marcar o
  trecho".

Os dois lados são normalizados antes de comparar: sem acentos, sem caixa, sem
espaços, quebras ou hífens, e sem as sequências "ti", "fi" e "fl". Os PDFs do
IFTO perdem essas ligaduras na extração ("estudan l" no lugar de "estudantil"),
e sem isso o destaque falharia na POLAE e no Disciplinar.

Documentos sem PDF local abrem o link oficial do IFTO em outra aba.

**Rolagem.** Um `ResizeObserver` mede o cabeçalho e a faixa do composer e guarda
as alturas em `--altura-topo` e `--altura-faixa`. O `html` usa a segunda em
`scroll-padding-bottom`, e balões, cards e avisos usam a primeira em
`scroll-margin-top`, de modo que a rolagem automática nunca para atrás de nenhum
dos dois. Quando entra um card, a tela rola até o topo do balão da pergunta
ficar logo abaixo do cabeçalho, e a leitura segue pergunta → documento → artigo
→ explicação. Abstenção e mensagens curtas rolam até o fim (`block: 'end'`).
Durante a digitação, a tela só acompanha o texto se a pessoa estiver a até 80 px
do fim da página; se ela subiu para ler alguma coisa, a tela não é puxada de
volta. A faixa é `sticky` e fica no fluxo da página, então na rolagem máxima o
último item nunca fica embaixo dela, e não há `padding-bottom` extra na
conversa.

Abaixo do rodapé do card, "Outros artigos relacionados (N)" fica recolhido e
lista até 3 artigos no formato `Art. N · Assunto · Documento`. A regra fica em
`relacionados()`, na parte do motor de `app.js`:

1. resultados da mesma busca, vigentes, sem o próprio artigo da resposta;
2. do **mesmo tema** da resposta e com pontuação de pelo menos **30%** da do
   primeiro (reranking quando houve, senão RRF), no máximo 3;
3. se nenhum passar no corte, até 2 seguintes do mesmo tema que cubram algum
   termo da pergunta.

O tema é o que evita artigo sem relação. As pontuações ficam todas perto do
topo, e só o corte de 30% deixava passar "O que dá advertência por escrito" para
"Faltei na prova" (o artigo fala em "nota de prova"). `node testes.js` mede em
quantas perguntas-gabarito o bloco aparece; a meta é pelo menos metade, e hoje
ele aparece em 43 das 50 respostas. Quando nada do mesmo tema chega perto (por
exemplo "Perdi a prova", que não traz nenhum outro artigo de faltas entre os
resultados), o bloco não aparece. Clicar numa linha abre o card completo do
artigo logo abaixo, sem uma nova pergunta.

O formato que o cartão consome (montado por `respostaDoMotor()` em `app.js`):

```json
{
  "documento": "Regulamento Disciplinar Discente do IFTO",
  "documentoCurto": "Regulamento Disciplinar Discente",
  "artigo": "Art. 22",
  "tema": "Prazo para recorrer da punição",
  "textoOficial": "...",
  "linguagemSimples": "...",
  "referencia": "Resolução nº 197/2023/CONSUP/IFTO, ...",
  "pdfLocal": "normativas/01-recorte-do-professor/...pdf",
  "pdfOficial": "https://www.ifto.edu.br/...pdf",
  "trechoParaDestacar": "Art. 22. O estudante terá direito a recurso ..."
}
```

Por padrão as explicações são pré-geradas e ficam em `EXPLICACOES`, em
`normas.js`. Definindo `CONFIG_IA.endpoint` em `app.js`, o sistema passa a
chamar um modelo por POST, enviando `{ pergunta, documento, artigo, texto }` e
esperando `{ explicacao }`. Nenhuma chave de API vive no front-end.

## A base de normas

Quatro documentos vigentes, 66 artigos indexados:

| Documento | Norma |
| --- | --- |
| Organização Didático-Pedagógica dos Cursos Técnicos Presenciais | Res. 38/2013, convalidada pela 23/2015 |
| Regulamento Disciplinar Discente | Res. 197/2023 |
| Regimes de Trabalho e Atividades Docentes | Res. 58/2019 |
| Política de Assistência Estudantil (POLAE) | Res. 24/2020 |

Há ainda um registro da 1ª edição da ODP, marcado como revogado. Ele existe para
demonstrar o filtro de vigência.

Os três primeiros são o recorte definido pelo orientador. Os demais foram
acrescentados por responderem dúvida frequente de estudante.

### Texto oficial e síntese

Cada artigo mostra na interface de onde vem o seu texto:

- **texto oficial** — a redação da norma, transcrita do PDF palavra por palavra.
  Aparece em serifa, com barra de citação e o selo "Texto oficial". No código,
  esses trazem `tipo:'literal'`. **Hoje são os 66 artigos vigentes.**
- **resumo** — síntese escrita para o protótipo. Aparece em sans, sem barra, sob
  "Resumo do artigo" e com o selo âmbar "Resumo · confira no PDF". No código,
  ficam sem o campo `tipo`. Hoje só o registro da 1ª edição da ODP (revogada,
  "Documento inteiro") continua assim.

Nos literais, a transcrição corrige só artefatos da extração do PDF: quebras de
linha, hifenização, ligaduras perdidas ("estudan l" → "estudantil"), cabeçalhos,
rodapés do SEI e chamadas de nota de rodapé. Erros da própria norma ficam como
estão (dois "Parágrafo único" no Art. 75 da ODP, "Art 99." sem ponto na POLAE).
Cada dispositivo fica numa linha. Quando o rótulo cita só um inciso ou
parágrafo, o caput entra junto e o trecho pulado vira uma linha `[…]`.

Para converter uma síntese em texto oficial, substitua o campo `texto` pela
redação do PDF, acrescente `tipo:'literal'`, confira a explicação
correspondente em `EXPLICACOES` e rode `node testes.js`: o texto literal muda o
índice da busca, e às vezes é preciso acertar as `tags`.

### Como adicionar um artigo

```js
{
  id: 'disc-22',                    // identificador único
  doc: 'disciplinar',               // chave em DOCUMENTOS
  artigo: 'Art. 22',                // como aparece na citação
  assunto: 'Prazo para recorrer da punição',
  tipo: 'literal',                  // omita se o texto for síntese
  texto: '...',
  tags: 'recurso recorrer levei uma advertencia e agora ...'
}
```

O campo `tags` é o enriquecimento de contexto do trecho: termos e formas de
perguntar que levam àquele artigo. É o que o braço de significado consulta, e a
versão manual da ideia de *contextual retrieval*. Ao escrever tags, pense em como
um aluno perguntaria, não em como a norma está redigida.

Um cuidado: o radicalizador junta palavras de mesma raiz, e às vezes junta
demais. "levei" e "leve" caem no mesmo radical — por isso "infração leve" saiu
das tags, para não casar com "levei uma advertência". Ao acrescentar tags, rode
`node testes.js`.

### Como adicionar um documento

1. Acrescente a entrada em `DOCUMENTOS`, com `nome`, `sigla`, `resolucao`,
   `data`, `situacao` e `link`.
2. Acrescente os artigos em `NORMAS` apontando `doc` para a nova chave.
3. Escreva a explicação de cada artigo novo em `EXPLICACOES`.

Os índices são reconstruídos sozinhos ao carregar a página. No `link`, use a URL
do PDF sem `/view` no final — assim o portal entrega o arquivo em vez da página
do documento.

## O que isto ainda não é

Três coisas separam o protótipo do MVP, e vale dizer isso antes que perguntem:

- **Não há LLM em tempo real.** `CONFIG_IA.endpoint` vem como `null`, então as
  explicações exibidas são as pré-geradas de `EXPLICACOES`. A função `explicar()`
  já faz a chamada quando há endpoint, mas esse caminho nunca foi exercitado
  contra um modelo real e não é coberto por `testes.js`, que testa só a busca.
- **A busca por significado não usa embeddings.** Ela usa dicionário de termos e
  radicalização. Na versão final, vira busca vetorial com um modelo multilíngue.
- **A base vive em um arquivo JavaScript.** Na versão final, fica em pgvector com
  os metadados ao lado.

A estrutura do pipeline, porém, é a mesma. Trocar cada peça não muda o desenho.

## Publicar

O site é estático e todos os caminhos são relativos, então funciona servido de
uma subpasta como `https://<usuario>.github.io/norma-clara/`. No GitHub Pages o
microfone funciona: o site é servido por HTTPS, que é o que o navegador exige
para liberar a voz (em `file://` ele bloqueia).

O workflow `.github/workflows/pages.yml` publica a raiz do repositório a cada
push na `main`. Antes, roda `node testes.js`; se alguma pergunta-gabarito ou
checagem de integridade falhar, nada é publicado.

Para publicar pela primeira vez (troque `<usuario>` pelo seu usuário do GitHub):

```
gh repo create norma-clara --public --source . --remote origin
git push -u origin main
gh api -X POST repos/<usuario>/norma-clara/pages -f build_type=workflow
```

Sem o `gh`, crie o repositório vazio `norma-clara` em github.com e rode
`git remote add origin https://github.com/<usuario>/norma-clara.git` e
`git push -u origin main`. Depois, em Settings › Pages › Build and deployment,
escolha **GitHub Actions** como fonte. A primeira publicação começa sozinha
(ou em Actions › "Publicar no GitHub Pages" › Run workflow) e o endereço aparece
no resumo da execução.

## Copiar e avaliar

No rodapé de cada card, ao lado de "Baixar PDF":

- **Copiar** põe na área de transferência um texto pronto para o WhatsApp:
  pergunta, resposta em linguagem simples, documento, artigo, referência, link
  oficial do PDF e "(via Norma Clara)". Por `file://`, onde a API de área de
  transferência pode faltar, a cópia usa `document.execCommand('copy')`.
- **"Isso respondeu?" 👍 / 👎** grava `{ pergunta, artigoId, util, data }` em
  `localStorage`, na chave `normaClara.feedback`. Fica só no navegador de quem
  respondeu; se o `localStorage` estiver bloqueado, o "Obrigado!" aparece mesmo
  assim e nada quebra.

No desktop as ações têm rótulo; no celular, só ícone, com o rótulo no
`aria-label`.

### Transformar 👎 em casos de teste

Abra a página com `?admin=1` (por exemplo `index.html?admin=1`). Aparece
"Exportar perguntas" no rodapé, que baixa um `.json` com as respostas marcadas
com 👎. Para cada uma:

1. Descubra qual artigo deveria ter vindo (ou se o certo era a abstenção).
2. Acrescente `['a pergunta', 'id-esperado']` ao array `CASOS` de `testes.js`.
3. Ajuste as `tags` ou os sinônimos até `node testes.js` passar de novo.

É assim que as perguntas reais de estudantes viram regressão: uma pergunta que
falhou uma vez não volta a falhar sem alguém perceber.

## Testes

```
npm install                       # só na primeira vez (Playwright, só para testes)
npx playwright install chromium   # idem
npm test                          # node testes.js && node testes-ui.mjs
```

O site continua sem build: o `package.json` existe só para os testes. Há dois
conjuntos:

- **`node testes.js`**: perguntas-gabarito e integridade da base. Roda sem
  instalar nada, e é o que o GitHub Pages executa antes de publicar.
- **`node testes-ui.mjs`**: abre o site num Chromium real, servido por um
  servidor estático mínimo em Node, em 1280×720 e em 390×844. Confere os chips
  do estado inicial, o card do Art. 75 da ODP para "Perdi a prova, e agora?", o
  clique que completa a digitação, o destaque no visor de PDF, a abstenção com
  chips de temas e o console sem erros.

O arquivo `testes.js` traz o conjunto de perguntas-gabarito: 54 perguntas
escritas como um aluno ou um professor perguntaria, cada uma com o id do artigo
que deve vir em primeiro lugar. Quatro delas são os chips de sugestão do estado
inicial, e outras quatro são sobre assuntos fora do acervo e devem levar à
abstenção.

A comparação é pelo id, não pelo número do artigo, porque o número se repete
entre documentos — "Art. 74" existe na ODP e na POLAE. Comparando por número, o
teste passaria mesmo trazendo o artigo certo do documento errado.

Hoje o resultado é 54 de 54. Ele também confere a integridade da base: ids
duplicados, artigo sem explicação, explicação órfã, campo vazio, link que não
entrega o PDF direto, artigo sem tema e pergunta-exemplo de tema que não traz
artigo do próprio tema.

Rode antes de cada commit que mexa em `normas.js`. Documento novo pode roubar o
resultado de pergunta que já funcionava, e tag nova pode colidir com palavra de
outro artigo — foi o que aconteceu com "levei" e "leve".

Para acrescentar um caso, edite o array `CASOS` em `testes.js`. As perguntas que
surgirem no teste com usuários reais devem entrar ali.

## Fontes

- [Organização Didático-Pedagógica dos Cursos Técnicos Presenciais](https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/cursos-tecnicos/regulamento-odp-cursos-medio-tecnico-presenciais-ifto-2edicao.pdf)
- [Regulamento Disciplinar Discente (Res. 197/2023)](https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/assistencia-estudantil/resolucao-197-2023-consup-regulamento-disciplinar-discente-ifto.pdf)
- [Regimes de Trabalho e Atividades Docentes (Res. 58/2019)](https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/cppd/regulamento-regime-de-trabalho-dos-docentes.pdf)
- [Política de Assistência Estudantil (Res. 24/2020)](https://portal.ifto.edu.br/ifto/reitoria/pro-reitorias/proae/assistencia-estudantil/programa-de-assistencia-estudantil/politica-de-assistencia-estudantil.pdf)
- [Chamada Pública nº 17/2026 — V Ideathon Maker](https://www.ifto.edu.br/ifto/reitoria/pro-reitorias/propi/editais/chamada-publica-no-17-2026-participacao-no-v-ideathon-maker-da-17a-jice)
