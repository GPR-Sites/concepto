# Concepto Saúde e Bem Estar

Site da Concepto Odontologia, Ribeirão Pires/SP. Reconstrução do site anterior
(`conceptoodontologia.com.br`) sobre o `template-1`, mantendo as cores e a fonte
da marca.

HTML, CSS e JavaScript puros, sem framework e sem build. Caminhos relativos: a
pasta funciona aberta do disco, servida em subpasta ou na raiz do domínio.

---

## O que veio do site antigo

Nada aqui é invenção. Tudo foi extraído do site que estava no ar.

**Cores**, lidas do estilo computado no navegador, não amostradas de screenshot:
`#028475` (institucional), `#00b7a2` (acento), `#005b51`, `#393939` e `#e9e9e9`.

**Fonte:** Montserrat, a mesma. Agora auto-hospedada, variável, subset latino,
um arquivo de 38 KB para os quatro pesos.

**Conteúdo:** os 9 tratamentos e os 9 procedimentos estéticos com o texto
original, os 6 check-ups preventivos, os 2 profissionais com CRO, os 6
depoimentos do Google, endereço, telefone, redes e o texto institucional.

**Fotos:** 31 imagens baixadas do próprio servidor da clínica.

---

## O que mudou, e por quê

| | Site anterior | Aqui |
| --- | --- | --- |
| `<title>` | `Concepto` | Com serviço e cidade |
| `meta description` | Não existia | Escrita por página |
| JSON-LD | Nenhum | `Dentist`, `WebSite`, `Person`, `MedicalProcedure` |
| `alt` das imagens | Todos vazios | Descritivo em cada uma |
| Arquivos 404 | 20, incluindo o logo, todos os ícones e o botão do WhatsApp | Nenhum |
| Raios de canto | 5, 9, 19, 20, 30 e 50px misturados | Uma escala, de 4 a 12px |
| Turquesa como texto | 2,53:1 no branco e 1,82:1 no verde | Só sobre faixa escura, 4,69:1 |
| Peso das imagens | `odontopediatria.webp` com 375 KB | 52 KB, mesma foto |
| Fonte | Google Fonts, conexão de terceiro | Auto-hospedada |
| Rolagem da navbar | Salto seco, com recarga | Animada, sem recarga |

O `#028475` continua sendo a cor de maior área do site: ele pinta o véu do hero,
o banner e as superfícies de destaque. O que mudou é que ele deixou de carregar
texto pequeno, onde não alcançava o contraste mínimo.

---

## Antes de publicar: o que ainda falta

Está tudo marcado com `TROCAR` no código. Para listar:

```
grep -rn "TROCAR" --include="*.html" --include="*.css" --include="*.js" .
```

**1. Horário de atendimento.** O site anterior não publicava nenhum. O que está
em `config.js` é um palpite de horário comercial e precisa ser confirmado.

**2. E-mail.** Também não existia no site anterior. Está como
`contato@conceptoodontologia.com.br`, que pode não ser real.

**3. O número do WhatsApp.** O site anterior exibia `(11) 94935-3333` mas o botão
apontava para `5511965882079`, outro número. Mantive o do botão, que é o que
recebia as conversas. Confirme qual é o certo.

**4. Formação dos profissionais.** Só temos nome, especialidade e CRO. O modal
que abre ao clicar no cartão de cada profissional pede graduação,
especialização e ano.

**5. Missão e valores.** O texto em `sobre.html` foi derivado do que o site
anterior dizia. Serve de ponto de partida, não é a palavra da clínica.

**6. Número de consultórios.** As fotos mostram pelo menos quatro ambientes
diferentes, mas o número não está publicado em lugar nenhum.

**7. Duas fotos que não existem mais no servidor.** `dr-carlos.webp` e
`atleta.webp` deram 404, junto com as fotos de `lipo-de-papada` e `invisalign`.
O retrato do Dr. Carlos já foi trocado por um da sessão nova (`assets/img/news`).
Por causa das fotos que faltam,
**Lipo de Papada** e **Alinhadores Invisalign** ficaram de fora das listas.

**8. Logo.** O arquivo do logo estava 404 no servidor. O cabeçalho usa a marca
tipográfica do template. Peça o vetor (`.svg`, `.ai` ou `.eps`).

**9. Domínio.** Confirme o endereço final em `config.js` → `site`.

---

## Trocar dados da clínica

Tudo mora em `assets/js/config.js`: nome, telefone, WhatsApp, e-mail, endereço,
coordenadas, horários, redes, mapa e analytics. Depois de editar:

```
node tools/sync.mjs
```

O script grava os valores dentro do HTML, para o buscador ler sem executar
JavaScript. É idempotente: pode rodar quantas vezes quiser.

O tema mora em `assets/css/tokens.css`. Os comentários de lá trazem o contraste
medido de cada par de cores; se mexer em alguma, refaça a conta.

---

## Estrutura

```
├── index.html                      Página única: hero, apresentação com
│                                   formulário, credibilidade, sobre, abas de
│                                   tratamento, check-ups, banner, estética,
│                                   equipe (com modal de formação),
│                                   depoimentos e contato
├── sobre.html                      História, estrutura e ambiente da clínica
├── politica-de-privacidade.html    LGPD, destino do aceite no formulário
├── 404.html
├── favicon.svg · site.webmanifest · robots.txt · sitemap.xml
├── assets/
│   ├── css/tokens.css              TEMA
│   ├── css/site.css                Estrutura e componentes
│   ├── js/config.js                DADOS DA CLÍNICA
│   ├── js/site.js                  Comportamento
│   ├── fonts/montserrat-var.woff2  38 KB, quatro pesos
│   └── img/                        Fotos da clínica, e img/trat/ por tratamento
└── tools/sync.mjs                  Grava o config no HTML
```

`DESIGN.md` traz o sistema visual. `PRODUCT.md` é o documento herdado do
template e fala do template, não desta clínica.

---

## Formulário

Três campos, iguais aos do site anterior: nome, procedimento e dúvida, mais o
aceite de LGPD. O modo é `whatsapp`: monta a mensagem e abre a conversa, sem
back-end. Para enviar a uma API, troque `formulario.modo` para `endpoint` e
preencha `formulario.endpoint`.

Não há campo de telefone: no modo `whatsapp` o número chega pela própria
conversa. Se trocar para `endpoint`, devolva o campo (está comentado no lugar
exato dentro de `site.js`).

---

## Conformidade, leia antes de publicar

O Código de Ética Odontológica restringe publicidade em odontologia:

- **Responsável técnico** com nome e CRO no rodapé é obrigatório e já está no
  lugar: Dr. Carlos Eduardo Cardoso, CRO/SP 66928.
- **Foto de antes e depois** é proibida. Não adicione.
- **Promessa de resultado** é infração. A copy evita isso de propósito.
- **Depoimento** de paciente exige autorização por escrito. Os seis que estão
  no site são avaliações públicas do Google, reproduzidas como já estavam no
  site anterior, e vêm rotuladas como tal. Ainda assim, reproduzir avaliação no
  site continua sendo depoimento de paciente para o Conselho. O caminho mais
  seguro é exibir a nota e o link do perfil no Google em vez de copiar o texto.
