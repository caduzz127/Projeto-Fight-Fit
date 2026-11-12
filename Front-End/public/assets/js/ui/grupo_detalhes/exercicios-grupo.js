import { atualizarExercicioGrupo } from '../../api/exercicios-grupo/atualizar.js';
import { adaptarExercicioGrupo } from '../../dados/adaptar-principal.js';
import { montarRanking } from '../../dados/ranking.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';
import { ICONE_LAPIS } from '../compartilhado/icones.js';
import { linkRanking } from '../compartilhado/rotas.js';
import { obterModalidade } from '../principal/modalidades.js';

const MAXIMO_INTEGRANTES = 5;

function mostrarStatus(elemento, texto, erro = false) {
  elemento.textContent = texto;
  if (erro) elemento.dataset.tipo = 'erro';
  else delete elemento.dataset.tipo;
}

function preencherCartao(cartao, exercicio) {
  cartao.querySelector('h2').textContent = exercicio.nome;
  cartao.querySelector('[data-acao="editar"]').setAttribute('aria-label', `Editar nome de ${exercicio.nome}`);
  const detalhes = cartao.querySelector('[data-acao="detalhes"]');
  detalhes.href = linkRanking(exercicio.id);
  detalhes.setAttribute('aria-label', `Ver ranking de ${exercicio.nome}`);
}

function criarCartao(exercicio, podeEditar) {
  const cartao = document.querySelector('#modelo-exercicio-grupo').content.firstElementChild.cloneNode(true);
  cartao.dataset.id = exercicio.id;
  const titulo = cartao.querySelector('h2');
  titulo.id = `exercicio-${exercicio.id}`;
  cartao.setAttribute('aria-labelledby', titulo.id);
  cartao.querySelector('.icone-modalidade img').src = `assets/images/icons/${obterModalidade(exercicio.modalidade).icone}`;
  const editar = cartao.querySelector('[data-acao="editar"]');
  editar.innerHTML = ICONE_LAPIS;
  editar.hidden = !podeEditar;

  // Integrantes na ordem do ranking, para o card já sugerir quem está na frente.
  const integrantes = montarRanking(exercicio.participantes);
  const lista = cartao.querySelector('.lista-integrantes-exercicio');
  integrantes.slice(0, MAXIMO_INTEGRANTES).forEach(participante => {
    const item = document.createElement('li');
    item.textContent = participante.nome;
    lista.append(item);
  });
  const restantes = integrantes.length - MAXIMO_INTEGRANTES;
  if (restantes > 0) {
    const mais = document.createElement('li');
    mais.className = 'mais';
    mais.textContent = `+ ${restantes} ${restantes === 1 ? 'integrante' : 'integrantes'}`;
    lista.append(mais);
  }
  lista.hidden = integrantes.length === 0;
  cartao.querySelector('.vazio-cartao').hidden = integrantes.length > 0;
  preencherCartao(cartao, exercicio);
  return cartao;
}

function mostrarEdicao(cartao, visivel) {
  const formulario = cartao.querySelector('.form-renomear');
  const campo = formulario.elements.nome;
  cartao.querySelector('.cartao-topo').hidden = visivel;
  formulario.hidden = !visivel;
  mostrarStatus(formulario.querySelector('.status-cartao'), '');
  campo.setCustomValidity('');
  if (visivel) {
    campo.value = cartao.querySelector('h2').textContent;
    campo.focus();
    campo.select();
  } else {
    cartao.querySelector('[data-acao="editar"]').focus();
  }
}

// Cartões dos exercícios do grupo; administradores renomeiam no próprio cartão.
export function iniciarExerciciosGrupo({ lista, exercicios, idGrupo, podeEditar, aoRenomear }) {
  lista.replaceChildren(...exercicios.map(exercicio => criarCartao(exercicio, podeEditar)));
  const ocupados = new Set();

  lista.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const cartao = botao.closest('article');
    if (ocupados.has(cartao.dataset.id)) return;
    if (botao.dataset.acao === 'editar') mostrarEdicao(cartao, true);
    if (botao.dataset.acao === 'cancelar-edicao') mostrarEdicao(cartao, false);
  });
  lista.addEventListener('keydown', evento => {
    const cartao = evento.target.closest('article');
    if (evento.key === 'Escape' && cartao && !cartao.querySelector('.form-renomear').hidden && !ocupados.has(cartao.dataset.id)) {
      mostrarEdicao(cartao, false);
    }
  });
  lista.addEventListener('input', evento => evento.target.setCustomValidity?.(''));
  lista.addEventListener('submit', async evento => {
    evento.preventDefault();
    const formulario = evento.target;
    const cartao = formulario.closest('article');
    const id = cartao.dataset.id;
    if (ocupados.has(id)) return;
    const campo = formulario.elements.nome;
    const nome = campo.value.trim();
    campo.setCustomValidity(nome ? '' : 'Digite o nome do exercício.');
    if (!formulario.reportValidity()) return;
    if (nome === cartao.querySelector('h2').textContent) {
      mostrarEdicao(cartao, false);
      return;
    }
    const controles = [...formulario.elements];
    const status = formulario.querySelector('.status-cartao');
    ocupados.add(id);
    controles.forEach(controle => { controle.disabled = true; });
    mostrarStatus(status, 'Salvando…');
    try {
      const exercicio = adaptarExercicioGrupo(await atualizarExercicioGrupo({ id, idGrupo, nome }));
      preencherCartao(cartao, exercicio);
      controles.forEach(controle => { controle.disabled = false; });
      mostrarEdicao(cartao, false);
      aoRenomear(exercicio);
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      controles.forEach(controle => { controle.disabled = false; });
      mostrarStatus(status, erro.message, true);
    } finally {
      ocupados.delete(id);
    }
  });
}
