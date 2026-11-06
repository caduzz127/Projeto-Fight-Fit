import { requisitarJson } from '../requisicao.js';

export function entrarGrupo({ id_grupo, tag_grupo, senha }, { signal } = {}) {
  return requisitarJson('/grupos/entrar', { metodo: 'POST', dados: { id_grupo, tag_grupo, senha }, signal, mensagens: { 400: 'Não foi possível entrar no grupo. Confira a senha.' } });
}
