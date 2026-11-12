import { obterEstadoPrincipal } from './estado-principal.js';
import { criarEtiquetaModalidade, obterModalidade } from './modalidades.js';
import { preencherAvatares } from '../compartilhado/avatar-iniciais.js';
import { linkGrupo, linkTreino } from '../compartilhado/rotas.js';

function criarAvatares(nomes) {
  return nomes.slice(0, 3).map((nome, indice) => {
    const avatar = document.createElement('span');
    avatar.className = `avatar ${['lilas', 'areia', 'verde'][indice]}`;
    avatar.dataset.avatarNome = nome;
    return avatar;
  });
}

// A visão geral mostra só os primeiros itens; o restante fica nas telas próprias.
const LIMITE_VISAO_GERAL = 2;

function plural(total, singular, plural) {
  return `${total} ${total === 1 ? singular : plural}`;
}

export function descreverIntegrantes(grupo) {
  return Number.isInteger(grupo.totalIntegrantes) ? plural(grupo.totalIntegrantes, 'integrante', 'integrantes') : '';
}

export function renderizarPrincipal(dados) {
  const { grupos, treinos } = dados;
  const estado = obterEstadoPrincipal(dados);
  const nome = dados.usuario?.nome || '';
  document.querySelector('.perfil').dataset.avatarNome = nome || 'Usuário';
  document.querySelector('#total-grupos').textContent = String(estado.totalGrupos);
  document.querySelector('#total-treinos').textContent = String(estado.totalTreinos);
  document.querySelector('#titulo-principal').textContent = nome ? `Olá, ${nome}` : 'Olá';
  document.querySelector('#descricao-principal').textContent = estado.semAtividades
    ? 'Você ainda não tem grupos nem treinos.'
    : `Você tem ${plural(estado.totalGrupos, 'grupo', 'grupos')} e ${plural(estado.totalTreinos, 'treino', 'treinos')}.`;

  document.querySelector('#treino-em-destaque').hidden = !estado.temTreinos;
  document.querySelector('#convite-primeiro-treino').hidden = estado.temTreinos;
  document.querySelector('#titulo-convite-treino').textContent = 'Crie seu primeiro treino';
  document.querySelector('#descricao-convite-treino').textContent =
    'Dê um nome, adicione os exercícios e ele aparece aqui.';

  if (estado.treinoDestaque) {
    const treino = estado.treinoDestaque;
    const grupo = grupos.find(item => item.id === treino.grupoId);
    document.querySelector('#contexto-destaque').textContent = grupo?.nome || (treino.grupoId ? 'TREINO EM GRUPO' : 'TREINO INDIVIDUAL');
    document.querySelector('#nome-treino-destaque').textContent = treino.nome;
    document.querySelector('#modalidade-destaque').replaceChildren(...(treino.modalidade ? [criarEtiquetaModalidade(treino.modalidade)] : []));
    document.querySelector('#detalhes-destaque').textContent = treino.exercicios.length
      ? plural(treino.exercicios.length, 'exercício', 'exercícios') : 'Sem exercícios';
    document.querySelector('#abrir-treino-destaque').href = linkTreino(treino.id);
    const participantes = document.querySelector('#participantes-destaque');
    participantes.hidden = !grupo?.membros?.length;
    participantes.querySelector('.avatares').replaceChildren(...criarAvatares(grupo?.membros || []));
    participantes.querySelector('p').textContent = grupo ? `${descreverIntegrantes(grupo)} na sua comunidade.` : '';
  }

  const grade = document.querySelector('.grade-grupos');
  grade.replaceChildren();
  document.querySelector('#contagem-grupos').textContent = estado.temGrupos ? plural(estado.totalGrupos, 'grupo', 'grupos') : '';
  document.querySelector('#rodape-grupos').hidden = !estado.temGrupos;
  document.querySelector('#estado-sem-grupos').hidden = estado.temGrupos;
  grade.hidden = !estado.temGrupos;

  grupos.slice(0, LIMITE_VISAO_GERAL).forEach(grupo => {
    const fragmento = document.querySelector('#modelo-grupo').content.cloneNode(true);
    const cartao = fragmento.querySelector('article');
    cartao.querySelector('h3').textContent = grupo.nome;
    cartao.querySelector('.descricao-grupo').textContent = grupo.descricao || '';
    cartao.querySelector('.descricao-grupo').hidden = !grupo.descricao;
    const tag = cartao.querySelector('.tag-grupo');
    tag.textContent = grupo.tag ? `#${grupo.tag}` : '';
    tag.hidden = !grupo.tag;
    const integrantes = cartao.querySelector('.total-integrantes');
    integrantes.textContent = descreverIntegrantes(grupo);
    integrantes.hidden = !integrantes.textContent;
    const modalidades = [...new Set(treinos.filter(treino => treino.grupoId === grupo.id).map(treino => treino.modalidade))];
    const etiquetas = cartao.querySelector('.modalidades-grupo');
    etiquetas.replaceChildren(...modalidades.map(criarEtiquetaModalidade));
    // A listagem atual retorna treinos individuais, não os treinos de cada grupo.
    if (!modalidades.length) etiquetas.hidden = true;
    cartao.querySelector('.avatares').replaceChildren(...criarAvatares(grupo.membros || []));
    const link = cartao.querySelector('[data-grupo]');
    link.href = linkGrupo(grupo.id);
    link.setAttribute('aria-label', `Abrir grupo ${grupo.nome}`);
    link.innerHTML = '<svg class="icone-seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
    grade.append(fragmento);
  });

  const gradeTreinos = document.querySelector('.grade-treinos');
  gradeTreinos.replaceChildren();
  gradeTreinos.hidden = !estado.temTreinos;
  document.querySelector('#estado-sem-treinos').hidden = estado.temTreinos;
  document.querySelector('#contagem-treinos').textContent = estado.temTreinos ? plural(estado.totalTreinos, 'treino', 'treinos') : '';
  document.querySelector('#rodape-treinos').hidden = !estado.temTreinos;
  treinos.slice(0, LIMITE_VISAO_GERAL).forEach(treino => {
    const fragmento = document.querySelector('#modelo-treino').content.cloneNode(true);
    const cartao = fragmento.querySelector('article');
    cartao.querySelector('h3').textContent = treino.nome;
    if (treino.modalidade) cartao.querySelector('.modalidade-treino').append(criarEtiquetaModalidade(treino.modalidade));
    else cartao.querySelector('.modalidade-treino').hidden = true;
    const grupo = grupos.find(item => item.id === treino.grupoId);
    cartao.querySelector('.origem-treino').textContent = grupo?.nome || (treino.grupoId ? 'Treino em grupo' : 'Treino individual');
    cartao.querySelector('.quantidade-exercicios').textContent = treino.exercicios.length
      ? plural(treino.exercicios.length, 'exercício', 'exercícios') : 'Sem exercícios';
    const link = cartao.querySelector('[data-treino]');
    link.href = linkTreino(treino.id);
    link.setAttribute('aria-label', `Ver treino ${treino.nome} — ${obterModalidade(treino.modalidade).nome}`);
    gradeTreinos.append(fragmento);
  });
  preencherAvatares();
}
