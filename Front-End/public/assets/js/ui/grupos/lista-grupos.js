import { obterModalidade } from '../principal/modalidades.js';
import { linkGrupo } from '../compartilhado/rotas.js';

const MAXIMO_MODALIDADES = 4;

function criarModalidade(exercicio) {
  const item = document.createElement('li');
  const icone = document.createElement('img');
  icone.src = `assets/images/icons/${obterModalidade(exercicio.modalidade).icone}`;
  icone.alt = '';
  const nome = document.createElement('span');
  nome.textContent = exercicio.nome;
  item.append(icone, nome);
  return item;
}

function criarCartao(grupo) {
  const fragmento = document.querySelector('#modelo-cartao-grupo').content.cloneNode(true);
  const cartao = fragmento.querySelector('article');
  const titulo = cartao.querySelector('h2');
  titulo.id = `grupo-${grupo.id}`;
  titulo.textContent = grupo.nome;
  cartao.setAttribute('aria-labelledby', titulo.id);
  const tag = cartao.querySelector('.tag-cartao');
  tag.textContent = grupo.tag ? `#${grupo.tag}` : '';
  tag.hidden = !grupo.tag;
  const dono = cartao.querySelector('.dono-grupo');
  dono.textContent = grupo.dono ? `Grupo de ${grupo.dono}` : '';
  dono.hidden = !grupo.dono;

  const lista = cartao.querySelector('.lista-modalidades');
  const vazio = cartao.querySelector('.vazio-cartao');
  if (grupo.exercicios === null) {
    vazio.textContent = 'Não foi possível carregar as modalidades.';
  } else if (!grupo.exercicios.length) {
    vazio.textContent = 'Nenhuma modalidade ainda.';
  } else {
    lista.append(...grupo.exercicios.slice(0, MAXIMO_MODALIDADES).map(criarModalidade));
    const restantes = grupo.exercicios.length - MAXIMO_MODALIDADES;
    if (restantes > 0) {
      const mais = document.createElement('li');
      mais.className = 'mais';
      mais.textContent = `+ ${restantes} ${restantes === 1 ? 'modalidade' : 'modalidades'}`;
      lista.append(mais);
    }
  }
  lista.hidden = !lista.children.length;
  vazio.hidden = lista.children.length > 0;

  const inspecionar = cartao.querySelector('[data-acao="inspecionar"]');
  inspecionar.href = linkGrupo(grupo.id);
  inspecionar.setAttribute('aria-label', `Inspecionar o grupo ${grupo.nome}`);
  return fragmento;
}

export function renderizarGrupos(lista, grupos) {
  lista.replaceChildren(...grupos.map(criarCartao));
}
