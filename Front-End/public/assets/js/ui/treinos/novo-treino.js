import { cadastrarTreino } from '../../api/treinos/cadastrar.js';
import { adaptarTreino } from '../../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';

// Formulário de criação exibido na própria página, abaixo do título.
export function iniciarNovoTreino(aoCriar) {
  const abrir = document.querySelector('#adicionar-treino');
  const formulario = document.querySelector('#form-novo-treino');
  const nome = document.querySelector('#nome-novo-treino');
  const status = document.querySelector('#status-novo-treino');
  const enviar = formulario.querySelector('[type="submit"]');
  let enviando = false;

  function definirAberto(aberto) {
    formulario.hidden = !aberto;
    abrir.setAttribute('aria-expanded', String(aberto));
    status.textContent = '';
    delete status.dataset.tipo;
    if (aberto) nome.focus();
    else {
      formulario.reset();
      nome.setCustomValidity('');
      abrir.focus();
    }
  }

  abrir.addEventListener('click', () => {
    if (!enviando) definirAberto(formulario.hidden);
  });
  document.querySelector('#cancelar-novo-treino').addEventListener('click', () => {
    if (!enviando) definirAberto(false);
  });
  formulario.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && !enviando) definirAberto(false);
  });
  nome.addEventListener('input', () => nome.setCustomValidity(''));
  formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (enviando) return;
    if (!nome.value.trim()) {
      nome.setCustomValidity('Digite um nome para o treino.');
      nome.reportValidity();
      return;
    }
    enviando = true;
    enviar.disabled = true;
    status.textContent = 'Criando treino…';
    delete status.dataset.tipo;
    try {
      const treino = adaptarTreino(await cadastrarTreino(nome.value.trim()));
      aoCriar(treino);
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      status.textContent = erro.message;
      status.dataset.tipo = 'erro';
    } finally {
      enviando = false;
      enviar.disabled = false;
    }
  });

  // Atalhos de outras telas chegam com ?novo para abrir o formulário direto.
  if (new URLSearchParams(location.search).has('novo')) definirAberto(true);
}
