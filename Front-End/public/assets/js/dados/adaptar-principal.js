function exigirLista(valor) {
  if (!Array.isArray(valor)) throw new Error('A API retornou uma lista inválida. Tente carregar novamente.');
  return valor;
}
function exigirTexto(valor) {
  if (typeof valor !== 'string' || !valor.trim()) throw new Error('A API retornou dados incompletos. Tente carregar novamente.');
  return valor;
}

export const CARGO_DONO_GRUPO = 'SYSTEM_ROOT_GROUP_ADMIN';
export const CARGOS_ADMIN_GRUPO = [CARGO_DONO_GRUPO, 'SYSTEM_GROUP_ADMIN'];

export function adaptarGrupo(item) {
  if (!item || typeof item !== 'object') throw new Error('A API retornou um grupo inválido.');
  const grupo = { id: exigirTexto(item.id_do_grupo), nome: exigirTexto(item.nome_do_grupo), tag: item.tag_do_grupo || item.tag || '', membros: [] };
  if (item.usuarios !== undefined) {
    grupo.usuarios = exigirLista(item.usuarios).map(usuario => ({ nome: exigirTexto(usuario.nome), cargo: usuario.cargo || '' }));
    grupo.membros = grupo.usuarios.map(usuario => usuario.nome);
    grupo.totalIntegrantes = grupo.membros.length;
    grupo.dono = grupo.usuarios.find(usuario => usuario.cargo === CARGO_DONO_GRUPO)?.nome || null;
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
function exigirNumero(valor) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) throw new Error('A API retornou dados incompletos. Tente carregar novamente.');
  return valor;
}
export function adaptarTreino(item) {
  if (!item || typeof item !== 'object') throw new Error('A API retornou um treino inválido.');
  return { id: exigirTexto(item.id_treino), nome: exigirTexto(item.nome_treino) };
}
export function adaptarExercicio(item) {
  if (!item || typeof item !== 'object') throw new Error('A API retornou um exercício inválido.');
  return {
    id: exigirTexto(item.id), idTreino: exigirTexto(item.id_treino), nome: exigirTexto(item.nome),
    carga: exigirNumero(item.carga), repeticoes: exigirNumero(item.repeticoes), serie: exigirNumero(item.serie),
  };
}
// O back-end passa a enviar nome_treino em cada exercício. Lista vazia não traz nome.
export function obterNomeTreino(lista) {
  const nome = exigirLista(lista)[0]?.nome_treino;
  return typeof nome === 'string' && nome.trim() ? nome : null;
}
export function adaptarExercicios(lista) {
  return exigirLista(lista).map(adaptarExercicio);
}

export function adaptarParticipante(item) {
  if (!item || typeof item !== 'object') throw new Error('A API retornou um participante inválido.');
  return {
    id: exigirTexto(item.id_usuario), nome: exigirTexto(item.nome_usuario),
    carga: exigirNumero(item.carga), repeticoes: exigirNumero(item.repeticoes), serie: exigirNumero(item.serie),
  };
}
export function adaptarExercicioGrupo(item) {
  if (!item || typeof item !== 'object') throw new Error('A API retornou um exercício de grupo inválido.');
  return {
    id: exigirTexto(item.id_exercicio_grupo), nome: exigirTexto(item.nome_exercicio_grupo),
    idGrupo: exigirTexto(item.id_grupo),
    modalidade: typeof item.modalidade === 'string' ? item.modalidade : null,
    participantes: exigirLista(item.usuarios).map(adaptarParticipante),
  };
}
export function adaptarExerciciosGrupo(lista) {
  return exigirLista(lista).map(adaptarExercicioGrupo);
}
