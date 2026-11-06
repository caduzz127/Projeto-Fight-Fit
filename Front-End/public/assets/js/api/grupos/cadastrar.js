import { requisitarJson } from '../requisicao.js';

export function cadastrarGrupo({ nome, senha }, { signal } = {}) {
  return requisitarJson('/grupos/cadastrar', { metodo: 'POST', dados: { nome, senha }, signal, mensagens: { 400: 'Não foi possível criar o grupo. Confira o nome e a senha.' } });
}
