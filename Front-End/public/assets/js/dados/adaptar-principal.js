function exigirLista(valor) {
  if (!Array.isArray(valor)) throw new Error('A API retornou uma lista inválida. Tente carregar novamente.');
  return valor;
}
function exigirTexto(valor) {
  if (typeof valor !== 'string' || !valor.trim()) throw new Error('A API retornou dados incompletos. Tente carregar novamente.');
  return valor;
}

export function adaptarGrupo(item) {
  if (!item || typeof item !== 'object') throw new Error('A API retornou um grupo inválido.');
  const grupo = { id: exigirTexto(item.id_do_grupo), nome: exigirTexto(item.nome_do_grupo), tag: item.tag_do_grupo || item.tag || '', membros: [] };
  if (item.usuarios !== undefined) {
    grupo.membros = exigirLista(item.usuarios).map(usuario => exigirTexto(usuario.nome));
    grupo.totalIntegrantes = grupo.membros.length;
  }
  return grupo;
}
export function adaptarGrupos(lista) {
  return exigirLista(lista).map(adaptarGrupo);
}
export function adaptarTreinos(lista) {
  return exigirLista(lista).map(item => ({
    id: exigirTexto(item.id_treino), nome: exigirTexto(item.nome_treino), grupoId: null,
    modalidade: typeof item.modalidade === 'string' ? item.modalidade : null,
    exercicios: exigirLista(item.exerciciosIndividuaisList).map(exercicio => ({ nome: exigirTexto(exercicio.nome) })),
  }));
}
export function adaptarExercicios(lista) {
  return exigirLista(lista).map(item => {
    const detalhes = [];
    if (item.serie !== null && item.serie !== undefined) detalhes.push(`${item.serie} séries`);
    if (item.repeticoes !== null && item.repeticoes !== undefined) detalhes.push(`${item.repeticoes} repetições`);
    if (item.carga !== null && item.carga !== undefined) detalhes.push(`${item.carga} kg`);
    return { nome: exigirTexto(item.nome), orientacao: detalhes.join(' · ') };
  });
}
