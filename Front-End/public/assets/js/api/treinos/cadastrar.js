import { requisitarJson } from '../requisicao.js';

export function cadastrarTreino(nome, { signal } = {}) {
  return requisitarJson(`/treinos/cadastrar/${encodeURIComponent(nome)}`, { metodo: 'POST', signal, mensagens: { 400: 'Não foi possível criar o treino. Confira o nome.' } });
}
