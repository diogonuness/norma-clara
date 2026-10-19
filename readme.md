# Normativas do IFTO

Protótipo de assistente que responde dúvidas sobre as normativas do IFTO citando o
artigo que sustenta a resposta e o link do PDF oficial.

Feito para o **V Ideathon Maker da 17ª JICE** (Chamada Pública nº 17/2026 — IFTO).
O nome é provisório.

---

## O problema

O IFTO tem dezenas de normativas — Organização Didática, POLAE, regulamentos de
estágio e TCC, resoluções do Consup. O estudante não sabe onde está a regra de que
precisa e, quando encontra, o texto jurídico é difícil de entender. O resultado é
fila de dúvidas repetidas na secretaria e alunos que perdem direitos por não
conhecê-los.

## Como rodar

Não tem build, servidor nem dependência. Abra o `index.html` no navegador.

Para recarregar automaticamente a cada edição, use a extensão **Live Server** do
VS Code e clique em "Go Live".

### Pergunta por voz

A pergunta é feita por voz. O estudante toca no microfone, fala, confere a
transcrição na tela e só então toca em **Perguntar** (ou grava de novo, ou
descarta). As sugestões da tela inicial continuam funcionando sem microfone.

- A transcrição usa a Web Speech API do navegador, em pt-BR. Funciona no Chrome,
  no Edge e no Safari; o Firefox não tem suporte, e a página avisa isso.
- No Chrome e no Edge a transcrição é feita nos servidores do navegador, então
  precisa de internet.
- O navegador só libera o microfone em `https` ou `localhost`. Use o Live Server
  em vez de abrir o arquivo direto, para não ser perguntado a cada gravação.
- Permissão negada, microfone ausente, silêncio e falha de rede mostram cada um
  uma mensagem própria abaixo do campo.

## Como a resposta é montada

Cada resposta segue sempre esta ordem:

1. Nome da normativa e o botão **Abrir PDF**.
2. O artigo citado e o assunto.
3. **Texto do artigo**, sem alterações.
4. **Em linguagem simples**: a explicação gerada por IA a partir desse texto.
   Ela vem sempre depois do texto e nunca o substitui.

O botão **Baixar normativas**, no topo, lista os PDFs oficiais de todos os
documentos, e cada cartão tem um link **Baixar PDF** no rodapé.

A explicação vem de `explicar()` em `app.js`. Com `CONFIG_IA.endpoint` vazio,
usa as explicações pré-geradas em `EXPLICACOES` (`normas.js`). Para gerar em
tempo real, aponte o endpoint para um serviço que receba
`POST { pergunta, documento, artigo, texto }` e devolva `{ explicacao }`. Se o
serviço falhar, o cartão avisa e o texto do artigo continua na tela.

## Estrutura

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Marcação da página: cabeçalho, conversa, entrada por voz |
| `styles.css` | Estilos, com tokens de cor para tema claro e escuro |
| `app.js` | Motor de busca, lógica do chat, voz e explicação |
| `normas.js` | Base de artigos, metadados dos documentos e explicações |

## Como a busca funciona

O pipeline reproduz, em JavaScript puro, a arquitetura proposta para o MVP final.

1. **Normalização.** A pergunta é passada para minúsculas, sem acentos, e dividida
   em termos. Palavras sem carga temática são descartadas.
2. **Radicalização.** Um radicalizador leve do português reduz as palavras ao
   radical, para que "trancar", "trancamento" e "trancada" casem entre si.
3. **Expansão por significado.** Um dicionário de sinônimos acrescenta termos
   relacionados: "bolsa" puxa "auxílio", "prova" puxa "avaliação".
4. **Dois braços de busca em paralelo.**
   - *Palavra exata*: BM25 sobre o texto do artigo.
   - *Significado*: BM25 sobre as tags de contexto de cada trecho, com o assunto
     pesando o dobro.
5. **Referência explícita.** Se a pergunta cita "Art. 75" ou "Resolução 38/2013",
   esse braço localiza o artigo diretamente e pula o reranking.
6. **Fusão RRF.** Os rankings são combinados por Reciprocal Rank Fusion com k=60.
7. **Reranking.** Os 8 melhores candidatos são reordenados por cobertura: quantos
   termos distintos da pergunta o trecho cobre, pesados por idf. Isso corrige o
   caso em que um trecho curto repete uma palavra comum e sobe demais no BM25.
8. **Filtro de vigência.** Artigos de normas revogadas são descartados, salvo se a
   opção estiver marcada na interface.
9. **Abstenção.** Se o melhor trecho não cobrir ao menos metade dos termos
   temáticos da pergunta, o sistema responde que não sabe e indica a secretaria,
   em vez de inventar.

Cada resposta traz um painel "Como o sistema encontrou isso" com os dois rankings,
a pontuação RRF e a do reranking. É o pipeline visível na tela.

## A base de normas

Dois documentos vigentes, 36 artigos:

- **Regulamento da Organização Didático-Pedagógica dos Cursos Técnicos Presenciais**
  — Resolução nº 38/2013/CONSUP/IFTO, convalidada pela Resolução nº 23/2015
- **Política de Assistência Estudantil (POLAE)**
  — Resolução nº 24/2020/CONSUP/IFTO

Há ainda um terceiro registro, a 1ª edição do regulamento, marcado como revogado.
Ele existe para demonstrar o filtro de vigência.

> **Atenção.** Os textos em `normas.js` são **sínteses** de cada artigo, escritas
> para o protótipo. Não são o texto literal da norma. Todo cartão de resposta
> linka o PDF oficial.

### Como trocar por texto literal

Cada entrada de `normas.js` tem esta forma:

```js
{
  id: 'odp-75',                  // identificador único
  doc: 'odp',                    // chave em DOCUMENTOS
  artigo: 'Art. 75',             // como aparece na citação
  assunto: 'Segunda chamada de avaliação',
  texto: '...',                  // <- substitua aqui pelo texto oficial
  tags: 'segunda chamada perdi prova faltei ...'
}
```

Para usar o texto oficial, substitua o campo `texto` e gere de novo a explicação
do mesmo `id` em `EXPLICACOES`, para que ela continue fiel ao texto.

O campo `tags` é o enriquecimento de contexto do trecho: termos e formas de
perguntar que levam àquele artigo. É o que o braço de significado consulta, e a
versão manual da ideia de *contextual retrieval*. Ao adicionar um artigo novo,
escreva as tags pensando em como um aluno perguntaria.

### Como adicionar um documento

1. Acrescente a entrada em `DOCUMENTOS`, com `nome`, `sigla`, `resolucao`, `data`,
   `situacao` e `link`.
2. Acrescente os artigos em `NORMAS` apontando `doc` para a nova chave.

Os índices são reconstruídos sozinhos ao carregar a página.

## O que isto ainda não é

Três coisas separam o protótipo do MVP de novembro, e vale dizer isso antes que
perguntem:

- **Não tem LLM em tempo real.** As explicações em linguagem simples foram
  pré-geradas e ficam em `normas.js`. Na versão final, `CONFIG_IA.endpoint`
  aponta para um modelo que gera a explicação a partir do trecho recuperado.
- **Não tem embeddings.** O braço de significado usa dicionário e radicalização.
  Na versão final, ele vira busca vetorial com um modelo multilíngue.
- **Não tem banco de dados.** Os artigos vivem em um arquivo JavaScript. Na versão
  final, ficam em pgvector com os metadados ao lado.

A estrutura do pipeline, porém, é a mesma. Trocar cada peça não muda o desenho.

## Qualidade atual

Testado com 32 perguntas escritas como um aluno perguntaria. O artigo correto
aparece em primeiro lugar em 30 delas, e as perguntas fora do acervo levam à
abstenção.

Esse conjunto é o começo das perguntas-gabarito que a avaliação final vai exigir.
Vale ampliá-lo com as dúvidas reais que a secretaria do campus mais responde.

## Fontes

- [Regulamento da ODP dos Cursos Técnicos Presenciais](https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/cursos-tecnicos/regulamento-odp-cursos-medio-tecnico-presenciais-ifto-2edicao.pdf/view)
- [Política de Assistência Estudantil (POLAE)](https://portal.ifto.edu.br/ifto/reitoria/pro-reitorias/proae/assistencia-estudantil/programa-de-assistencia-estudantil/politica-de-assistencia-estudantil.pdf)
- [Chamada Pública nº 17/2026 — V Ideathon Maker](https://www.ifto.edu.br/ifto/reitoria/pro-reitorias/propi/editais/chamada-publica-no-17-2026-participacao-no-v-ideathon-maker-da-17a-jice)