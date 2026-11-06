import { obterEstadoPrincipal } from './estado-principal.js';
import { criarEtiquetaModalidade, obterModalidade } from './modalidades.js';
import { preencherAvatares } from './avatar-iniciais.js';

function criarAvatares(nomes) {
  return nomes.slice(0, 3).map((nome, indice) => {
    const avatar = document.createElement('span');
    avatar.className = `avatar ${['lilas', 'areia', 'verde'][indice]}`;
    avatar.dataset.avatarNome = nome;
    return avatar;
  });
}

export function descreverIntegrantes(grupo) {
  return Number.isInteger(grupo.totalIntegrantes)
    ? `${grupo.totalIntegrantes} ${grupo.totalIntegrantes === 1 ? 'integrante' : 'integrantes'}`
    : 'Integrantes não informados';
}

export function renderizarPrincipal(dados) {
  const { grupos, treinos } = dados;
  const estado = obterEstadoPrincipal(dados);
  const nome = dados.usuario?.nome || 'Atleta';
  document.querySelector('.perfil').dataset.avatarNome = nome;
  document.querySelector('#total-grupos').textContent = String(estado.totalGrupos).padStart(2, '0');
  document.querySelector('#total-treinos').textContent = String(estado.totalTreinos).padStart(2, '0');
  document.querySelector('#etapa-boas-vindas').textContent = estado.semAtividades
    ? 'SEU PRIMEIRO PASSO COMEÇA AQUI' : 'BOM TER VOCÊ POR AQUI';
  document.querySelector('#titulo-principal').textContent = estado.semAtividades
    ? 'Bem-vindo à sua próxima versão.' : 'Vamos mais longe, juntos.';
  document.querySelector('#descricao-principal').textContent = estado.semAtividades
    ? 'Encontre sua turma, crie novas conexões e comece no seu ritmo.'
    : 'Seus grupos e treinos, em um só lugar. Um passo de cada vez.';
  document.querySelector('#destaque-linha-1').textContent = estado.semAtividades ? 'COMECE NO' : 'SEU PRÓXIMO';
  document.querySelector('#destaque-linha-2').textContent = estado.semAtividades ? 'SEU RITMO.' : 'NÍVEL É';
  document.querySelector('#destaque-enfase').textContent = estado.semAtividades ? 'EVOLUA JUNTO.' : 'COLETIVO.';

  document.querySelector('#treino-em-destaque').hidden = !estado.temTreinos;
  document.querySelector('#convite-primeiro-treino').hidden = estado.temTreinos;
  document.querySelector('#titulo-convite-treino').textContent = estado.temGrupos
    ? 'Sua turma está aqui. Vamos treinar?' : 'Seu primeiro treino. Um novo começo.';
  document.querySelector('#descricao-convite-treino').textContent = estado.temGrupos
    ? 'Você já tem companhia. Crie o primeiro treino ou combine os próximos passos com seu grupo.'
    : 'Comece com um treino no seu ritmo. Você pode treinar sozinho ou encontrar uma comunidade.';

  if (estado.treinoDestaque) {
    const treino = estado.treinoDestaque;
    const grupo = grupos.find(item => item.id === treino.grupoId);
    document.querySelector('#contexto-destaque').textContent = grupo?.nome || (treino.grupoId ? 'TREINO EM GRUPO' : 'TREINO INDIVIDUAL');
    document.querySelector('#nome-treino-destaque').textContent = treino.nome;
    document.querySelector('#modalidade-destaque').replaceChildren(criarEtiquetaModalidade(treino.modalidade));
    document.querySelector('#detalhes-destaque').textContent = `${treino.exercicios.length} exercícios disponíveis`;
    document.querySelector('#abrir-treino-destaque').dataset.treino = treino.id;
    const participantes = document.querySelector('#participantes-destaque');
    participantes.hidden = !grupo?.membros?.length;
    participantes.querySelector('.avatares').replaceChildren(...criarAvatares(grupo?.membros || []));
    participantes.querySelector('p').textContent = grupo ? `${descreverIntegrantes(grupo)} na sua comunidade.` : '';
  }

  const grade = document.querySelector('.grade-grupos');
  grade.replaceChildren();
  document.querySelector('#filtro-grupos').hidden = !estado.temGrupos;
  document.querySelector('#estado-sem-grupos').hidden = estado.temGrupos;
  grade.hidden = !estado.temGrupos;
  document.querySelector('#titulo-grupos').textContent = estado.temGrupos
    ? 'Sua turma, sua motivação.' : 'Vamos encontrar sua turma?';

  grupos.forEach(grupo => {
    const fragmento = document.querySelector('#modelo-grupo').content.cloneNode(true);
    const cartao = fragmento.querySelector('article');
    cartao.querySelector('h3').textContent = grupo.nome;
    cartao.querySelector('.descricao-grupo').textContent = grupo.descricao || 'Seu espaço para evoluir em comunidade.';
    const tag = cartao.querySelector('.tag-grupo');
    tag.textContent = grupo.tag ? `#${grupo.tag}` : '';
    tag.hidden = !grupo.tag;
    cartao.querySelector('.total-integrantes').textContent = descreverIntegrantes(grupo);
    const modalidades = [...new Set(treinos.filter(treino => treino.grupoId === grupo.id).map(treino => treino.modalidade))];
    const etiquetas = cartao.querySelector('.modalidades-grupo');
    etiquetas.replaceChildren(...modalidades.map(criarEtiquetaModalidade));
    if (!modalidades.length) etiquetas.textContent = 'Ainda sem treinos';
    cartao.querySelector('.avatares').replaceChildren(...criarAvatares(grupo.membros || []));
    const botao = cartao.querySelector('[data-grupo]');
    botao.dataset.grupo = grupo.id;
    botao.setAttribute('aria-label', `Abrir grupo ${grupo.nome}`);
    botao.innerHTML = '<svg class="icone-seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
    grade.append(fragmento);
  });

  const gradeTreinos = document.querySelector('.grade-treinos');
  gradeTreinos.replaceChildren();
  gradeTreinos.hidden = !estado.temTreinos;
  document.querySelector('#estado-sem-treinos').hidden = estado.temTreinos;
  treinos.forEach(treino => {
    const fragmento = document.querySelector('#modelo-treino').content.cloneNode(true);
    const cartao = fragmento.querySelector('article');
    cartao.querySelector('h3').textContent = treino.nome;
    cartao.querySelector('.modalidade-treino').append(criarEtiquetaModalidade(treino.modalidade));
    const grupo = grupos.find(item => item.id === treino.grupoId);
    cartao.querySelector('.origem-treino').textContent = grupo?.nome || (treino.grupoId ? 'Treino em grupo' : 'Treino individual');
    cartao.querySelector('.quantidade-exercicios').textContent = treino.exercicios.length
      ? `${treino.exercicios.length} exercícios` : 'Ainda sem exercícios';
    const botao = cartao.querySelector('[data-treino]');
    botao.dataset.treino = treino.id;
    botao.setAttribute('aria-label', `Ver treino ${treino.nome} — ${obterModalidade(treino.modalidade).nome}`);
    gradeTreinos.append(fragmento);
  });
  preencherAvatares();
  grade.dispatchEvent(new Event('gruposatualizados'));
}
