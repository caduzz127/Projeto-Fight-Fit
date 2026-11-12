// Carga decide a posição; repetições e depois séries desempatam.
export function compararMarcas(a, b) {
  return b.carga - a.carga || b.repeticoes - a.repeticoes || b.serie - a.serie;
}

// Ordena os participantes e calcula a posição de cada um. Quem empata em carga,
// repetições e séries divide a posição (1º, 1º, 3º). percentual é a carga em relação
// à do líder, usado nas barras.
export function montarRanking(participantes) {
  const ordenados = [...participantes].sort((a, b) => compararMarcas(a, b) || a.nome.localeCompare(b.nome, 'pt-BR'));
  const cargaLider = ordenados[0]?.carga || 0;
  let posicao = 0;
  return ordenados.map((participante, indice) => {
    if (indice === 0 || compararMarcas(ordenados[indice - 1], participante) !== 0) posicao = indice + 1;
    const percentual = cargaLider > 0 ? Math.round((participante.carga / cargaLider) * 100) : 0;
    return { ...participante, posicao, percentual };
  });
}
