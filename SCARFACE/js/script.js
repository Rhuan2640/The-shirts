const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const ph = n => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="200" y="240" font-family="Arial" font-size="20" text-anchor="middle" fill="#999">${n}</text></svg>`);
const img = p => `<img src="${p.imagem}" alt="${p.nome}" loading="lazy" onerror="this.onerror=null;this.src=ph(this.alt)">`;
const card = p => `<a class="card" href="produto.html?id=${p.id}">${p.promocao ? '<span class="sale">SALE</span>' : ''}<div class="thumb">${img(p)}</div><h3>${p.nome}</h3><p class="preco">${fmt(p.preco)}</p><span class="btn-card">VER PRODUTO</span></a>`;

const IC = {
  menu: '<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7z"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M2 3h3l3 12h11l2-8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>'
};
const MENU = [['INÍCIO', 'index.html'], ['LANÇAMENTOS', 'index.html?filtro=lancamentos'], ['OFERTAS', 'index.html?filtro=ofertas'], ['CAMISETAS', 'index.html?cat=camisetas'], ['CALÇAS', 'index.html?cat=calcas'], ['TÊNIS', 'index.html?cat=tenis'], ['SNKRS', 'index.html?cat=tenis'], ['SOBRE NÓS', '#rodape'], ['CONTATO', '#rodape']];

function updateBadge(anim) {
  const b = document.getElementById('badge'); if (!b) return;
  b.textContent = getCart().reduce((s, i) => s + i.qtd, 0);
  if (anim) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
}

function renderLayout() {
  const h = document.getElementById('header');
  if (h) h.innerHTML = `
  <header class="topbar"><span></span><a class="logo" href="index.html">SCARFACE</a>
    <div class="icons"><button id="btnMenu" aria-label="Menu">${IC.menu}</button><button id="btnSearch" aria-label="Pesquisar">${IC.search}</button><a href="login.html" aria-label="Conta">${IC.user}</a><a href="carrinho.html" class="cartlink" aria-label="Carrinho">${IC.cart}<i id="badge">0</i></a></div>
  </header>
  <nav class="subnav"><a href="index.html?filtro=lancamentos">Lançamento</a><a href="index.html?filtro=ofertas">Ofertas</a><a href="index.html?cat=acessorios">Outros</a><a href="index.html?cat=tenis">SNKRS</a></nav>
  <div class="searchbox" id="searchbox"><input id="q" placeholder="Pesquisar produtos... (ex: camiseta)"><div class="grid small-grid" id="results"></div></div>
  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="drawer"><button class="close" id="closeMenu">✕</button>${MENU.map(m => `<a href="${m[1]}">${m[0]}</a>`).join('')}</aside>`;
  const f = document.getElementById('footer');
  if (f) f.innerHTML = `
  <footer id="rodape"><div class="foot-in"><div><div class="logo">SCARFACE</div><p>Streetwear urbano e moderno.</p></div>
  <div><h4>Institucional</h4><a href="#rodape">Sobre nós</a><a href="#rodape">Contato</a><a href="#">Política de privacidade</a><a href="#">Termos de uso</a><a href="#">Trocas e devoluções</a></div>
  <div><h4>Redes sociais</h4><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Facebook</a></div></div>
  <p class="copy">© 2026 SCARFACE. Todos os direitos reservados.</p></footer>`;
}

function initMenu() {
  const d = document.getElementById('drawer'), o = document.getElementById('overlay'); if (!d) return;
  const toggle = open => { d.classList.toggle('open', open); o.classList.toggle('show', open); };
  document.getElementById('btnMenu').onclick = () => toggle(true);
  document.getElementById('closeMenu').onclick = () => toggle(false);
  o.onclick = () => toggle(false);
  d.querySelectorAll('a').forEach(a => a.onclick = () => toggle(false));
}

function initSearch() {
  const box = document.getElementById('searchbox'); if (!box) return;
  const q = document.getElementById('q'), r = document.getElementById('results');
  document.getElementById('btnSearch').onclick = () => { box.classList.toggle('open'); if (box.classList.contains('open')) q.focus(); };
  q.oninput = () => {
    const t = norm(q.value.trim());
    if (!t) { r.innerHTML = ''; return; }
    const l = PRODUTOS.filter(p => norm(p.nome + ' ' + p.categoria + ' ' + p.descricao).includes(t));
    r.innerHTML = l.length ? l.map(card).join('') : '<p>Nenhum produto encontrado.</p>';
  };
}

function initHome() {
  const g = document.getElementById('grid'), fc = document.getElementById('fCat'); if (!g || !fc) return;
  const fo = document.getElementById('fOrd'), fs = document.getElementById('fSale');
  const q = new URLSearchParams(location.search);
  fc.value = q.get('cat') || ''; fs.checked = q.get('filtro') === 'ofertas';
  const draw = () => {
    let l = PRODUTOS.filter(p => (!fc.value || p.categoria === fc.value) && (!fs.checked || p.promocao) && (q.get('filtro') !== 'lancamentos' || p.lancamento));
    if (fo.value === 'menor') l.sort((a, b) => a.preco - b.preco);
    if (fo.value === 'maior') l.sort((a, b) => b.preco - a.preco);
    g.innerHTML = l.length ? l.map(card).join('') : '<p>Nenhum produto encontrado.</p>';
  };
  [fc, fo, fs].forEach(e => e.onchange = draw);
  draw();
}

document.addEventListener('DOMContentLoaded', () => { renderLayout(); initMenu(); initSearch(); initHome(); updateBadge(); });
