import { montarRanking } from '../../dados/ranking.js';
import { preencherAvatares } from '../compartilhado/avatar-iniciais.js';
import { formatarNumero, plural } from '../compartilhado/pagina-base.js';

const MEDALHAS = { 1: 'ouro', 2: 'prata', 3: 'bronze' };

function texto(tag, classe, conteudo) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (conteudo !== undefined) elemento.textContent = conteudo;
  return elemento;
}

function avatar(nome, classe = '') {
  const elemento = texto('span', `avatar ${classe}`.trim());
  elemento.dataset.avatarNome = nome;
  elemento.setAttribute('aria-hidden', 'true');
  return elemento;
}

function descreverVolume(participante) {
  return `${plural(participante.serie, 'série', 'séries')} × ${plural(participante.repeticoes, 'rep', 'reps')}`;
}

// Pódio: a ordem no HTML é 1º, 2º, 3º (leitores de tela); o CSS mostra 2º, 1º, 3º.
// A medalha segue a posição real, então empates no topo mostram a mesma medalha.
function criarLugar(participante, indice) {
  const item = texto('li', 'lugar');
  item.dataset.lugar = String(indice + 1);
  item.dataset.medalha = MEDALHAS[participante.posicao] || 'bronze';
  item.style.setProperty('--atraso', `${[150, 0, 300][indice]}ms`);
  const atleta = texto('div', 'atleta');
  const carga = texto('span', 'carga-podio', formatarNumero(participante.carga));
  carga.append(texto('small', '', ' kg'));
  atleta.append(
    texto('span', 'medalha', `${participante.posicao}º`),
    avatar(participante.nome, 'avatar-podio'),
    texto('strong', 'nome-podio', participante.nome),
    carga,
    texto('span', 'volume', descreverVolume(participante)),
  );
  const pedestal = texto('div', 'pedestal');
  pedestal.setAttribute('aria-hidden', 'true');
  pedestal.append(texto('span', '', String(participante.posicao)));
  item.append(atleta, pedestal);
  return item;
}

// Do 4º em diante: barra com a carga em relação à do líder.
function criarLinha(participante, indice) {
  const item = texto('li', 'linha-ranking');
  item.style.setProperty('--atraso', `${450 + indice * 60}ms`);
  const info = texto('div', 'info-ranking');
  info.append(texto('strong', '', participante.nome), texto('span', 'volume', descreverVolume(participante)));
  const barra = texto('div', 'barra-ranking');
  barra.setAttribute('aria-hidden', 'true');
  barra.title = `${participante.percentual}% da carga do líder`;
  const preenchida = texto('span');
  preenchida.style.setProperty('--percentual', `${participante.percentual}%`);
  barra.append(preenchida);
  item.append(
    texto('span', 'posicao', `${participante.posicao}º`),
    avatar(participante.nome),
    info,
    barra,
    texto('span', 'carga-ranking', `${formatarNumero(participante.carga)} kg`),
  );
  return item;
}

export function renderizarRanking({ podio, lista, vazio, participantes }) {
  const ranking = montarRanking(participantes);
  podio.replaceChildren(...ranking.slice(0, 3).map(criarLugar));
  podio.dataset.total = String(Math.min(ranking.length, 3));
  lista.replaceChildren(...ranking.slice(3).map(criarLinha));
  podio.hidden = ranking.length === 0;
  lista.hidden = ranking.length <= 3;
  vazio.hidden = ranking.length > 0;
  preencherAvatares(podio.parentElement);
  return ranking;
}
