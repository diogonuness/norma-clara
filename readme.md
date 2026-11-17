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
| `normativas/` | PDFs oficiais (`01-recorte-do-professor/`, `02-acrescimos/`), `indice.csv` e `pdf-data.js`, cópia em base64 usada só quando a página é aberta por `file://` |
| `vendor/` | PDF.js 3.11 (build que dispensa módulos ES e roda em `file://`) |
| `assets/fonts/` | Archivo, Source Serif 4 e JetBrains Mono, self-hosted |
| `testes.js` | Perguntas-gabarito e checagem de integridade, rodadas com Node |

Ao trocar um PDF de `normativas/`, gere de novo o `pdf-data.js`:

```
node -e "const fs=require('fs');const p='normativas/01-recorte-do-professor/Regulamento Disciplinar Discente (Res 197-2023).pdf';fs.writeFileSync('normativas/pdf-data.js','window.PDF_EMBUTIDO = { disciplinar: \"'+fs.readFileSync(p).toString('base64')+'\" };\n')"
```

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
destacado. A página não é fixada no código: o visor procura o texto do artigo no
PDF. Se não achar, abre na página 1 com um aviso. Documentos sem PDF local abrem
o link oficial do IFTO em outra aba.

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

- **texto oficial** — a redação da norma, transcrita do PDF. São 30 artigos, os
  do Disciplinar Discente e os dos Regimes de Trabalho Docente. No código, esses
  trazem `tipo:'literal'`.
- **resumo para o protótipo** — síntese fiel escrita para o protótipo. São os
  demais, sem o campo `tipo`.

Para converter uma síntese em texto oficial, substitua o campo `texto` pela
redação do PDF, acrescente `tipo:'literal'` e gere de novo a explicação
correspondente em `EXPLICACOES`.

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
