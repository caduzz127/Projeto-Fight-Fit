import { requisitarJson } from '../requisicao.js';

// Não há rota para listar todos os exercícios de um grupo: a busca por nome usa
// ILIKE '%nome%', então '%' devolve todos. Trocar quando existir GET /exercicio-grupo/buscar/{id_grupo}.
export function listarExerciciosGrupo(idGrupo, { signal } = {}) {
  return requisitarJson(`/exercicio-grupo/buscar/${encodeURIComponent(idGrupo)}/${encodeURIComponent('%')}`, {
    signal, mensagens: { 400: 'Não foi possível carregar os exercícios do grupo.' },
  });
}
