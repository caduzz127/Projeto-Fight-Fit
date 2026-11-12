// Endereços das telas, para que todas montem os links do mesmo jeito.
export function linkTreino(id) {
  return `treino_detalhes.html?id=${encodeURIComponent(id)}`;
}

export function linkGrupo(id) {
  return `grupo_detalhes.html?id=${encodeURIComponent(id)}`;
}

export function linkRanking(idExercicio) {
  return `grupo_ranking.html?id=${encodeURIComponent(idExercicio)}`;
}
