import { requisitarJson } from '../requisicao.js';

export function listarTreinos({ signal } = {}) {
  return requisitarJson('/treinos/buscar-pelo-usuario', { signal });
}
