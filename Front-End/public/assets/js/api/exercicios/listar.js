import { requisitarJson } from '../requisicao.js';

export function listarExerciciosTreino(idTreino, { signal } = {}) {
  return requisitarJson(`/exercicios-individuais/buscar-por-treino/${encodeURIComponent(idTreino)}`, {
    signal, mensagens: { 404: 'Este treino não existe mais.' },
  });
}
