import { requisitarJson } from '../requisicao.js';

// A conta é identificada pelo token. username é o nome desejado (pode ser o mesmo);
// senhaAntiga confirma a identidade; senhaNova vazia mantém a senha atual.
export function atualizarUsuario({ username, senhaAntiga, senhaNova = '' }, { signal } = {}) {
  return requisitarJson('/usuarios/atualizar', {
    metodo: 'PUT', signal, dados: { username, senhaAntiga, senhaNova },
    mensagens: { 400: 'Não foi possível salvar as alterações.', 404: 'Senha atual incorreta.' },
    detalhes: [['já existe um usuário', 'Este nome de usuário já está em uso.'], ['senha incorreta', 'Senha atual incorreta.']],
  });
}
