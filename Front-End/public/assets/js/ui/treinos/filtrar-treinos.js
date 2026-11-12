import { iniciarFiltroCartoes } from '../compartilhado/filtrar-cartoes.js';

// Pesquisa local nos treinos já carregados, pelo nome do treino.
export function iniciarFiltroTreinos(lista) {
  return iniciarFiltroCartoes({
    lista,
    area: document.querySelector('#filtro-treinos'),
    campo: document.querySelector('#buscar-treino'),
    resultado: document.querySelector('#resultado-busca'),
    vazio: document.querySelector('#busca-vazia'),
  });
}
