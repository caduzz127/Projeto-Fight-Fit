import { requisitarJson } from '../requisicao.js';
import { obterIdUsuario } from '../sessao.js';

export function listarGrupos({ signal } = {}) {
  return requisitarJson(`/grupos/buscar-pelo-usuario/${encodeURIComponent(obterIdUsuario())}`, { signal });
}
