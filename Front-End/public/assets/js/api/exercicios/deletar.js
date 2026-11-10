import { requisitarJson } from '../requisicao.js';

export function deletarExercicio({ id, idTreino }, { signal } = {}) {
  return requisitarJson('/exercicios-individuais/deletar', {
    metodo: 'DELETE', signal, dados: { id, id_treino: idTreino },
    mensagens: { 400: 'Não foi possível excluir o exercício.', 404: 'Este exercício já foi excluído.' },
  });
}
