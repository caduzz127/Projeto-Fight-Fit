import { requisitarJson } from '../requisicao.js';

// Devolve o exercício do grupo com todos os participantes e suas marcas.
export function buscarRanking(idExercicio, { signal } = {}) {
  return requisitarJson(`/participantes/buscar/${encodeURIComponent(idExercicio)}`, {
    signal, mensagens: { 400: 'Este exercício não existe mais.' },
  });
}
