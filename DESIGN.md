# Design

Sistema visual do site da Concepto. Tudo aqui é token: mexer em cor é
sobrescrever valor em `assets/css/tokens.css`, nunca reescrever componente.

A estrutura vem do `template-1`. O que é próprio desta clínica é a paleta, a
tipografia e o conteúdo.

## Theme

Verde-petróleo sobre claro, com um turquesa que só aparece onde existe ação.

Toda a paleta foi extraída do site anterior por estilo computado, lendo os
valores que o navegador aplicava, não amostrando pixel de screenshot. O que o
scanner devolveu: `#028475` ocupando a maior área, `#00b7a2` como acento,
`#005b51` em texto, `#e9e9e9` de superfície, `#393939` de corpo e Montserrat
carregando 100% do texto.

Estratégia de cor: **Committed**. O verde ocupa o véu do hero, o banner, as
placas da equipe, a faixa de depoimentos e o contato. O turquesa não passa de
cerca de 8% da superfície e existe só onde há uma ação.

## Color

O template usa a cor institucional em dois papéis ao mesmo tempo: faixa escura e
cor de texto sobre fundo claro. O `#028475` puro não serve nos dois: como texto
ele dá 4,22:1, abaixo do mínimo. Por isso ele virou `--navy-700`, onde continua
pintando a maior área do site, e o papel institucional coube a um verde mais
fundo da mesma família.

| Token | Valor | Uso |
|---|---|---|
| `--navy-900` | `#002b26` | Faixa de depoimentos e degradês |
| `--navy` | `#003f38` | Institucional: faixas, cards, títulos |
| `--navy-700` | `#028475` | O verde da marca: véu do hero e hover de superfície |
| `--navy-400` | `#7fada6` | Pílula inativa das abas |
| `--navy-050` | `#e0f1ee` | Fundos frios sutis |
| `--gold` | `#00b7a2` | Turquesa da marca. Só ação: botão e acento |
| `--gold-dark` | `#00a894` | Hover do botão |
| `--gold-deep` | `#01705f` | O mesmo acento quando vira texto em fundo claro |
| `--gold-soft` | `#dff4f0` | Fundo frio de destaque |

### Superfície e texto

| Token | Valor | Contraste |
|---|---|---|
| `--bg` | `#f1f6f5` | Off-white puxado para o hue da marca |
| `--surface` | `#ffffff` | |
| `--ink` | `#062b26` | 13,9:1 · títulos |
| `--body` | `#3b4f4c` | 8,0:1 · texto corrido |
| `--muted` | `#5b706d` | 4,8:1 · secundário e filete de campo |
| `--on-navy` | `#ffffff` | 11,1:1 sobre `--navy` |
| `--on-navy-muted` | `#cfe9e4` | 8,7:1 sobre `--navy` |
| `--on-gold` | `#00312b` | 5,63:1 sobre `--gold` |

Três correções de contraste em relação ao site anterior, todas medidas:

- O turquesa como **texto no branco** dava 2,53:1. Aqui ele só carrega texto
  sobre faixa escura, onde alcança 4,69:1. Em fundo claro entra o `--gold-deep`,
  que dá 5,5:1.
- O turquesa **sobre o verde** dava 1,82:1. Essa combinação não existe mais.
- O rótulo da pílula inativa é `--navy` sobre `--navy-400`: 4,77:1. Branco ali
  daria 2,6:1.

O anel de foco é `--navy` sobre superfície clara (10,9:1) e branco sobre
superfície escura (11,9:1).

## Typography

**Montserrat**, a mesma do site anterior. Agora auto-hospedada em
`assets/fonts/` como woff2 **variável**, subset latino, `font-display: swap`,
com `preload`. Um arquivo de 38 KB cobre os pesos 400 a 700, no lugar de quatro
arquivos estáticos e de uma conexão com o Google Fonts.

| Papel | Especificação |
|---|---|
| Display (h1) | `clamp(2rem, 1.45rem + 2.6vw, 3.25rem)` · wght 700 |
| H2 | `clamp(1.4375rem, 1.2rem + 1.1vw, 2rem)` · wght 700 |
| H3 | `1.1875rem` |
| Corpo | `1rem` / `1.65` · medida máxima `68ch` |

## Spacing & Layout

Mobile-first sem exceção: o estilo base é a versão de 360px e cresce por
`min-width`. Dois pontos de virada: `48rem` e `64rem`.

Contêiner `68rem`, largo `78rem`, gutter até `2,5rem`.

Escala de raio de **4 a 12px**, com uma exceção declarada: `--r-tab: 18px` na
pílula das abas. O site anterior misturava 5, 9, 19, 20, 30 e 50px sem regra:
card arredondado demais lê como widget, não como marca.

## Components

- **Header**: sobreposto ao hero, sólido depois de 24px de rolagem.
- **Hero**: foto sangrando de ponta a ponta com véu verde e a manchete por cima.
  O véu começa em `#003f38` do lado do texto, para garantir contraste com
  qualquer foto, e abre para o `#028475` da marca do lado da imagem.
- **Cartão de formulário**: branco, invadindo a seção seguinte. Três campos,
  iguais aos do site anterior.
- **Faixa de credibilidade**: quatro fotos da própria clínica. No desktop é
  grade de quatro colunas com véu que sobe de baixo para cima no hover,
  revelando título e texto. Abaixo de 64rem vira carrossel e o texto fica
  visível de partida, sobre um degradê no pé da foto: sem ponteiro não existe
  hover, e a seção mostrava quatro fotos e nenhuma informação.
- **Abas de tratamento**: pílulas roláveis com setas nas pontas e um filete
  descendo da ativa. Nove tratamentos, altura de painel travada para a caixa não
  pular de tamanho ao trocar de aba.
- **Check-ups e estética**: carrossel de cartões, um por vez no celular, dois a
  partir de 48rem e três a partir de 64rem. São seis em cada seção, e em grade
  isso empilhava duas fileiras altas.
- **Equipe**: foto com placa verde por baixo, nome, especialidade e CRO, em
  carrossel. Com dois profissionais o trilho não rola no desktop, as setas somem
  e o conteúdo centraliza; quando a clínica crescer, rola.
- **Modal de profissional**: o cartão inteiro é a área de clique, mas só um
  elemento recebe foco, um `<button>` dentro do `<h3>` com um `::after`
  esticado. Assim não há dois alvos de teclado nem interativo dentro de
  interativo. O modal traz bio, formação e o botão de agendar, e substituiu a
  seção de equipe que existia no `sobre.html`, onde a foto ocupava a tela toda.
  O `<dialog>` chega no HTML com `open`, como bloco comum: sem JavaScript a
  formação continua legível e indexável. O script fecha e passa a abrir em
  modal, o que mantém a regra da casa de esconder, nunca revelar. O estado
  aberto usa `:modal` para trocar de bloco para janela.
- **Marcas de lista**: círculo, não filete. O traço de 12px por 2px que o
  template usava lia como travessão na frente de cada item.
- **Select próprio**: o nativo guarda o valor e some da tela; por cima, uma
  listbox com teclado completo. Sem JavaScript, o nativo aparece normal.
- **Depoimentos**: carrossel em qualquer largura, um cartão por vez no celular,
  dois a partir de 48rem e três a partir de 64rem. Com seis avaliações, a grade
  empilhava três fileiras e obrigava a rolar a página toda para ver a última.
- **Carrossel**: um componente só para as duas seções. A rolagem é nativa com
  encaixe por CSS, então o dedo funciona sem JavaScript; as setas são um
  acréscimo para mouse e teclado, e somem sozinhas quando o trilho não rola,
  que é o caso da faixa no desktop. O encaixe é `proximity`, não `mandatory`:
  com `mandatory` o navegador reencaixava o trilho sozinho enquanto os cartões
  entravam animados, e a seção abria deslocada.
- **Botão flutuante de WhatsApp**: círculo branco com o glifo verde.

## Motion

`--ease: cubic-bezier(0.22, 1, 0.36, 1)`, durações 140/220/400ms. Só `opacity` e
`transform`.

Cascata no hero, revelação escalonada no scroll, véu subindo na faixa de
credibilidade e zoom discreto nas fotos.

O conteúdo é visível por padrão: o CSS só esconde o que vai entrar depois que o
JavaScript confirma `IntersectionObserver` e ausência de `prefers-reduced-motion`,
e uma rede de segurança de 2,5s revela tudo mesmo que o observer nunca dispare.

**Rolagem dos links de menu.** Os itens apontam para `index.html#secao`, porque
as páginas internas precisam voltar para a home. Na própria home isso faria o
navegador tratar o clique como troca de endereço: recarga e salto seco, sem o
`scroll-behavior: smooth` chegar a valer. A função `rolagemSuave()` em `site.js`
intercepta o clique quando o destino é o documento atual, rola com animação,
atualiza a barra de endereço sem recarregar e leva o foco junto. Com
`prefers-reduced-motion` o salto volta a ser instantâneo.
