/* ============================================================
   CONFIG, identidade da clínica.

   Este é o arquivo que você edita para cada cliente novo.
   Ele controla: nome, contatos, endereço, horários, redes, mapa,
   links de WhatsApp e todo o JSON-LD de SEO local.

   O texto editorial (headline, descrição de tratamento, FAQ, bio)
   NÃO mora aqui, mora no HTML, porque o Google precisa ler sem
   executar JavaScript. Veja o README.

   Depois de editar, rode:  node tools/sync.mjs
   para gravar estes valores dentro do HTML e o site ficar
   correto mesmo com o JavaScript desligado.

   Os dados abaixo foram extraídos do site anterior da clínica.
   O que ficou como TROCAR é o que o site anterior não informava.
   ============================================================ */

window.CLINICA = {
  /* ---------- Identidade ---------- */
  // Nome como aparece no Google Meu Negócio.
  nome: 'Concepto Saúde e Bem Estar',
  nomeCurto: 'Concepto',
  descritor: 'Excelência em Odontologia',
  // TROCAR: confirme o domínio final antes de publicar.
  site: 'https://www.conceptoodontologia.com.br',
  // Fundada em 01/02/2007, segundo o texto do site anterior.
  fundacao: 2007,

  /* ---------- Responsável técnico ----------
     Obrigatório por resolução do CFO em qualquer peça publicitária
     de clínica odontológica no Brasil. Aparece no rodapé.          */
  responsavelTecnico: {
    nome: 'Dr. Carlos Eduardo Cardoso',
    cro: 'CRO/SP 66928',
  },

  /* ---------- Contato ---------- */
  telefone: {
    exibicao: '(11) 94935-3333',
    e164: '+5511949353333',
  },

  whatsapp: {
    /* ATENÇÃO: o site anterior exibia (11) 94935-3333 mas o botão de
       WhatsApp apontava para 5511965882079, um número diferente.
       Mantive o do botão, que é o que recebia as conversas.
       TROCAR se o número certo for outro.                            */
    numero: '5511965882079',
    mensagemPadrao: 'Olá! Vim pelo site e gostaria de agendar uma avaliação.',
  },

  // TROCAR: o site anterior não publicava e-mail. Peça o que a clínica lê.
  email: 'contato@conceptoodontologia.com.br',

  /* ---------- Endereço ---------- */
  endereco: {
    logradouro: 'Rua Felipe Sabbag, 33 a',
    complemento: '',
    bairro: 'Centro',
    cidade: 'Ribeirão Pires',
    uf: 'SP',
    cep: '09400-130',
    pais: 'BR',
    // Coordenadas do pino do Google Maps da própria clínica.
    lat: -23.7109745,
    lng: -46.4134311,
  },

  /* ---------- Mapa ---------- */
  mapaEmbed:
    'https://www.google.com/maps?q=-23.7109745,-46.4134311&hl=pt-BR&z=17&output=embed',

  /* ---------- Horários ----------
     TROCAR: o site anterior não publicava horário de atendimento.
     Estes valores são um palpite de horário comercial e precisam
     ser confirmados com a clínica antes de publicar.                */
  horarios: {
    exibicao: [
      { dia: 'Segunda a sexta', hora: '09h às 19h' },
      { dia: 'Sábado', hora: '09h às 13h' },
      { dia: 'Domingo e feriados', hora: 'Fechado' },
    ],
    schema: [
      { dias: ['Mo', 'Tu', 'We', 'Th', 'Fr'], abre: '09:00', fecha: '19:00' },
      { dias: ['Sa'], abre: '09:00', fecha: '13:00' },
    ],
  },

  /* ---------- Redes sociais ---------- */
  redes: {
    instagram: 'https://www.instagram.com/concepto.rp/',
    facebook: 'https://www.facebook.com/conceptosaude.bemestar/',
    youtube: '',
    linkedin: '',
  },

  /* ---------- Formulário ---------- */
  formulario: {
    modo: 'whatsapp',
    endpoint: '',
  },

  /* ---------- Analytics ---------- */
  analytics: {
    ga4: '',
    gtm: '',
  },

  /* ---------- Verificação de propriedade ---------- */
  verificacao: {
    google: '',
  },
};
