import { obterModalidade } from './modalidades.js';

export function iniciarPreviaTreino(dados) {
  const dialogo = document.querySelector('#dialogo-treino');
  const lista = document.querySelector('#exercicios-treino');
  const barra = dialogo.querySelector('[role="progressbar"]');
  const progresso = dialogo.querySelector('.progresso-texto');
  const concluidos = new Map();

  function abrirTreino(id, origem = document.activeElement) {
    const treino = dados.treinos.find(item => item.id === id);
    if (!treino) return;
    const marcados = concluidos.get(id) || new Set();
    concluidos.set(id, marcados);
    document.querySelector('#titulo-dialogo-treino').textContent = treino.nome;
    const grupo = dados.grupos.find(item => item.id === treino.grupoId);
    document.querySelector('#descricao-treino').textContent = `${grupo?.nome || (treino.grupoId ? 'Treino em grupo' : 'Treino individual')} · ${obterModalidade(treino.modalidade).nome}`;
    lista.replaceChildren();
    const quantidade = treino.exercicios.length;
    barra.hidden = quantidade === 0;
    barra.setAttribute('aria-valuemax', quantidade);

    function atualizarProgresso() {
      barra.setAttribute('aria-valuenow', marcados.size);
      barra.firstElementChild.style.width = quantidade ? `${marcados.size / quantidade * 100}%` : '0%';
      progresso.textContent = !quantidade
        ? 'Você ainda não adicionou exercícios a este treino.'
        : marcados.size === quantidade
          ? 'Prévia concluída. Cada passo conta!'
          : `${marcados.size} de ${quantidade} exercícios marcados nesta prévia`;
    }

    treino.exercicios.forEach((exercicio, indice) => {
      const linha = document.createElement('label');
      linha.className = 'exercicio';
      const campo = document.createElement('input');
      campo.type = 'checkbox';
      campo.checked = marcados.has(indice);
      const texto = document.createElement('span');
      const titulo = document.createElement('strong');
      titulo.textContent = exercicio.nome;
      const descricao = document.createElement('small');
      descricao.textContent = exercicio.orientacao || '';
      texto.append(titulo, descricao);
      linha.append(campo, texto);
      lista.append(linha);
      campo.addEventListener('change', () => {
        if (campo.checked) marcados.add(indice);
        else marcados.delete(indice);
        atualizarProgresso();
      });
    });
    atualizarProgresso();
    dialogo.showModal();
    dialogo.addEventListener('close', () => {
      if (origem?.isConnected) origem.focus();
    }, { once: true });
  }

  document.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-treino]');
    if (botao) abrirTreino(botao.dataset.treino, botao);
  });
  return abrirTreino;
}
