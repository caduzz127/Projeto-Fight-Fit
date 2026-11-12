import { cadastrarTreino } from '../../api/treinos/cadastrar.js';
import { adaptarTreino } from '../../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';

// Criação de treino em um diálogo modal, centralizado na frente da página.
export function iniciarNovoTreino(aoCriar) {
  const abrir = document.querySelector('#adicionar-treino');
  const dialogo = document.querySelector('#dialogo-novo-treino');
  const formulario = document.querySelector('#form-novo-treino');
  const nome = document.querySelector('#nome-novo-treino');
  const status = document.querySelector('#status-novo-treino');
  const enviar = formulario.querySelector('[type="submit"]');
  let enviando = false;

  function mostrarStatus(texto, erro = false) {
    status.textContent = texto;
    if (erro) status.dataset.tipo = 'erro';
    else delete status.dataset.tipo;
  }

  function abrirDialogo() {
    formulario.reset();
    nome.setCustomValidity('');
    mostrarStatus('');
    dialogo.showModal();
    nome.focus();
  }

  abrir.addEventListener('click', abrirDialogo);
  document.querySelector('#cancelar-novo-treino').addEventListener('click', () => {
    if (!enviando) dialogo.close();
  });
  // Esc não fecha enquanto o treino está sendo criado.
  dialogo.addEventListener('cancel', evento => {
    if (enviando) evento.preventDefault();
  });
  nome.addEventListener('input', () => nome.setCustomValidity(''));
  formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (enviando) return;
    nome.setCustomValidity(nome.value.trim() ? '' : 'Digite um nome para o treino.');
    if (!formulario.reportValidity()) return;
    enviando = true;
    enviar.disabled = true;
    nome.disabled = true;
    mostrarStatus('Criando treino…');
    try {
      const treino = adaptarTreino(await cadastrarTreino(nome.value.trim()));
      enviando = false;
      dialogo.close();
      aoCriar(treino);
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      mostrarStatus(erro.message, true);
    } finally {
      enviando = false;
      enviar.disabled = false;
      nome.disabled = false;
    }
  });

  // Atalhos de outras telas chegam com ?novo para abrir o diálogo direto.
  const parametros = new URLSearchParams(location.search);
  if (parametros.has('novo')) {
    parametros.delete('novo');
    history.replaceState(null, '', `${location.pathname}${parametros.size ? `?${parametros}` : ''}${location.hash}`);
    abrirDialogo();
  }
}
