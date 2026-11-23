const CK = 'scarface_cart', FK = 'scarface_frete';
const getCart = () => { try { return JSON.parse(localStorage.getItem(CK)) || []; } catch (e) { return []; } };
const saveCart = c => { localStorage.setItem(CK, JSON.stringify(c)); updateBadge(); };
const prod = id => PRODUTOS.find(p => p.id === id);
const subtotal = () => getCart().reduce((s, i) => s + prod(i.id).preco * i.qtd, 0);
const getFrete = () => getCart().length ? Number(localStorage.getItem(FK) || 0) : 0;
function addToCart(id, tam, qtd) {
  const c = getCart(), i = c.find(x => x.id === id && x.tam === tam);
  if (i) i.qtd += qtd; else c.push({ id, tam, qtd });
  saveCart(c); updateBadge(true);
}
function calcFrete(cep) {
  const d = cep.replace(/\D/g, ''); if (d.length !== 8) return null;
  return subtotal() >= 500 ? 0 : 19.9 + Number(d[0]) * 3;
}
function totais() {
  const s = document.getElementById('sub'), f = document.getElementById('fr'), t = document.getElementById('total');
  if (s) s.textContent = fmt(subtotal());
  if (f) f.textContent = fmt(getFrete());
  if (t) t.textContent = fmt(subtotal() + getFrete());
}

function initProduto() {
  const box = document.getElementById('produto'); if (!box) return;
  const p = prod(Number(new URLSearchParams(location.search).get('id')));
  if (!p) { box.innerHTML = '<p>Produto não encontrado.</p>'; return; }
  let tam = 'M', qtd = 1;
  box.innerHTML = `<div class="pimg">${img(p)}</div><div class="pinfo">${p.promocao ? '<span class="sale">SALE</span>' : ''}<h1>${p.nome}</h1><p class="preco grande">${fmt(p.preco)}</p><p>${p.descricao}</p>
  <h4>Tamanho</h4><div class="sizes">${['P', 'M', 'G', 'GG'].map(t => `<button class="size${t === tam ? ' on' : ''}" data-t="${t}">${t}</button>`).join('')}</div>
  <h4>Quantidade</h4><div class="qty"><button id="m">-</button><span id="qv">1</span><button id="pl">+</button></div>
  <button class="btn red block" id="add">ADICIONAR AO CARRINHO</button><p id="msg" class="small"></p></div>`;
  box.querySelectorAll('.size').forEach(b => b.onclick = () => { tam = b.dataset.t; box.querySelectorAll('.size').forEach(x => x.classList.toggle('on', x === b)); });
  document.getElementById('m').onclick = () => { qtd = Math.max(1, qtd - 1); document.getElementById('qv').textContent = qtd; };
  document.getElementById('pl').onclick = () => { qtd = Math.min(20, qtd + 1); document.getElementById('qv').textContent = qtd; };
  document.getElementById('add').onclick = () => { addToCart(p.id, tam, qtd); document.getElementById('msg').textContent = `✔ Adicionado: ${p.nome} (${tam}) x${qtd}`; };
}

function initCarrinho() {
  const box = document.getElementById('cartItems'); if (!box) return;
  const cep = document.getElementById('cep'), txt = document.getElementById('freteTxt');
  const draw = () => {
    const c = getCart();
    box.innerHTML = c.length ? c.map((i, k) => { const p = prod(i.id); return `<div class="cart-row"><div class="cp">${img(p)}<b>${p.nome} (${i.tam})</b></div>
      <div class="qty"><button data-a="-" data-k="${k}">-</button><span>${i.qtd}</span><button data-a="+" data-k="${k}">+</button></div>
      <div class="cv">${fmt(p.preco)}</div><div class="cv">${fmt(p.preco * i.qtd)}</div><button class="rm" data-k="${k}" aria-label="Remover">✕</button></div>`; }).join('')
      : '<p class="vazio">Seu carrinho está vazio. <a href="index.html"><b>Continuar comprando</b></a></p>';
    totais();
  };
  box.onclick = e => {
    const k = e.target.dataset.k; if (k === undefined) return;
    const c = getCart();
    if (e.target.classList.contains('rm')) c.splice(k, 1);
    else if (e.target.dataset.a === '+') c[k].qtd = Math.min(20, c[k].qtd + 1);
    else c[k].qtd = Math.max(1, c[k].qtd - 1);
    saveCart(c); draw();
  };
  document.getElementById('calc').onclick = () => {
    const f = calcFrete(cep.value);
    if (f === null) { txt.textContent = 'CEP inválido. Use 8 números.'; return; }
    localStorage.setItem(FK, f); txt.textContent = f ? `Frete: ${fmt(f)}` : 'Frete grátis!'; totais();
  };
  document.getElementById('go').onclick = e => { if (!getCart().length) e.preventDefault(); };
  draw();
}

function initCheckout() {
  const form = document.getElementById('coForm'); if (!form) return;
  const c = getCart();
  document.getElementById('resumo').innerHTML = c.length ? c.map(i => { const p = prod(i.id); return `<div class="res-row"><span>${p.nome} (${i.tam}) x${i.qtd}</span><b>${fmt(p.preco * i.qtd)}</b></div>`; }).join('') : '<p>Carrinho vazio.</p>';
  totais();
  const u = JSON.parse(localStorage.getItem('scarface_user') || 'null');
  if (u) ['nome', 'email', 'cpf', 'tel'].forEach(k => form.querySelector('#' + k).value = u[k] || '');
  const info = { pix: 'Pagamento via PIX: o QR Code seria gerado após a confirmação.', cartao: 'Cartão: os dados seriam informados em ambiente seguro do gateway.', boleto: 'Boleto: seria gerado após a confirmação, com vencimento em 3 dias.' };
  const showInfo = () => document.getElementById('payInfo').textContent = info[form.pg.value];
  form.querySelectorAll('[name=pg]').forEach(r => r.onchange = showInfo); showInfo();
  const cepc = document.getElementById('cepc');
  cepc.onblur = async () => {
    const d = cepc.value.replace(/\D/g, ''); if (d.length !== 8) return;
    try {
      const r = await (await fetch(`https://viacep.com.br/ws/${d}/json/`)).json();
      if (!r.erro) { form.querySelector('#rua').value = r.logradouro; form.querySelector('#cidade').value = r.localidade; form.querySelector('#uf').value = r.uf; }
    } catch (e) { /* sem internet: preencher manualmente */ }
  };
  document.getElementById('finalizar').onclick = () => {
    const err = document.getElementById('coErro');
    if (!c.length) { err.textContent = 'Seu carrinho está vazio.'; return; }
    const falta = [...form.querySelectorAll('[required]')].find(i => !i.value.trim());
    if (falta) { err.textContent = 'Preencha todos os campos obrigatórios.'; falta.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.querySelector('#email').value)) { err.textContent = 'Email inválido.'; return; }
    localStorage.removeItem(CK); localStorage.removeItem(FK); updateBadge();
    document.querySelector('.checkout').innerHTML = '<div class="sucesso"><h2>Pedido realizado! ✔</h2><p>Obrigado por comprar na SCARFACE. (Demonstração, nenhum pagamento real foi feito.)</p><a class="btn black" href="index.html">VOLTAR À LOJA</a></div>';
  };
}

document.addEventListener('DOMContentLoaded', () => { initProduto(); initCarrinho(); initCheckout(); });
