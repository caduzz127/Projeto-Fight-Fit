import { requisitarJson } from '../requisicao.js';

export function atualizarExercicio({ id, idTreino, nome, carga, repeticoes, serie }, { signal } = {}) {
  return requisitarJson('/exercicios-individuais/atualizar', {
    metodo: 'PUT', signal,
    dados: { id, id_treino: idTreino, nome, carga, repeticoes, serie },
    mensagens: { 400: 'Não foi possível salvar o exercício. Confira os campos.', 404: 'Este exercício não existe mais.' },
  });
}
