import { requisitarJson } from '../requisicao.js';

export function deletarTreino(id, { signal } = {}) {
  return requisitarJson(`/treinos/deletar/${encodeURIComponent(id)}`, {
    metodo: 'DELETE', signal,
    mensagens: { 400: 'Não foi possível excluir o treino.', 404: 'Este treino já foi excluído.' },
  });
}
