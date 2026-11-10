import { cadastrarExercicio } from '../api/exercicios/cadastrar.js';
import { atualizarExercicio } from '../api/exercicios/atualizar.js';
import { deletarExercicio } from '../api/exercicios/deletar.js';
import { adaptarExercicio } from '../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './autenticacao-principal.js';
import { formatarNumero } from './pagina-base.js';
import { ICONE_LAPIS, ICONE_LIXEIRA } from './icones.js';

function mostrarStatus(elemento, texto, erro = false) {
  elemento.textContent = texto;
  if (erro) elemento.dataset.tipo = 'erro';
  else delete elemento.dataset.tipo;
}

// Lista de exercícios com edição, inclusão e exclusão dentro da própria página.
// Só um cartão fica em edição ou confirmação por vez; o estado decide o que é desenhado.
export function iniciarExerciciosTreino({ idTreino, exercicios: iniciais, aoMudar }) {
  const lista = document.querySelector('#lista-exercicios');
  const vazio = document.querySelector('#estado-sem-exercicios');
  const adicionar = document.querySelector('#adicionar-exercicio');
  const anuncio = document.querySelector('#anuncio');
  let exercicios = [...iniciais];
  let modo = null; // { tipo: 'editar' | 'excluir', id } ou { tipo: 'novo' }
  let ocupado = false;

  function criarCartao(exercicio) {
    const item = document.querySelector('#modelo-exercicio').content.firstElementChild.cloneNode(true);
    item.dataset.id = exercicio.id;
    item.querySelector('h2').textContent = exercicio.nome;
    item.querySelector('[data-campo="carga"]').textContent = `${formatarNumero(exercicio.carga)} kg`;
    item.querySelector('[data-campo="repeticoes"]').textContent = formatarNumero(exercicio.repeticoes);
    item.querySelector('[data-campo="serie"]').textContent = formatarNumero(exercicio.serie);
    const editar = item.querySelector('[data-acao="editar"]');
    editar.innerHTML = ICONE_LAPIS;
    editar.setAttribute('aria-label', `Editar ${exercicio.nome}`);
    const excluir = item.querySelector('[data-acao="excluir"]');
    excluir.innerHTML = ICONE_LIXEIRA;
    excluir.setAttribute('aria-label', `Excluir ${exercicio.nome}`);
    const confirmando = modo?.tipo === 'excluir' && modo.id === exercicio.id;
    item.classList.toggle('confirmando', confirmando);
    item.querySelector('.exercicio-acoes').hidden = confirmando;
    item.querySelector('.confirmacao-exercicio').hidden = !confirmando;
    return item;
  }

  function criarFormulario(exercicio) {
    const item = document.querySelector('#modelo-form-exercicio').content.firstElementChild.cloneNode(true);
    const formulario = item.querySelector('form');
    if (exercicio) item.dataset.id = exercicio.id;
    item.querySelector('h2').textContent = exercicio ? `Editar ${exercicio.nome}` : 'Novo exercício';
    formulario.querySelector('[type="submit"]').textContent = exercicio ? 'Salvar' : 'Adicionar exercício';
    if (exercicio) {
      formulario.elements.nome.value = exercicio.nome;
      formulario.elements.carga.value = String(exercicio.carga);
      formulario.elements.repeticoes.value = String(exercicio.repeticoes);
      formulario.elements.serie.value = String(exercicio.serie);
    }
    formulario.elements.nome.addEventListener('input', () => formulario.elements.nome.setCustomValidity(''));
    formulario.addEventListener('submit', evento => {
      evento.preventDefault();
      salvar(formulario, exercicio);
    });
    return item;
  }

  function renderizar(focar) {
    lista.replaceChildren(...exercicios.map(exercicio => (
      modo?.tipo === 'editar' && modo.id === exercicio.id ? criarFormulario(exercicio) : criarCartao(exercicio)
    )));
    if (modo?.tipo === 'novo') lista.append(criarFormulario(null));
    lista.hidden = lista.children.length === 0;
    vazio.hidden = lista.children.length > 0;
    adicionar.hidden = modo?.tipo === 'novo';
    aoMudar(exercicios);
    focar?.();
  }

  function focarCartao(id, seletor) {
    return () => (lista.querySelector(`li[data-id="${CSS.escape(id)}"] ${seletor}`) || adicionar).focus();
  }
  const focarFormulario = () => lista.querySelector('form [name="nome"]')?.focus();

  function cancelar() {
    const anterior = modo;
    modo = null;
    renderizar(anterior?.id ? focarCartao(anterior.id, `[data-acao="${anterior.tipo}"]`) : () => adicionar.focus());
  }

  async function salvar(formulario, exercicio) {
    if (ocupado) return;
    const campos = formulario.elements;
    campos.nome.setCustomValidity(campos.nome.value.trim() ? '' : 'Digite o nome do exercício.');
    if (!formulario.reportValidity()) return;
    const dados = {
      idTreino, nome: campos.nome.value.trim(), carga: campos.carga.valueAsNumber,
      repeticoes: campos.repeticoes.valueAsNumber, serie: campos.serie.valueAsNumber,
    };
    const status = formulario.querySelector('.status-cartao');
    const controles = [...formulario.elements];
    ocupado = true;
    controles.forEach(controle => { controle.disabled = true; });
    mostrarStatus(status, exercicio ? 'Salvando…' : 'Adicionando…');
    try {
      const salvo = adaptarExercicio(exercicio
        ? await atualizarExercicio({ ...dados, id: exercicio.id })
        : await cadastrarExercicio(dados));
      exercicios = exercicio ? exercicios.map(item => (item.id === exercicio.id ? salvo : item)) : [...exercicios, salvo];
      modo = null;
      anuncio.textContent = exercicio ? `${salvo.nome} atualizado.` : `${salvo.nome} adicionado.`;
      renderizar(exercicio ? focarCartao(salvo.id, '[data-acao="editar"]') : () => adicionar.focus());
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      controles.forEach(controle => { controle.disabled = false; });
      mostrarStatus(status, erro.message, true);
    } finally {
      ocupado = false;
    }
  }

  async function excluir(item, id) {
    const status = item.querySelector('.confirmacao-exercicio .status-cartao');
    const botoes = item.querySelectorAll('.confirmacao-exercicio button');
    ocupado = true;
    botoes.forEach(botao => { botao.disabled = true; });
    mostrarStatus(status, 'Excluindo…');
    try {
      await deletarExercicio({ id, idTreino });
      const indice = exercicios.findIndex(exercicio => exercicio.id === id);
      const nome = exercicios[indice].nome;
      exercicios = exercicios.filter(exercicio => exercicio.id !== id);
      modo = null;
      anuncio.textContent = `${nome} excluído.`;
      const vizinho = exercicios[indice] || exercicios[indice - 1];
      renderizar(vizinho ? focarCartao(vizinho.id, '[data-acao="editar"]') : () => adicionar.focus());
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      botoes.forEach(botao => { botao.disabled = false; });
      mostrarStatus(status, erro.message, true);
    } finally {
      ocupado = false;
    }
  }

  adicionar.addEventListener('click', () => {
    if (ocupado) return;
    modo = { tipo: 'novo' };
    renderizar(focarFormulario);
  });
  lista.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && modo && !ocupado) cancelar();
  });
  lista.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao || ocupado) return;
    const item = botao.closest('li');
    const id = item.dataset.id;
    switch (botao.dataset.acao) {
      case 'editar':
        modo = { tipo: 'editar', id };
        renderizar(focarFormulario);
        break;
      case 'excluir':
        modo = { tipo: 'excluir', id };
        renderizar(focarCartao(id, '[data-acao="cancelar-exclusao"]'));
        break;
      case 'cancelar':
      case 'cancelar-exclusao':
        cancelar();
        break;
      case 'confirmar-exclusao':
        excluir(item, id);
        break;
    }
  });

  renderizar();
}
