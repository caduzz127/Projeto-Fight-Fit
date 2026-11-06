import { requisitarJson } from '../requisicao.js';

export function detalharGrupo(id, { signal } = {}) {
  return requisitarJson(`/grupos/buscar-pelo-id/${encodeURIComponent(id)}`, { signal });
}
