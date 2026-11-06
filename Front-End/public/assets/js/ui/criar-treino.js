import { cadastrarTreino } from '../api/treinos/cadastrar.js';
import { tratarSessaoExpirada } from './autenticacao-principal.js';

export function iniciarCriacaoTreino(recarregar) {
  const dialogo = document.querySelector('#dialogo-criar-treino');
  const formulario = document.querySelector('#form-criar-treino');
  const nome = document.querySelector('#nome-treino');
  const status = document.querySelector('#status-criar-treino');
  const botao = formulario.querySelector('[type="submit"]');
  let enviando = false;
  document.querySelectorAll('[data-criar-treino]').forEach(abrir => abrir.addEventListener('click', () => {
    status.textContent = '';
    dialogo.showModal();
  }));
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
    botao.disabled = true;
    status.textContent = 'Criando treino…';
    try {
      await cadastrarTreino(nome.value.trim());
      formulario.reset();
      dialogo.close();
      await recarregar();
    } catch (erro) {
      if (!tratarSessaoExpirada(erro)) status.textContent = erro.message;
    } finally {
      enviando = false;
      botao.disabled = false;
    }
  });
}
