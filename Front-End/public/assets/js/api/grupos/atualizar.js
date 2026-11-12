import { requisitarJson } from '../requisicao.js';

export function atualizarGrupo({ idGrupo, nome, senhaAntiga, senhaNova }, { signal } = {}) {
  return requisitarJson('/grupos/atualizar', {
    metodo: 'PUT', signal, dados: { id_grupo: idGrupo, nome, senhaAntiga, senhaNova },
    mensagens: { 400: 'Não foi possível salvar o grupo.', 403: 'Só administradores podem editar o grupo.' },
    detalhes: [['senha antiga incorreta', 'Senha atual do grupo incorreta.']],
  });
}
