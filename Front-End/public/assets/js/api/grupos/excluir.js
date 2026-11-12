import { requisitarJson } from '../requisicao.js';

export function excluirGrupo({ idGrupo, senha }, { signal } = {}) {
  return requisitarJson('/grupos/deletar', {
    metodo: 'DELETE', signal, dados: { id_grupo: idGrupo, senha },
    mensagens: { 400: 'Não foi possível excluir o grupo.', 403: 'Só o dono do grupo pode excluí-lo.' },
    detalhes: [['senha incorreta', 'Senha do grupo incorreta.']],
  });
}
