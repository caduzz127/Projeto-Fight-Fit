import { deletarTreino } from '../../api/treinos/deletar.js';
import { atualizarTreino } from '../../api/treinos/atualizar.js';
import { adaptarTreino } from '../../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';
import { ICONE_LAPIS, ICONE_LIXEIRA } from '../compartilhado/icones.js';
import { linkTreino } from '../compartilhado/rotas.js';

const MAXIMO_RESUMO = 3;

function mostrarStatus(elemento, texto, erro = false) {
  elemento.textContent = texto;
  if (erro) elemento.dataset.tipo = 'erro';
  else delete elemento.dataset.tipo;
}

// Nome do treino no título e nos rótulos dos botões, usado ao criar e ao renomear.
function aplicarNome(cartao, nome) {
  cartao.querySelector('h2').textContent = nome;
  cartao.querySelector('[data-acao="editar"]').setAttribute('aria-label', `Editar nome do treino ${nome}`);
  cartao.querySelector('[data-acao="excluir"]').setAttribute('aria-label', `Excluir treino ${nome}`);
  cartao.querySelector('[data-acao="ver"]').setAttribute('aria-label', `Ver mais sobre o treino ${nome}`);
}

function criarCartao(treino) {
  const fragmento = document.querySelector('#modelo-cartao-treino').content.cloneNode(true);
  const cartao = fragmento.querySelector('article');
  const titulo = cartao.querySelector('h2');
  cartao.dataset.id = treino.id;
  titulo.id = `treino-${treino.id}`;
  cartao.setAttribute('aria-labelledby', titulo.id);

  const lista = cartao.querySelector('.lista-exercicios-resumo');
  treino.exercicios.slice(0, MAXIMO_RESUMO).forEach(exercicio => {
    const item = document.createElement('li');
    item.textContent = exercicio.nome;
    lista.append(item);
  });
  const restantes = treino.exercicios.length - MAXIMO_RESUMO;
  if (restantes > 0) {
    const item = document.createElement('li');
    item.className = 'mais';
    item.textContent = `+ ${restantes} ${restantes === 1 ? 'exercício' : 'exercícios'}`;
    lista.append(item);
  }
  lista.hidden = treino.exercicios.length === 0;
  cartao.querySelector('.sem-exercicios').hidden = treino.exercicios.length > 0;

  cartao.querySelector('[data-acao="editar"]').innerHTML = ICONE_LAPIS;
  cartao.querySelector('[data-acao="excluir"]').innerHTML = ICONE_LIXEIRA;
  cartao.querySelector('[data-acao="ver"]').href = linkTreino(treino.id);
  aplicarNome(cartao, treino.nome);
  return fragmento;
}

export function renderizarTreinos(lista, treinos) {
  lista.replaceChildren(...treinos.map(criarCartao));
}

export function adicionarTreino(lista, treino) {
  lista.append(criarCartao(treino));
  return lista.lastElementChild;
}

function mostrarConfirmacao(cartao, visivel) {
  cartao.querySelector('.cartao-base').hidden = visivel;
  cartao.querySelector('.confirmacao').hidden = !visivel;
  cartao.querySelectorAll('.cartao-acoes button').forEach(botao => { botao.disabled = visivel; });
  mostrarStatus(cartao.querySelector('.confirmacao .status-cartao'), '');
  (visivel ? cartao.querySelector('[data-acao="cancelar-exclusao"]') : cartao.querySelector('[data-acao="excluir"]')).focus();
}

// O topo do cartão vira um pequeno formulário com o nome atual.
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

// Edição e exclusão acontecem no próprio cartão, sem abrir uma janela por cima da página.
export function iniciarAcoesTreinos(lista, { aoExcluir, aoRenomear }) {
  const ocupados = new Set();

  lista.addEventListener('keydown', evento => {
    const cartao = evento.target.closest('article');
    if (evento.key !== 'Escape' || !cartao || ocupados.has(cartao.dataset.id)) return;
    if (!cartao.querySelector('.form-renomear').hidden) mostrarEdicao(cartao, false);
    else if (!cartao.querySelector('.confirmacao').hidden) mostrarConfirmacao(cartao, false);
  });

  lista.addEventListener('input', evento => {
    if (evento.target.name === 'nome') evento.target.setCustomValidity('');
  });

  lista.addEventListener('submit', async evento => {
    evento.preventDefault();
    const formulario = evento.target;
    const cartao = formulario.closest('article');
    const id = cartao.dataset.id;
    if (ocupados.has(id)) return;
    const campo = formulario.elements.nome;
    const nome = campo.value.trim();
    campo.setCustomValidity(nome ? '' : 'Digite um nome para o treino.');
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
      const treino = adaptarTreino(await atualizarTreino({ id, nome }));
      aplicarNome(cartao, treino.nome);
      controles.forEach(controle => { controle.disabled = false; });
      mostrarEdicao(cartao, false);
      aoRenomear({ id, nome: treino.nome });
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      controles.forEach(controle => { controle.disabled = false; });
      mostrarStatus(status, erro.message, true);
    } finally {
      ocupados.delete(id);
    }
  });

  lista.addEventListener('click', async evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const cartao = botao.closest('article');
    const id = cartao.dataset.id;
    if (ocupados.has(id)) return;
    switch (botao.dataset.acao) {
      case 'editar': mostrarEdicao(cartao, true); return;
      case 'cancelar-edicao': mostrarEdicao(cartao, false); return;
      case 'excluir': mostrarConfirmacao(cartao, true); return;
      case 'cancelar-exclusao': mostrarConfirmacao(cartao, false); return;
      case 'confirmar-exclusao': break;
      default: return;
    }

    const status = cartao.querySelector('.confirmacao .status-cartao');
    const botoes = cartao.querySelectorAll('.confirmacao button');
    ocupados.add(id);
    botoes.forEach(item => { item.disabled = true; });
    mostrarStatus(status, 'Excluindo treino…');
    try {
      await deletarTreino(id);
      const vizinho = cartao.nextElementSibling || cartao.previousElementSibling;
      const nome = cartao.querySelector('h2').textContent;
      cartao.remove();
      aoExcluir({ id, nome, proximoFoco: vizinho?.querySelector('[data-acao="ver"]') });
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      mostrarStatus(status, erro.message, true);
      botoes.forEach(item => { item.disabled = false; });
    } finally {
      ocupados.delete(id);
    }
  });
}
