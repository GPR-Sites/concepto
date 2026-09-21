# Product

## Register

brand

## Platform

web

## Users

Pacientes brasileiros procurando um dentista, chegando quase sempre por busca no Google ou por indicação, na maioria das vezes pelo celular e com pressa. O perfil é misto por decisão explícita: quem busca estética (facetas, harmonização, clareamento) decide por desejo e resultado visual; quem busca reabilitação (implantes, prótese, ortodontia) decide por confiança e medo; quem busca clínica geral e odontopediatria decide por praticidade, horário, endereço, atendimento. A base atende os três sem privilegiar um, porque cada clínica-cliente terá um mix diferente.

Existe um segundo usuário, invisível no site e decisivo no projeto: o desenvolvedor que instancia essa base para uma nova clínica. O trabalho dele é trocar um arquivo de configuração e as imagens, não caçar texto espalhado em dez páginas.

## Product Purpose

Uma base reutilizável, em HTML, CSS e JavaScript sem framework, para sites institucionais de clínicas odontológicas. Cada instância precisa carregar rápido no 4G, ranquear bem em busca local e levar o visitante ao WhatsApp ou ao formulário no menor número de toques possível. Sucesso é medido em duas frentes: contato iniciado pelo paciente e tempo de setup de um novo cliente.

## Positioning

O site de clínica odontológica que não parece um template de clínica odontológica, e que já sai indexável, acessível e rápido no dia da entrega.

## Conversion & proof

- CTA primário: WhatsApp e formulário de agendamento com peso igual em cada seção de conversão. O WhatsApp abre com mensagem pré-preenchida contextual ao tratamento da página; o formulário monta a mesma mensagem e entrega no mesmo canal.
- CTA secundário: telefone com tap-to-call e a rota no Google Maps, para quem já decidiu ir.
- A linha que o visitante lembra depois de dez segundos: essa clínica sabe o que está fazendo e é fácil falar com ela.
- Belief ladder: (1) esse site é de uma clínica real, perto de mim, aberta agora; (2) eles fazem exatamente o tratamento que eu preciso; (3) tem gente formada e registrada por trás, com nome e rosto; (4) outros pacientes passaram por isso e ficaram bem; (5) falar com eles não é um compromisso, é uma mensagem.
- Proof on hand: nenhuma prova real fornecida ainda. Depoimentos, CRO dos profissionais, fotos do ambiente e da equipe entram por cliente. A base precisa de slots explícitos para cada um, e nenhum deles pode ser inventado na entrega.

## Brand Personality

Moderna, confiante, direta. Fala como uma clínica que se posiciona por competência técnica, não por afeto. Frases curtas e afirmativas. Explica o procedimento sem infantilizar e sem jargão. Nunca promete resultado, nunca usa exclamação, nunca chama o paciente de "você merece". Autoridade acima de acolhimento, mas autoridade que responde rápido.

## Anti-references

Quatro recusas explícitas, todas nomeadas pelo cliente:

Odonto genérico, azul claro sobre branco, foto de banco de imagem de gente sorrindo de braços cruzados, ícone de dentinho, headline "seu sorriso é nossa prioridade". Template Elementor, carrossel de tratamentos, grade de cards idênticos com ícone, título e parágrafo, seções empilhadas sem variação de ritmo. Luxo dourado, serif fina, dourado e mármore, estética de clínica de harmonização de influencer. Landing de SaaS, gradiente, número gigante de métrica, badge de "novo", vidro e blur.

O azul foi mantido como família cromática por decisão do cliente, mas o azul claro sobre branco está na lista de recusa. A resolução é comprometer com um azul-tinta profundo que carrega superfície de verdade, e quebrar a esterilidade com um acento quente terroso.

## Design Principles

Contato a um toque. Em qualquer ponto de qualquer página, falar com a clínica é uma ação visível, não uma busca. O WhatsApp acompanha o scroll no mobile.

O conteúdo é o SEO. Título, texto, FAQ e dados da clínica vivem no HTML, não são montados por JavaScript. O que o JavaScript faz é personalizar, nunca revelar.

Rosto e registro. Profissional sem foto, sem CRO e sem formação não entra. A credibilidade dessa categoria é nominal e verificável, não adjetiva.

Explicar antes de vender. Cada tratamento responde o que é, para quem serve e como funciona antes de pedir o agendamento. O medo do paciente é resolvido com informação.

Trocar cliente é editar um arquivo. Identidade, contato, horário, cores e integrações ficam centralizados. Duplicar a base e mudar de clínica não pode exigir arqueologia no HTML.

## Accessibility & Inclusion

WCAG 2.1 AA como piso, verificado e não presumido: contraste de 4.5:1 em texto corrido e 3:1 em texto grande, foco visível em todo elemento interativo, navegação completa por teclado, alvos de toque de 44px, hierarquia de headings sem salto e landmarks reais. O público inclui pessoas mais velhas em telas pequenas, então o corpo de texto nunca desce de 16px e nada depende só de cor para significar. Toda animação tem alternativa em `prefers-reduced-motion`.
