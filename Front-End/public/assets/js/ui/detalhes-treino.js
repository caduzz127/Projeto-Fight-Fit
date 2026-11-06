import { listarExerciciosTreino } from '../api/treinos/exercicios.js';
import { adaptarExercicios } from '../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './autenticacao-principal.js';

export function iniciarDetalhesTreino(dados) {
  const dialogo = document.querySelector('#dialogo-treino');
  const lista = document.querySelector('#exercicios-treino');
  const status = document.querySelector('#status-detalhes-treino');
  let controle;
  dialogo.addEventListener('close', () => controle?.abort());
  document.addEventListener('click', async evento => {
    const botao = evento.target.closest('[data-treino]');
    if (!botao) return;
    const treino = dados.treinos.find(item => item.id === botao.dataset.treino);
    if (!treino) return;
    controle?.abort();
    controle = new AbortController();
    const atual = controle;
    document.querySelector('#titulo-dialogo-treino').textContent = treino.nome;
    lista.replaceChildren();
    status.textContent = 'Carregando exercícios…';
    dialogo.showModal();
    try {
      const exercicios = adaptarExercicios(await listarExerciciosTreino(treino.id, { signal: atual.signal }));
      if (atual.signal.aborted) return;
      status.textContent = exercicios.length ? `${exercicios.length} exercícios` : 'Este treino ainda não tem exercícios cadastrados.';
      exercicios.forEach(exercicio => {
        const item = document.createElement('div');
        item.className = 'exercicio detalhe-exercicio';
        const texto = document.createElement('span');
        const titulo = document.createElement('strong');
        titulo.textContent = exercicio.nome;
        const detalhe = document.createElement('small');
        detalhe.textContent = exercicio.orientacao;
        texto.append(titulo, detalhe);
        item.append(texto);
        lista.append(item);
      });
    } catch (erro) {
      if (!atual.signal.aborted && !tratarSessaoExpirada(erro)) status.textContent = erro.message;
    }
  });
}
