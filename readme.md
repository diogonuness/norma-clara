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

Não tem build, servidor nem dependência. Abra o `index.html` no navegador.

A entrada por voz usa a Web Speech API, que existe no Chrome e no Edge e precisa
de internet para transcrever. O campo de texto abre sozinho em dois casos: quando
o navegador não tem a API de voz, e quando a transcrição falha por falta de
conexão. Nos demais erros — microfone negado, nenhum microfone, nada falado — a
mensagem explica o que houve e o campo continua a um clique de distância, em
"Prefiro digitar". Para testar a voz localmente, sirva a página por `http://localhost`
(extensão Live Server do VS Code) ou por https — o navegador bloqueia o
microfone em `file://`.

## Estrutura

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Marcação da página: cabeçalho, conversa, microfone, campo de texto |
| `styles.css` | Estilos, com tokens de cor para tema claro e escuro |
| `app.js` | Motor de busca, interface do chat, voz e explicação |
| `normas.js` | Base de artigos, metadados dos documentos e explicações |
| `testes.js` | Perguntas-gabarito e checagem de integridade, rodadas com Node |

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
8. **Filtro de vigência.** Artigos de normas revogadas são descartados, salvo se a
   opção estiver marcada na interface.
9. **Abstenção.** Se o melhor trecho não cobrir termos temáticos suficientes da
   pergunta, o sistema responde que não sabe e indica a secretaria.

Cada resposta traz um painel "Como o sistema encontrou isso" com os dois
rankings, a pontuação RRF e a do reranking. É o pipeline visível na tela.

## A resposta

A ordem do cartão é fixa e proposital:

1. Nome da normativa e botão para abrir o PDF
2. Artigo e assunto, com selo de procedência do texto
3. **Texto do artigo**
4. Explicação em linguagem simples

A explicação vem sempre depois do texto e nunca o substitui. Se ela falhar, o
texto do artigo continua na tela.

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
