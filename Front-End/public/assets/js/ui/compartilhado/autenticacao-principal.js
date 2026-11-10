import { obterSessao, definirSessao } from '../../api/sessao.js';

export function voltarAoLogin() {
  definirSessao(null);
  location.replace('index.html?motivo=sessao');
}
export function tratarSessaoExpirada(erro) {
  if (erro.status !== 401) return false;
  voltarAoLogin();
  return true;
}
export function iniciarAutenticacaoPrincipal() {
  if (!obterSessao()) {
    voltarAoLogin();
    return false;
  }
  document.querySelector('#sair').addEventListener('click', () => {
    definirSessao(null);
    location.replace('index.html');
  });
  return true;
}
