import { requisitarJson } from '../requisicao.js';

export function sairGrupo(idGrupo, { signal } = {}) {
  return requisitarJson(`/grupos/sair/${encodeURIComponent(idGrupo)}`, {
    metodo: 'DELETE', signal, mensagens: { 400: 'Não foi possível sair do grupo.' },
  });
}
