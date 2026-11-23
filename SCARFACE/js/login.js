// ATENÇÃO: usuários ficam no localStorage apenas para demonstração.
// Em produção, autenticação e senhas exigem um backend (hash de senha, sessão/JWT).
const US = 'scarface_users';
const users = () => JSON.parse(localStorage.getItem(US) || '[]');
const showErr = (f, m) => { f.querySelector('.erro').textContent = m; return false; };
const okEmail = e => /^\S+@\S+\.\S+$/.test(e);
function cpfValido(c) {
  c = c.replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (let t = 9; t < 11; t++) { let s = 0; for (let i = 0; i < t; i++) s += c[i] * (t + 1 - i); if (((s * 10) % 11) % 10 != c[t]) return false; }
  return true;
}
const mask = (el, fn) => el && el.addEventListener('input', () => el.value = fn(el.value.replace(/\D/g, '')));

document.addEventListener('DOMContentLoaded', () => {
  const lf = document.getElementById('loginForm');
  if (lf) {
    lf.onsubmit = e => {
      e.preventDefault();
      const em = lf.querySelector('#email').value.trim().toLowerCase(), se = lf.querySelector('#senha').value;
      if (!okEmail(em)) return showErr(lf, 'Informe um email válido.');
      if (!se) return showErr(lf, 'Informe a senha.');
      const u = users().find(x => x.email === em && x.senha === se);
      if (!u) return showErr(lf, 'Email ou senha incorretos.');
      localStorage.setItem('scarface_user', JSON.stringify(u)); location.href = 'index.html';
    };
    document.getElementById('esqueci').onclick = e => { e.preventDefault(); showErr(lf, 'Recuperar senha exige backend (envio de email). Não disponível nesta versão.'); };
  }
  const cf = document.getElementById('cadForm');
  if (cf) {
    const g = id => cf.querySelector('#' + id);
    mask(g('cpf'), v => v.slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'));
    mask(g('tel'), v => v.slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2'));
    cf.onsubmit = e => {
      e.preventDefault();
      const d = { nome: g('nome').value.trim(), email: g('email').value.trim().toLowerCase(), senha: g('senha').value, cpf: g('cpf').value, tel: g('tel').value };
      if (d.nome.length < 3) return showErr(cf, 'Informe seu nome.');
      if (!okEmail(d.email)) return showErr(cf, 'Email inválido.');
      if (d.senha.length < 6) return showErr(cf, 'A senha deve ter ao menos 6 caracteres.');
      if (d.senha !== g('senha2').value) return showErr(cf, 'As senhas não coincidem.');
      if (!cpfValido(d.cpf)) return showErr(cf, 'CPF inválido.');
      if (d.tel.replace(/\D/g, '').length < 10) return showErr(cf, 'Telefone inválido.');
      if (users().some(u => u.email === d.email)) return showErr(cf, 'Este email já está cadastrado.');
      localStorage.setItem(US, JSON.stringify([...users(), d]));
      localStorage.setItem('scarface_user', JSON.stringify(d)); location.href = 'index.html';
    };
  }
});
