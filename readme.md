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

## Testes

```
node testes.js
```

O arquivo `testes.js` traz o conjunto de perguntas-gabarito: 50 perguntas
escritas como um aluno ou um professor perguntaria, cada uma com o id do artigo
que deve vir em primeiro lugar. Quatro delas são sobre assuntos fora do acervo e
devem levar à abstenção.

A comparação é pelo id, não pelo número do artigo, porque o número se repete
entre documentos — "Art. 74" existe na ODP e na POLAE. Comparando por número, o
teste passaria mesmo trazendo o artigo certo do documento errado.

Hoje o resultado é 50 de 50. Ele também confere a integridade da base: ids
duplicados, artigo sem explicação, explicação órfã, campo vazio e link que não
entrega o PDF direto.

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
