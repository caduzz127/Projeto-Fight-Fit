import { deletarTreino } from '../api/treinos/deletar.js';
import { tratarSessaoExpirada } from './autenticacao-principal.js';
import { ICONE_LIXEIRA } from './icones.js';
import { linkTreino } from './rotas.js';

const MAXIMO_RESUMO = 3;

function criarCartao(treino) {
  const fragmento = document.querySelector('#modelo-cartao-treino').content.cloneNode(true);
  const cartao = fragmento.querySelector('article');
  const titulo = cartao.querySelector('h2');
  cartao.dataset.id = treino.id;
  titulo.id = `treino-${treino.id}`;
  titulo.textContent = treino.nome;
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

  const excluir = cartao.querySelector('[data-acao="excluir"]');
  excluir.innerHTML = ICONE_LIXEIRA;
  excluir.setAttribute('aria-label', `Excluir treino ${treino.nome}`);
  const ver = cartao.querySelector('[data-acao="ver"]');
  ver.href = linkTreino(treino.id);
  ver.setAttribute('aria-label', `Ver mais sobre o treino ${treino.nome}`);
  return fragmento;
}

export function renderizarTreinos(lista, treinos) {
  lista.replaceChildren(...treinos.map(criarCartao));
}

function mostrarConfirmacao(cartao, visivel) {
  cartao.querySelector('.cartao-base').hidden = visivel;
  cartao.querySelector('.confirmacao').hidden = !visivel;
  cartao.querySelector('[data-acao="excluir"]').disabled = visivel;
  const status = cartao.querySelector('.confirmacao .status-cartao');
  status.textContent = '';
  delete status.dataset.tipo;
  (visivel ? cartao.querySelector('[data-acao="cancelar-exclusao"]') : cartao.querySelector('[data-acao="excluir"]')).focus();
}

// A exclusão é confirmada no próprio cartão, sem abrir uma janela por cima da página.
export function iniciarExclusaoTreinos(lista, aoExcluir) {
  const excluindo = new Set();
  lista.addEventListener('keydown', evento => {
    const cartao = evento.target.closest('article');
    if (evento.key === 'Escape' && cartao && !cartao.querySelector('.confirmacao').hidden && !excluindo.has(cartao.dataset.id)) {
      mostrarConfirmacao(cartao, false);
    }
  });
  lista.addEventListener('click', async evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const cartao = botao.closest('article');
    const id = cartao.dataset.id;
    if (excluindo.has(id)) return;
    if (botao.dataset.acao === 'excluir') mostrarConfirmacao(cartao, true);
    if (botao.dataset.acao === 'cancelar-exclusao') mostrarConfirmacao(cartao, false);
    if (botao.dataset.acao !== 'confirmar-exclusao') return;

    const status = cartao.querySelector('.confirmacao .status-cartao');
    const botoes = cartao.querySelectorAll('.confirmacao button');
    excluindo.add(id);
    botoes.forEach(item => { item.disabled = true; });
    status.textContent = 'Excluindo treino…';
    delete status.dataset.tipo;
    try {
      await deletarTreino(id);
      const vizinho = cartao.nextElementSibling || cartao.previousElementSibling;
      const nome = cartao.querySelector('h2').textContent;
      cartao.remove();
      aoExcluir({ id, nome, proximoFoco: vizinho?.querySelector('[data-acao="ver"]') });
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      status.textContent = erro.message;
      status.dataset.tipo = 'erro';
      botoes.forEach(item => { item.disabled = false; });
    } finally {
      excluindo.delete(id);
    }
  });
}
