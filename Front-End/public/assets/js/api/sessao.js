const CHAVE_SESSAO = 'fightfit.sessao';
let sessao = null;

function claimsDoToken(token) {
  try {
    const parte = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(parte.padEnd(Math.ceil(parte.length / 4) * 4, '=')), caractere => caractere.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return {};
  }
}

export function definirSessao(usuario) {
  sessao = usuario ? { username: usuario.username, token: usuario.token } : null;
  try {
    if (sessao) globalThis.sessionStorage?.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    else globalThis.sessionStorage?.removeItem(CHAVE_SESSAO);
  } catch {
    sessao = null;
    if (usuario) throw new Error('O navegador não permitiu guardar a sessão nesta aba. Verifique suas configurações de privacidade.');
  }
}

export function obterSessao() {
  try {
    if (globalThis.sessionStorage) {
      const texto = globalThis.sessionStorage.getItem(CHAVE_SESSAO);
      sessao = texto ? JSON.parse(texto) : null;
    }
  } catch { sessao = null; }
  if (sessao && (typeof sessao.token !== 'string' || !sessao.token || typeof sessao.username !== 'string')) {
    definirSessao(null);
  }
  const expira = sessao ? claimsDoToken(sessao.token).exp : null;
  if (typeof expira === 'number' && expira * 1000 <= Date.now()) definirSessao(null);
  return sessao ? { ...sessao } : null;
}

export function obterIdUsuario() {
  const atual = obterSessao();
  const id = atual ? claimsDoToken(atual.token).sub : null;
  if (typeof id !== 'string' || !id.trim()) {
    definirSessao(null);
    const erro = new Error('Sua sessão expirou. Entre novamente.');
    erro.status = 401;
    throw erro;
  }
  // O backend valida a assinatura e as permissões. Aqui só lemos o ID para a URL.
  return id;
}

export function obterCargo() {
  const atual = obterSessao();
  return atual ? claimsDoToken(atual.token).roles || null : null;
}
