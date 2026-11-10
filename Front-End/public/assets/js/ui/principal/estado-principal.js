// Grupos e treinos são independentes. Nenhuma regra depende de nomes ou IDs fixos.
export function obterEstadoPrincipal({ grupos = [], treinos = [] }) {
  return {
    temGrupos: grupos.length > 0,
    temTreinos: treinos.length > 0,
    semAtividades: grupos.length === 0 && treinos.length === 0,
    totalGrupos: grupos.length,
    totalTreinos: treinos.length,
    treinoDestaque: treinos[0] || null,
  };
}
