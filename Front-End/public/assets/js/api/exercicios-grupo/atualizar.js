import { requisitarJson } from '../requisicao.js';

export function atualizarExercicioGrupo({ id, idGrupo, nome }, { signal } = {}) {
  return requisitarJson('/exercicio-grupo/atualizar', {
    metodo: 'PUT', signal, dados: { id_exercicio_grupo: id, nome, id_grupo: idGrupo },
    mensagens: { 400: 'Não foi possível renomear o exercício.' },
    detalhes: [['não possui cargo', 'Só administradores do grupo podem editar exercícios.'], ['não pertence ao grupo', 'Você não participa deste grupo.']],
  });
}
