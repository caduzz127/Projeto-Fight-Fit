import { requisitarJson } from '../requisicao.js';

export function atualizarTreino({ id, nome }, { signal } = {}) {
  return requisitarJson('/treinos/atualizar', {
    metodo: 'PUT', signal, dados: { id, nome },
    mensagens: { 400: 'Não foi possível renomear o treino. Confira o nome.', 404: 'Este treino não existe mais.' },
  });
}
