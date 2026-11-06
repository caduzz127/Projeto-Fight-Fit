import { requisitarJson } from '../requisicao.js';

export function listarExerciciosTreino(id, { signal } = {}) {
  return requisitarJson(`/exercicios-individuais/buscar-por-treino/${encodeURIComponent(id)}`, { signal });
}
