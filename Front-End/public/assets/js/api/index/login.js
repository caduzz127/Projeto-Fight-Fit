import { enviarJson } from '../requisicao.js';

export async function login({ username, senha }, { signal } = {}) {
  const usuario = await enviarJson('/usuarios/login', { username, senha }, {
    400: 'Não foi possível entrar. Confira o usuário e a senha.',
    401: 'Usuário ou senha inválidos.',
    403: 'Acesso não autorizado.',
    429: 'Muitas tentativas. Aguarde antes de tentar novamente.',
  }, signal);

  if (typeof usuario?.token !== 'string' || !usuario.token.trim()
    || typeof usuario.username !== 'string') {
    throw new Error('O servidor não retornou os dados necessários para entrar.');
  }
  return { username: usuario.username, token: usuario.token };
}
