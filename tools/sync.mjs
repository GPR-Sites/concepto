#!/usr/bin/env node
/* ============================================================
   sync.mjs, grava os valores de assets/js/config.js dentro do HTML.

   Por que existe: o site funciona sem isso (o JavaScript hidrata os
   dados em tempo de execução), mas buscador e leitor de tela veem o
   HTML entregue pelo servidor. Rodar este script deixa nome, telefone,
   endereço, links de WhatsApp e domínio corretos já no arquivo,
   independentes de JavaScript.

   Uso:
     node tools/sync.mjs           aplica as mudanças
     node tools/sync.mjs --dry     só mostra o que mudaria

   Rode uma vez depois de editar config.js. É idempotente: rodar duas
   vezes seguidas não muda nada na segunda.
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');

/* ---------- Valores padrão que a base traz escritos no HTML ----------
   Se você editar o HTML à mão e trocar algum destes literais, atualize
   aqui também, é por eles que o script encontra o que substituir.      */
const PADRAO = {
  site: 'https://www.suaclinica.com.br',
  nome: 'Clínica Marca Odontologia',
  tel: 'tel:+551140000000',
  email: 'mailto:contato@suaclinica.com.br',
};

/* ---------- Carrega o config sem depender de navegador ---------- */
function carregarConfig() {
  const src = readFileSync(join(ROOT, 'assets/js/config.js'), 'utf8');
  const janela = {};
  new Function('window', src)(janela);
  if (!janela.CLINICA) throw new Error('config.js não definiu window.CLINICA');
  return janela.CLINICA;
}

const C = carregarConfig();

/* ---------- Mesmas regras de formatação do site.js ---------- */
const soDigitos = (v) => String(v || '').replace(/\D+/g, '');

function waHref(texto) {
  const msg = texto || C.whatsapp?.mensagemPadrao || '';
  return `https://wa.me/${soDigitos(C.whatsapp?.numero)}?text=${encodeURIComponent(msg)}`;
}

const e = C.endereco || {};
const ruaLinha = [e.logradouro, e.complemento].filter(Boolean).join(', ');
const cidadeLinha = [e.bairro, e.cidade && `${e.cidade}/${e.uf}`, e.cep]
  .filter(Boolean)
  .join(' · ');

const VALORES = {
  nome: C.nome,
  nomeCurto: C.nomeCurto,
  descritor: C.descritor,
  email: C.email,
  telefone: C.telefone?.exibicao,
  endereco: [ruaLinha, cidadeLinha].filter(Boolean).join(' · '),
  enderecoRua: ruaLinha,
  enderecoCidade: cidadeLinha,
  cidade: e.cidade,
  cidadeUf: `${e.cidade}/${e.uf}`,
  fundacao: C.fundacao,
  anosAtuacao: C.fundacao ? new Date().getFullYear() - C.fundacao : '',
  ano: new Date().getFullYear(),
  responsavel: [C.responsavelTecnico?.nome, C.responsavelTecnico?.cro]
    .filter(Boolean)
    .join(' · '),
};

const escapar = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- Transformações ---------- */

function aplicar(html, arquivo) {
  let out = html;

  // 1. Texto de qualquer elemento com data-bind
  out = out.replace(
    /(<(\w+)([^>]*\bdata-bind="([a-zA-Z]+)"[^>]*)>)([^<]*)(<\/\2>)/g,
    (todo, abre, tag, attrs, chave, conteudo, fecha) => {
      const v = VALORES[chave];
      if (v === undefined || v === null || v === '') return todo;
      return abre + escapar(v) + fecha;
    }
  );

  // 2. Links de WhatsApp: injeta o href resolvido no próprio HTML
  out = out.replace(/<a\b([^>]*\bdata-wa="([^"]*)"[^>]*)>/g, (todo, attrs, msg) => {
    let limpos = attrs
      .replace(/\s*\bhref="[^"]*"/g, '')
      .replace(/\s*\btarget="[^"]*"/g, '')
      .replace(/\s*\brel="[^"]*"/g, '');
    const href = waHref(msg.replace(/&amp;/g, '&'));
    return `<a href="${escapar(href)}" target="_blank" rel="noopener"${limpos}>`;
  });

  // 3. Telefone e e-mail
  if (C.telefone?.e164) out = out.split(PADRAO.tel).join(`tel:${C.telefone.e164}`);
  if (C.email) out = out.split(PADRAO.email).join(`mailto:${C.email}`);

  // 4. Domínio em canonical, og:url, robots e sitemap
  if (C.site) out = out.split(PADRAO.site).join(C.site.replace(/\/$/, ''));

  // 5. Nome da clínica em metadados (og:site_name, author, manifest)
  if (C.nome) out = out.split(PADRAO.nome).join(C.nome);

  // 6. Verificação de propriedade do Google, se configurada
  if (C.verificacao?.google && arquivo.endsWith('index.html')) {
    if (!out.includes('google-site-verification')) {
      out = out.replace(
        '<meta name="theme-color"',
        `<meta name="google-site-verification" content="${escapar(C.verificacao.google)}" />\n    <meta name="theme-color"`
      );
    }
  }

  return out;
}

/* ---------- Percorre os arquivos ---------- */

function listar(dir, acc = []) {
  for (const nome of readdirSync(dir)) {
    if (['node_modules', '.git', 'assets', 'tools'].includes(nome)) continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) listar(caminho, acc);
    else if (/\.(html|xml|txt|webmanifest)$/.test(nome)) acc.push(caminho);
  }
  return acc;
}

const arquivos = listar(ROOT);
let alterados = 0;

for (const caminho of arquivos) {
  const antes = readFileSync(caminho, 'utf8');
  const depois = aplicar(antes, caminho);
  if (antes === depois) continue;
  alterados++;
  console.log((DRY ? 'mudaria  ' : 'atualizado ') + relative(ROOT, caminho));
  if (!DRY) writeFileSync(caminho, depois, 'utf8');
}

console.log(
  `\n${arquivos.length} arquivos verificados, ${alterados} ${DRY ? 'a alterar' : 'alterados'}.`
);
if (alterados && !DRY) {
  console.log('Confira o resultado no navegador antes de publicar.');
}
