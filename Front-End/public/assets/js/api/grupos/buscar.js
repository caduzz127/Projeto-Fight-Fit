import { requisitarJson } from '../requisicao.js';

export function buscarGrupos(nome, { signal } = {}) {
  return requisitarJson(`/grupos/buscar-pelo-nome/${encodeURIComponent(nome)}`, { signal });
}
