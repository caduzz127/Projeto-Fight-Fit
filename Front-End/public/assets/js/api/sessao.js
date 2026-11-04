// Sessão apenas em memória: desaparece ao recarregar a página.
let sessao = null;

export function definirSessao(usuario) {
  sessao = usuario ? { username: usuario.username, token: usuario.token } : null;
}

export function obterSessao() {
  return sessao ? { ...sessao } : null;
}
