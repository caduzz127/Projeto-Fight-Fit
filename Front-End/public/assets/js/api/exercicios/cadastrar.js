import { requisitarJson } from '../requisicao.js';

export function cadastrarExercicio({ idTreino, nome, carga, repeticoes, serie }, { signal } = {}) {
  return requisitarJson('/exercicios-individuais/cadastrar', {
    metodo: 'POST', signal,
    dados: { id_treino: idTreino, nome, carga, repeticoes, serie },
    mensagens: { 400: 'Não foi possível adicionar o exercício. Confira os campos.', 404: 'Este treino não existe mais.' },
  });
}
