/* ============================================================
   SITE, comportamento.

   Regra do projeto: o JavaScript PERSONALIZA, nunca REVELA.
   Todo texto indexável já está no HTML antes deste arquivo rodar.
   Se o JS falhar, o site continua legível, navegável e ranqueável.
   ============================================================ */

(function () {
  'use strict';

  var C = window.CLINICA || {};
  var doc = document;


  /* ---------------------------------------------------------
     Movimento

     Regra da casa: o conteúdo é visível por padrão. Só depois que este
     código confirma que pode animar (tem IntersectionObserver e o
     visitante não pediu menos movimento) é que o CSS passa a esconder
     o que vai entrar, via data-anim no <html>. Se o JavaScript falhar,
     não existe nada escondido esperando um gatilho que nunca vem.
     --------------------------------------------------------- */

  var GRUPOS = [
    ['.section-head', 0],
    ['.intro__text > *', 60],
    ['.intro__card', 0],
    ['.strip__item', 80],
    ['.split__text > *', 60],
    ['.split__media', 0],
    ['.tabs__list', 0],
    ['.tabs__panel', 0],
    ['.banner__text > *', 70],
    ['.cards > li', 70],
    ['.people > .person', 70],
    ['.quotes > .quote', 70],
    ['.contact__info > div', 50],
    ['.contact__card', 0],
    ['.treatment-list > li', 40],
    ['.steps > li', 50],
    ['.faq > details', 40],
    ['.gallery > li', 60],
    ['.jornada > li', 0],
  ];

  function animacoes() {
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz || !('IntersectionObserver' in window)) return;

    var alvos = [];
    GRUPOS.forEach(function (par) {
      var itens = $$(par[0]);
      itens.forEach(function (el, i) {
        if (el.hasAttribute('data-reveal')) return;
        el.setAttribute('data-reveal', '');
        if (par[1]) el.style.setProperty('--i', Math.min(i, 6));
        alvos.push(el);
      });
    });
    if (!alvos.length) return;

    doc.documentElement.setAttribute('data-anim', 'on');

    var mostrar = function (el) {
      el.classList.add('is-in');
    };

    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          mostrar(e.target);
          obs.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
    );

    alvos.forEach(function (el) {
      obs.observe(el);
    });

    // Rede de segurança: se por qualquer motivo o observer não disparar
    // (aba em segundo plano, renderizador sem viewport, extensão), tudo
    // aparece assim mesmo. Nada fica preso invisível.
    setTimeout(function () {
      alvos.forEach(mostrar);
      obs.disconnect();
    }, 2500);
  }

  /* ---------------------------------------------------------
     Utilitários
     --------------------------------------------------------- */

  function $(sel, root) {
    return (root || doc).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(sel));
  }

  function onlyDigits(v) {
    return String(v || '').replace(/\D+/g, '');
  }

  function waHref(texto) {
    var num = onlyDigits(C.whatsapp && C.whatsapp.numero);
    var msg = texto || (C.whatsapp && C.whatsapp.mensagemPadrao) || '';
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);
  }

  function enderecoLinha() {
    var e = C.endereco || {};
    var p1 = [e.logradouro, e.complemento].filter(Boolean).join(', ');
    var p2 = [e.bairro, e.cidade && e.cidade + '/' + e.uf, e.cep]
      .filter(Boolean)
      .join(' · ');
    return [p1, p2].filter(Boolean).join(' · ');
  }

  /* Resolve caminhos usados em data-bind. Valores calculados vêm primeiro. */
  function resolve(path) {
    switch (path) {
      case 'nome':
        return C.nome;
      case 'nomeCurto':
        return C.nomeCurto;
      case 'descritor':
        return C.descritor;
      case 'email':
        return C.email;
      case 'telefone':
        return C.telefone && C.telefone.exibicao;
      case 'endereco':
        return enderecoLinha();
      case 'enderecoRua':
        return [
          C.endereco && C.endereco.logradouro,
          C.endereco && C.endereco.complemento,
        ]
          .filter(Boolean)
          .join(', ');
      case 'enderecoCidade':
        var e = C.endereco || {};
        return [e.bairro, e.cidade && e.cidade + '/' + e.uf, e.cep]
          .filter(Boolean)
          .join(' · ');
      case 'cidade':
        return C.endereco && C.endereco.cidade;
      case 'cidadeUf':
        return (
          (C.endereco && C.endereco.cidade) +
          '/' +
          (C.endereco && C.endereco.uf)
        );
      case 'fundacao':
        return C.fundacao;
      case 'anosAtuacao':
        return C.fundacao ? new Date().getFullYear() - C.fundacao : '';
      case 'ano':
        return new Date().getFullYear();
      case 'responsavel':
        var r = C.responsavelTecnico || {};
        return [r.nome, r.cro].filter(Boolean).join(' · ');
      default:
        return undefined;
    }
  }

  /* ---------------------------------------------------------
     1. Hidratação a partir do config
        O HTML já traz o valor padrão escrito; isto só sobrescreve.
     --------------------------------------------------------- */

  function hydrate() {
    $$('[data-bind]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-bind'));
      if (v !== undefined && v !== null && v !== '') el.textContent = v;
    });

    // Links de telefone
    $$('[data-tel]').forEach(function (el) {
      if (C.telefone && C.telefone.e164) el.href = 'tel:' + C.telefone.e164;
    });

    // Links de e-mail
    $$('[data-email]').forEach(function (el) {
      if (C.email) el.href = 'mailto:' + C.email;
    });

    // Links de WhatsApp. data-wa pode conter a mensagem específica do contexto.
    $$('[data-wa]').forEach(function (el) {
      el.href = waHref(el.getAttribute('data-wa') || '');
      el.rel = 'noopener';
      el.target = '_blank';
    });

    // Redes sociais: some o que não estiver preenchido
    $$('[data-rede]').forEach(function (el) {
      var url = (C.redes || {})[el.getAttribute('data-rede')];
      if (url) el.href = url;
      else el.remove();
    });

    // Mapa: só injeta o iframe quando existe endereço configurado
    var map = $('[data-mapa]');
    if (map && C.mapaEmbed) {
      var f = doc.createElement('iframe');
      f.src = C.mapaEmbed;
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.title = 'Mapa com a localização de ' + (C.nome || 'nossa clínica');
      f.setAttribute('allowfullscreen', '');
      map.appendChild(f);
    }

    // Horários
    var horarios = $('[data-horarios]');
    if (horarios && C.horarios && C.horarios.exibicao) {
      horarios.innerHTML = '';
      C.horarios.exibicao.forEach(function (h) {
        var row = doc.createElement('div');
        var dt = doc.createElement('dt');
        var dd = doc.createElement('dd');
        dt.textContent = h.dia;
        dd.textContent = h.hora;
        row.appendChild(dt);
        row.appendChild(dd);
        horarios.appendChild(row);
      });
    }

    // Canonical e og:url, rede de segurança caso o domínio mude no config.
    // Só faz sentido servindo por http(s): aberto do disco (file://) o
    // caminho local não é uma URL pública.
    if (C.site && /^https?:$/.test(location.protocol)) {
      var base = C.site.replace(/\/$/, '');
      var path = location.pathname.replace(/index\.html$/, '');
      var canonical = $('link[rel="canonical"]');
      if (canonical) canonical.href = base + path;
      var og = $('meta[property="og:url"]');
      if (og) og.content = base + path;
    }

    // Marca o item de menu da página atual
    var here = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    $$('.nav-desktop a, .nav-drawer nav a').forEach(function (a) {
      var target = a.getAttribute('href').split('/').filter(Boolean).pop();
      if (target === here) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------------------------------------------------------
     2. Header e barra fixa
     --------------------------------------------------------- */

  function chrome() {
    var header = $('.site-header');
    if (!header) return;

    var grudar = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    grudar();
    window.addEventListener('scroll', grudar, { passive: true });
  }

  /* ---------------------------------------------------------
     3. Menu em drawer, <dialog> nativo cuida de foco e Esc
     --------------------------------------------------------- */

  function drawer() {
    var dlg = $('#menu');
    var open = $('.nav-toggle');
    if (!dlg || !open) return;

    if (typeof dlg.showModal !== 'function') {
      // Navegador sem <dialog>: o menu vira link âncora para o rodapé.
      open.setAttribute('aria-expanded', 'false');
      return;
    }

    open.addEventListener('click', function () {
      dlg.showModal();
      doc.documentElement.style.overflow = 'hidden';
      open.setAttribute('aria-expanded', 'true');
    });

    var close = function () {
      if (dlg.open) dlg.close();
    };

    $$('[data-close]', dlg).forEach(function (el) {
      el.addEventListener('click', close);
    });

    $$('nav a', dlg).forEach(function (a) {
      a.addEventListener('click', close);
    });

    dlg.addEventListener('close', function () {
      doc.documentElement.style.overflow = '';
      open.setAttribute('aria-expanded', 'false');
      open.focus();
    });

    // Clique no backdrop fecha
    dlg.addEventListener('click', function (ev) {
      if (ev.target === dlg) close();
    });
  }


  /* ---------------------------------------------------------
     Abas de tratamento
     Os painéis existem todos no HTML, o JavaScript só esconde os
     inativos. Sem JS, todos ficam visíveis e legíveis, um embaixo do
     outro, e o Google lê o conteúdo inteiro.
     --------------------------------------------------------- */

  function abas() {
    var raiz = $('[data-tabs]');
    if (!raiz) return;

    var botoes = $$('[role="tab"]', raiz);
    var paineis = $$('[role="tabpanel"]', raiz);
    var lista = $('.tabs__list', raiz);
    var prev = $('[data-tabs-prev]', raiz);
    var next = $('[data-tabs-next]', raiz);
    if (!botoes.length) return;

    var atual = 0;
    var interativo = false;

    /* A caixa não pode mudar de altura ao trocar de tratamento. Medimos
       todos os painéis uma vez e travamos no mais alto. A medição é
       síncrona, mostra e re-esconde antes do navegador pintar, então
       não pisca nada na tela. */
    function travarAltura() {
      raiz.style.removeProperty('--painel-h');
      var estados = paineis.map(function (p) {
        return p.hidden;
      });
      paineis.forEach(function (p) {
        p.style.visibility = 'hidden';
        p.hidden = false;
      });
      var maior = 0;
      paineis.forEach(function (p) {
        maior = Math.max(maior, p.offsetHeight);
      });
      paineis.forEach(function (p, k) {
        p.hidden = estados[k];
        p.style.visibility = '';
      });
      if (maior) raiz.style.setProperty('--painel-h', maior + 'px');
    }

    function mostrar(i, focar) {
      atual = i;
      botoes.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
        b.tabIndex = j === i ? 0 : -1;
      });
      paineis.forEach(function (p, j) {
        var entrando = j === i && p.hidden;
        p.hidden = j !== i;
        // Reinicia a animação do painel que acabou de aparecer: só trocar
        // o hidden não faz o navegador rodar a keyframe de novo.
        if (entrando) {
          p.style.animation = 'none';
          void p.offsetWidth;
          p.style.animation = '';
        }
      });
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === botoes.length - 1;
      if (focar) botoes[i].focus();
      // Só reposiciona a lista quando a troca partiu do usuário. Fazer isso
      // na carga rolava a página inteira até as abas.
      if (interativo) botoes[i].scrollIntoView({ block: 'nearest', inline: 'center' });
    }

    botoes.forEach(function (b, i) {
      b.addEventListener('click', function () {
        mostrar(i, false);
      });
      b.addEventListener('keydown', function (ev) {
        var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        ev.preventDefault();
        mostrar((i + d + botoes.length) % botoes.length, true);
      });
    });

    /* As setas mudam de tratamento, não apenas rolam a lista. */
    if (prev) {
      prev.addEventListener('click', function () {
        if (atual > 0) mostrar(atual - 1, false);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        if (atual < botoes.length - 1) mostrar(atual + 1, false);
      });
    }

    /* Abre a aba pedida pela URL. Os cards de estética e o rodapé linkam
       para #aba-<slug>, então o visitante cai direto no tratamento certo. */
    var pedida = (location.hash || '').replace('#', '');
    var inicial = 0;
    botoes.forEach(function (b, k) {
      if (b.id === pedida) inicial = k;
    });

    mostrar(inicial, false);
    interativo = true;

    window.addEventListener('hashchange', function () {
      var alvo = (location.hash || '').replace('#', '');
      botoes.forEach(function (b, k) {
        if (b.id === alvo) mostrar(k, false);
      });
    });

    travarAltura();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(travarAltura);

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(travarAltura, 200);
    });

    // Imagem que carrega depois pode mudar a conta; remede quando terminarem.
    $$('img', raiz).forEach(function (img) {
      if (!img.complete) img.addEventListener('load', function () {
        clearTimeout(t);
        t = setTimeout(travarAltura, 120);
      });
    });
  }


  /* ---------------------------------------------------------
     Select

     O <select> nativo continua no HTML e continua sendo quem guarda o
     valor enviado, validação, submit e preenchimento automático não
     mudam. O que este código faz é escondê-lo e desenhar por cima uma
     listbox acessível. Sem JavaScript, o campo nativo aparece normal.
     --------------------------------------------------------- */

  function selects() {
    $$('.field select').forEach(function (sel, n) {
      if (sel.dataset.pronto) return;
      sel.dataset.pronto = '1';

      var campo = sel.closest('.field');
      var rotulo = campo ? $('label', campo) : null;
      if (rotulo && !rotulo.id) rotulo.id = (sel.id || 'sel' + n) + '-rotulo';

      var opcoes = Array.prototype.slice.call(sel.options);
      var idBase = (sel.id || 'sel' + n) + '-opt';

      var caixa = doc.createElement('div');
      caixa.className = 'select';

      var botao = doc.createElement('button');
      botao.type = 'button';
      botao.className = 'select__botao';
      botao.id = (sel.id || 'sel' + n) + '-botao';
      botao.setAttribute('aria-haspopup', 'listbox');
      botao.setAttribute('aria-expanded', 'false');
      if (rotulo) botao.setAttribute('aria-labelledby', rotulo.id + ' ' + botao.id);

      var texto = doc.createElement('span');
      texto.className = 'select__valor';
      botao.appendChild(texto);
      botao.insertAdjacentHTML(
        'beforeend',
        '<svg class="select__seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
      );

      var lista = doc.createElement('ul');
      lista.className = 'select__lista';
      lista.setAttribute('role', 'listbox');
      if (rotulo) lista.setAttribute('aria-labelledby', rotulo.id);
      lista.hidden = true;

      opcoes.forEach(function (op, i) {
        var item = doc.createElement('li');
        item.className = 'select__item';
        item.id = idBase + '-' + i;
        item.setAttribute('role', 'option');
        item.tabIndex = -1;
        item.textContent = op.textContent.trim();
        item.setAttribute('aria-selected', i === sel.selectedIndex ? 'true' : 'false');
        item.addEventListener('click', function () {
          escolher(i);
          fechar(true);
        });
        lista.appendChild(item);
      });

      var itens = Array.prototype.slice.call(lista.children);

      function escolher(i) {
        sel.selectedIndex = i;
        itens.forEach(function (it, j) {
          it.setAttribute('aria-selected', j === i ? 'true' : 'false');
        });
        texto.textContent = opcoes[i].textContent.trim();
        caixa.classList.toggle('is-vazio', opcoes[i].value === '');
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }

      function abrir() {
        lista.hidden = false;
        botao.setAttribute('aria-expanded', 'true');
        var ativo = itens[sel.selectedIndex] || itens[0];
        if (ativo) ativo.focus();
        doc.addEventListener('click', fora, true);
      }

      function fechar(devolverFoco) {
        if (lista.hidden) return;
        lista.hidden = true;
        botao.setAttribute('aria-expanded', 'false');
        doc.removeEventListener('click', fora, true);
        if (devolverFoco) botao.focus();
      }

      function fora(ev) {
        if (!caixa.contains(ev.target)) fechar(false);
      }

      botao.addEventListener('click', function () {
        if (lista.hidden) abrir();
        else fechar(true);
      });

      botao.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          abrir();
        }
      });

      lista.addEventListener('keydown', function (ev) {
        var i = itens.indexOf(doc.activeElement);
        if (i < 0) return;

        if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          var d = ev.key === 'ArrowDown' ? 1 : -1;
          itens[(i + d + itens.length) % itens.length].focus();
        } else if (ev.key === 'Home') {
          ev.preventDefault();
          itens[0].focus();
        } else if (ev.key === 'End') {
          ev.preventDefault();
          itens[itens.length - 1].focus();
        } else if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          escolher(i);
          fechar(true);
        } else if (ev.key === 'Escape') {
          ev.preventDefault();
          fechar(true);
        } else if (ev.key === 'Tab') {
          fechar(false);
        } else if (ev.key.length === 1) {
          // Busca por letra, como no select nativo.
          var letra = ev.key.toLowerCase();
          for (var k = 1; k <= itens.length; k++) {
            var alvo = itens[(i + k) % itens.length];
            if (alvo.textContent.trim().toLowerCase().indexOf(letra) === 0) {
              alvo.focus();
              break;
            }
          }
        }
      });

      sel.classList.add('select__nativo');
      sel.tabIndex = -1;
      sel.setAttribute('aria-hidden', 'true');
      sel.parentNode.insertBefore(caixa, sel);
      caixa.appendChild(sel);
      caixa.appendChild(botao);
      caixa.appendChild(lista);

      escolher(sel.selectedIndex < 0 ? 0 : sel.selectedIndex);
    });
  }


  /* ---------------------------------------------------------
     Faixa de credibilidade

     O véu com o texto entra no hover. Em tela de toque não existe hover,
     então o primeiro toque abre e o segundo fecha. O teclado usa o foco,
     que o CSS já cobre.
     --------------------------------------------------------- */

  function faixa() {
    var itens = $$('.strip__item');
    if (!itens.length) return;

    itens.forEach(function (item) {
      item.tabIndex = 0;

      item.addEventListener('pointerdown', function (ev) {
        if (ev.pointerType !== 'touch' && ev.pointerType !== 'pen') return;
        var jaAberto = item.classList.contains('is-aberto');
        itens.forEach(function (o) {
          o.classList.remove('is-aberto');
        });
        if (!jaAberto) item.classList.add('is-aberto');
      });

      item.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        ev.preventDefault();
        item.classList.toggle('is-aberto');
      });
    });
  }


  /* ---------------------------------------------------------
     Scrollspy

     Na página única, o sublinhado do menu acompanha a seção em que o
     visitante está. Marca com aria-current="location", que é o valor
     certo para "posição atual dentro da página", aria-current="page"
     continua reservado para a página em si.
     --------------------------------------------------------- */

  function scrollspy() {
    if (doc.body.getAttribute('data-page') !== 'home') return;

    var links = $$('.nav-desktop a[data-secao], .nav-drawer nav a[data-secao]');
    if (!links.length) return;

    var itens = [];
    links.forEach(function (a) {
      var ancora = doc.getElementById(a.getAttribute('data-secao'));
      if (!ancora) return;
      var secao = ancora.closest('section') || ancora;
      itens.push({ link: a, secao: secao });
    });
    if (!itens.length) return;

    // Ordena pela posição real na página, não pela ordem do menu.
    function topo(el) {
      return el.getBoundingClientRect().top + window.scrollY;
    }

    var atual = null;

    function marcar() {
      var ordenados = itens.slice().sort(function (a, b) {
        return topo(a.secao) - topo(b.secao);
      });

      // A linha de referência fica a 35% da altura da janela: a seção
      // "atual" é a última que já cruzou essa linha.
      var linha = window.scrollY + window.innerHeight * 0.35;
      var escolhido = ordenados[0];
      ordenados.forEach(function (it) {
        if (topo(it.secao) <= linha) escolhido = it;
      });

      // No fim da página o último item ganha, senão a última seção nunca
      // fica ativa quando é mais curta que a janela.
      if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 4) {
        escolhido = ordenados[ordenados.length - 1];
      }

      if (escolhido === atual) return;
      atual = escolhido;

      var alvo = escolhido.link.getAttribute('data-secao');
      links.forEach(function (a) {
        if (a.getAttribute('data-secao') === alvo) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }

    var pendente = false;
    function agendar() {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(function () {
        pendente = false;
        marcar();
      });
    }

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    marcar();
  }

  /* ---------------------------------------------------------
     4. Formulário
     --------------------------------------------------------- */

  function mascaraTelefone(v) {
    var d = onlyDigits(v).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10)
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var REGRAS = {
    nome: function (v) {
      if (!v.trim()) return 'Escreva seu nome para a gente saber com quem falar.';
      if (v.trim().length < 3) return 'Nome muito curto. Escreva pelo menos 3 letras.';
      return '';
    },
    // O formulário não pede telefone: no modo whatsapp o número vem da
    // própria conversa. Se você reativar o campo, devolva a regra aqui.
    tratamento: function () {
      return '';
    },
    mensagem: function () {
      return '';
    },
    consentimento: function (v, el) {
      if (!el.checked) return 'Precisamos do seu aceite para entrar em contato.';
      return '';
    },
  };

  /* Devolve o <p class="field__error"> que pertence a este controle.
     O checkbox de consentimento não vive dentro de .field: o parágrafo de
     erro dele é o irmão seguinte do bloco .form__consent. */
  function slotDeErro(el) {
    var campo = el.closest('.field');
    if (campo) return { campo: campo, p: $('.field__error', campo) };
    var consent = el.closest('.form__consent');
    var irmao = consent && consent.nextElementSibling;
    if (irmao && irmao.classList.contains('field__error'))
      return { campo: null, p: irmao };
    return { campo: null, p: null };
  }

  function marcaErro(el, msg) {
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var alvo = slotDeErro(el);
    if (!alvo.p) return;
    if (alvo.campo) alvo.campo.classList.toggle('has-error', !!msg);
    else alvo.p.classList.toggle('is-shown', !!msg);
    var texto = $('span', alvo.p);
    if (texto) texto.textContent = msg;
  }

  /* Liga cada campo ao seu parágrafo de erro, para o leitor de tela anunciar
     a mensagem junto com o rótulo. */
  function ligaDescricoes(form) {
    $$('input, select, textarea', form).forEach(function (el) {
      if (!el.id) return;
      var alvo = slotDeErro(el);
      if (!alvo.p) return;
      if (!alvo.p.id) alvo.p.id = el.id + '-erro';
      var atual = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      if (atual.indexOf(alvo.p.id) === -1) atual.push(alvo.p.id);
      el.setAttribute('aria-describedby', atual.join(' '));
    });
  }

  function montaMensagem(dados) {
    var linhas = ['Olá! Vim pelo site.'];
    if (dados.nome) linhas.push('Nome: ' + dados.nome);
    if (dados.telefone) linhas.push('Telefone: ' + dados.telefone);
    if (dados.tratamento) linhas.push('Interesse: ' + dados.tratamento);
    if (dados.mensagem) linhas.push('Mensagem: ' + dados.mensagem);
    return linhas.join('\n');
  }

  function formulario() {
    $$('form[data-form]').forEach(function (form) {
      var status = $('.form__status', form);
      var submit = $('[type="submit"]', form);

      ligaDescricoes(form);

      var tel = $('input[name="telefone"]', form);
      if (tel) {
        tel.addEventListener('input', function () {
          var pos = tel.selectionStart === tel.value.length;
          tel.value = mascaraTelefone(tel.value);
          if (pos) tel.setSelectionRange(tel.value.length, tel.value.length);
        });
      }

      // Valida ao sair do campo, mas só depois da primeira tentativa de envio
      //, validar enquanto a pessoa ainda digita é hostil.
      form.addEventListener(
        'blur',
        function (ev) {
          if (!form.dataset.tentou) return;
          var el = ev.target;
          var regra = REGRAS[el.name];
          if (regra) marcaErro(el, regra(el.value, el));
        },
        true
      );

      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        form.dataset.tentou = '1';

        // Honeypot: se veio preenchido, é robô. Finge sucesso e não envia.
        var trap = $('input[name="empresa"]', form);
        if (trap && trap.value) return;

        var primeiroErro = null;
        Object.keys(REGRAS).forEach(function (nome) {
          var el = form.elements[nome];
          if (!el) return;
          var msg = REGRAS[nome](el.value, el);
          marcaErro(el, msg);
          if (msg && !primeiroErro) primeiroErro = el;
        });

        if (primeiroErro) {
          primeiroErro.focus();
          if (status) {
            status.dataset.state = 'error';
            status.textContent = 'Confira os campos destacados e envie de novo.';
          }
          return;
        }

        var dados = {
          nome: (form.elements.nome || {}).value || '',
          telefone: (form.elements.telefone || {}).value || '',
          tratamento: (form.elements.tratamento || {}).value || '',
          mensagem: (form.elements.mensagem || {}).value || '',
        };

        var modo = (C.formulario && C.formulario.modo) || 'whatsapp';

        if (modo === 'endpoint' && C.formulario.endpoint) {
          if (submit) submit.setAttribute('aria-busy', 'true');
          if (status) {
            status.dataset.state = 'ok';
            status.textContent = 'Enviando…';
          }
          fetch(C.formulario.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(dados),
          })
            .then(function (r) {
              if (!r.ok) throw new Error('http ' + r.status);
              form.reset();
              if (status) {
                status.dataset.state = 'ok';
                status.textContent =
                  'Recebemos sua mensagem. Retornamos dentro do horário de atendimento.';
              }
            })
            .catch(function () {
              if (status) {
                status.dataset.state = 'error';
                status.innerHTML =
                  'Não conseguimos enviar agora. ' +
                  '<a href="' +
                  waHref(montaMensagem(dados)) +
                  '" target="_blank" rel="noopener">Fale com a gente no WhatsApp</a>.';
              }
            })
            .finally(function () {
              if (submit) submit.removeAttribute('aria-busy');
            });
          return;
        }

        // Modo padrão: abre o WhatsApp com a mensagem já montada.
        window.open(waHref(montaMensagem(dados)), '_blank', 'noopener');
        if (status) {
          status.dataset.state = 'ok';
          status.textContent =
            'Abrimos o WhatsApp com sua mensagem pronta. É só enviar.';
        }
      });
    });
  }

  /* ---------------------------------------------------------
     5. SEO, dados estruturados gerados a partir do config
        Um único ponto de verdade para nome, endereço e horário.
     --------------------------------------------------------- */

  function jsonld() {
    var base = (C.site || '').replace(/\/$/, '');
    var e = C.endereco || {};
    var grafo = [];

    var negocio = {
      '@type': 'Dentist',
      '@id': base + '/#clinica',
      name: C.nome,
      url: base + '/',
      telephone: C.telefone && C.telefone.e164,
      email: C.email,
      priceRange: '$$',
      currenciesAccepted: 'BRL',
      image: base + '/assets/img/og-default.jpg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: [e.logradouro, e.complemento].filter(Boolean).join(', '),
        addressLocality: e.cidade,
        addressRegion: e.uf,
        postalCode: e.cep,
        addressCountry: e.pais || 'BR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: e.lat, longitude: e.lng },
      areaServed: { '@type': 'City', name: e.cidade },
      openingHoursSpecification: (C.horarios && C.horarios.schema ? C.horarios.schema : []).map(
        function (h) {
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dias,
            opens: h.abre,
            closes: h.fecha,
          };
        }
      ),
      sameAs: Object.keys(C.redes || {})
        .map(function (k) {
          return C.redes[k];
        })
        .filter(Boolean),
    };
    if (C.fundacao) negocio.foundingDate = String(C.fundacao);
    grafo.push(negocio);

    grafo.push({
      '@type': 'WebSite',
      '@id': base + '/#site',
      url: base + '/',
      name: C.nome,
      inLanguage: 'pt-BR',
      publisher: { '@id': base + '/#clinica' },
    });

    // Breadcrumb: lido da própria trilha renderizada na página
    var crumbs = $$('.breadcrumb ol li');
    if (crumbs.length) {
      grafo.push({
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map(function (li, i) {
          var a = $('a', li);
          return {
            '@type': 'ListItem',
            position: i + 1,
            name: (a || li).textContent.trim(),
            item: a ? a.href : base + location.pathname,
          };
        }),
      });
    }

    // FAQ: lido dos <details> da página
    var faqs = $$('.faq details');
    if (faqs.length) {
      grafo.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map(function (d) {
          var q = $('summary', d);
          var a = $('summary + div', d);
          return {
            '@type': 'Question',
            name: q ? q.textContent.trim() : '',
            acceptedAnswer: {
              '@type': 'Answer',
              text: a ? a.textContent.trim().replace(/\s+/g, ' ') : '',
            },
          };
        }),
      });
    }

    // Profissionais: lidos dos cartões marcados com data-person
    var pessoas = $$('[data-person]');
    if (pessoas.length) {
      pessoas.forEach(function (p) {
        var img = $('img', p);
        grafo.push({
          '@type': 'Person',
          name: (p.getAttribute('data-person') || '').trim(),
          jobTitle: (($('.person__role', p) || {}).textContent || '').trim(),
          identifier: (($('.person__cro', p) || {}).textContent || '').trim(),
          image: img ? img.currentSrc || img.src : undefined,
          worksFor: { '@id': base + '/#clinica' },
        });
      });
    }

    // Um MedicalProcedure por tratamento. Com as abas na home, são vários
    // por página, e cada painel descreve o seu.
    $$('[data-servico]').forEach(function (svc) {
      var passos = $('.steps', svc);
      grafo.push({
        '@type': 'MedicalProcedure',
        name: svc.getAttribute('data-servico'),
        procedureType: 'https://schema.org/TherapeuticProcedure',
        howPerformed: ((passos || {}).textContent || '').trim().replace(/\s+/g, ' ').slice(0, 500),
        provider: { '@id': base + '/#clinica' },
      });
    });

    var tag = doc.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
    doc.head.appendChild(tag);
  }

  /* ---------------------------------------------------------
     6. Analytics, só carrega se houver ID configurado
     --------------------------------------------------------- */

  function analytics() {
    var id = C.analytics && C.analytics.ga4;
    if (!id) return;
    var s = doc.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    doc.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id);

    // Conversão que interessa: clique em WhatsApp e em telefone.
    doc.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href^="https://wa.me"], a[href^="tel:"]');
      if (!a) return;
      window.gtag('event', 'contato', {
        canal: a.href.indexOf('tel:') === 0 ? 'telefone' : 'whatsapp',
        origem: location.pathname,
      });
    });
  }

  /* ---------------------------------------------------------
     Modal de profissional

     Os <dialog> chegam com `open`, como bloco comum: sem JavaScript a
     formação de cada profissional continua legível na página. Aqui eles
     são fechados e passam a abrir por cima, no clique do cartão. O
     <dialog> nativo cuida de foco preso, Esc e retorno do foco.

     Se o navegador não tiver showModal, nada é fechado: o visitante fica
     com os blocos abertos, que é pior de ler mas não esconde nada.
     --------------------------------------------------------- */

  function pessoas() {
    var modais = $$('dialog.pessoa');
    if (!modais.length) return;

    var suporta = typeof modais[0].showModal === 'function';
    if (!suporta) return;

    modais.forEach(function (dlg) {
      if (dlg.open) dlg.close();

      $$('[data-fechar]', dlg).forEach(function (b) {
        b.addEventListener('click', function () {
          dlg.close();
        });
      });

      /* Clique no fundo fecha. O <dialog> recebe o clique quando ele cai
         fora do conteúdo, por isso a comparação com o próprio alvo. */
      dlg.addEventListener('click', function (ev) {
        if (ev.target === dlg) dlg.close();
      });

      dlg.addEventListener('close', function () {
        doc.documentElement.style.overflow = '';
      });
    });

    $$('[data-pessoa]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var dlg = doc.getElementById('pessoa-' + botao.getAttribute('data-pessoa'));
        if (!dlg) return;
        dlg.showModal();
        doc.documentElement.style.overflow = 'hidden';
      });
    });
  }

  /* ---------------------------------------------------------
     Carrossel

     A rolagem em si é nativa, com encaixe feito no CSS: o dedo
     funciona mesmo sem JavaScript. O que este trecho acrescenta são as
     setas, para quem está no mouse ou no teclado, e o desligamento
     delas quando não há para onde rolar. É por isso que a faixa de
     credibilidade não precisa de nada extra no desktop: lá ela vira
     grade, o trilho para de rolar e as setas somem sozinhas.
     --------------------------------------------------------- */

  function carrossel() {
    var reduz = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    $$('[data-carrossel]').forEach(function (raiz) {
      var trilho = $('.carrossel__trilho', raiz);
      var anterior = $('[data-carrossel-prev]', raiz);
      var proxima = $('[data-carrossel-next]', raiz);
      if (!trilho || !anterior || !proxima) return;

      var passo = function () {
        var item = trilho.firstElementChild;
        if (!item) return trilho.clientWidth;
        var vao = parseFloat(getComputedStyle(trilho).columnGap) || 0;
        return item.getBoundingClientRect().width + vao;
      };

      var mover = function (direcao) {
        try {
          trilho.scrollBy({
            left: direcao * passo(),
            behavior: reduz && reduz.matches ? 'auto' : 'smooth',
          });
        } catch (e) {
          trilho.scrollLeft += direcao * passo();
        }
      };

      anterior.addEventListener('click', function () {
        mover(-1);
      });
      proxima.addEventListener('click', function () {
        mover(1);
      });

      var atualizar = function () {
        var maximo = trilho.scrollWidth - trilho.clientWidth;
        var rolavel = maximo > 2;
        raiz.classList.toggle('carrossel--parado', !rolavel);
        anterior.disabled = !rolavel || trilho.scrollLeft <= 2;
        proxima.disabled = !rolavel || trilho.scrollLeft >= maximo - 2;
      };

      trilho.addEventListener('scroll', atualizar, { passive: true });
      window.addEventListener('resize', atualizar);
      atualizar();
      /* As fotos entram depois e mudam a largura do trilho. */
      window.addEventListener('load', atualizar);
    });
  }

  /* ---------------------------------------------------------
     Rolagem suave nos links internos

     Os itens do menu apontam para "index.html#secao" porque as páginas
     internas precisam voltar para a home. O efeito colateral aparece na
     própria home: para o navegador, "index.html#sobre" visto de "/" é
     outro endereço, então ele NAVEGA em vez de rolar. O resultado é um
     salto seco, com recarga, e o `scroll-behavior: smooth` do CSS nunca
     chega a valer, porque ele só age em âncora do mesmo documento.

     Aqui o clique é interceptado quando o destino é o documento atual:
     rola com animação, atualiza a barra de endereço sem recarregar e
     leva o foco junto, que é o que o leitor de tela precisa para
     acompanhar o pulo. Com `prefers-reduced-motion` o salto volta a ser
     instantâneo, que é o comportamento correto nesse caso.
     --------------------------------------------------------- */

  function rolagemSuave() {
    var reduz = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    var semArquivo = function (caminho) {
      return caminho.replace(/index\.html$/, '');
    };

    var mesmoDocumento = function (url) {
      return (
        url.origin === location.origin &&
        semArquivo(url.pathname) === semArquivo(location.pathname)
      );
    };

    var rolarPara = function (alvo) {
      var suave = !(reduz && reduz.matches);
      var opcoes = { behavior: suave ? 'smooth' : 'auto', block: 'start' };

      if (alvo === null) {
        try {
          window.scrollTo({ top: 0, behavior: opcoes.behavior });
        } catch (e) {
          window.scrollTo(0, 0);
        }
        return;
      }

      try {
        alvo.scrollIntoView(opcoes);
      } catch (e) {
        alvo.scrollIntoView();
      }

      /* O foco precisa acompanhar a rolagem, senão o teclado continua
         no menu. `preventScroll` evita que o foco dê um segundo salto
         por cima da animação que acabou de começar. */
      if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
      try {
        alvo.focus({ preventScroll: true });
      } catch (e) {}
    };

    doc.addEventListener('click', function (ev) {
      if (ev.defaultPrevented) return;
      if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

      var alcance = ev.target && ev.target.closest;
      var a = alcance ? ev.target.closest('a[href]') : null;
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      /* O link de pular conteúdo tem que ser instantâneo: quem usa
         teclado quer chegar, não assistir. */
      if (a.classList.contains('skip-link')) return;

      var url;
      try {
        url = new URL(a.href, location.href);
      } catch (e) {
        return;
      }
      if (!mesmoDocumento(url)) return;

      if (!url.hash || url.hash === '#') {
        /* "Início" apontando para a própria home: volta ao topo rolando. */
        ev.preventDefault();
        rolarPara(null);
        if (location.hash) {
          try {
            history.pushState(null, '', url.pathname + url.search);
          } catch (e) {}
        }
        return;
      }

      var alvo = doc.getElementById(url.hash.slice(1));
      if (!alvo) return;

      ev.preventDefault();
      rolarPara(alvo);

      if (url.hash !== location.hash) {
        try {
          history.pushState(null, '', url.hash);
        } catch (e) {}
      }
    });
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */

  function init() {
    try {
      hydrate();
    } catch (e) {}
    chrome();
    drawer();
    rolagemSuave();
    pessoas();
    carrossel();
    abas();
    selects();
    faixa();
    scrollspy();
    animacoes();
    formulario();
    try {
      jsonld();
    } catch (e) {}
    analytics();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
