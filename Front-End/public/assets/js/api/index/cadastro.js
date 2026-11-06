import { enviarJson } from '../requisicao.js';

export async function cadastrar({ nome, senha }, { signal } = {}) {
  await enviarJson('/usuarios/cadastrar', { nome, senha }, {
    400: 'Confira os dados do cadastro.',
    403: 'Não foi possível realizar o cadastro.',
    409: 'Este nome de usuário já está em uso.',
    429: 'Muitas tentativas. Aguarde antes de tentar novamente.',
  }, signal);
  // O backend responde 204: não há JSON nem token no cadastro.
}
