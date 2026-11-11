import { requisitarJson } from '../requisicao.js';

// O back-end identifica a conta pelo username atual e confirma com a senha atual.
export function atualizarUsuario({ username, usernameNovo, senhaAntiga, senhaNova }, { signal } = {}) {
  return requisitarJson('/usuarios/atualizar', {
    metodo: 'PUT', signal, dados: { username, usernameNovo, senhaAntiga, senhaNova },
    mensagens: { 400: 'Não foi possível salvar as alterações.', 404: 'Senha atual incorreta.' },
    detalhes: [['já existe um usuário', 'Este nome de usuário já está em uso.'], ['senha incorreta', 'Senha atual incorreta.']],
  });
}
