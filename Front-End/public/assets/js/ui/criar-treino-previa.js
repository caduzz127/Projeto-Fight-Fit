export function iniciarCriacaoTreino(dados, atualizar) {
  const dialogo = document.querySelector('#dialogo-criar-treino');
  const formulario = document.querySelector('#form-criar-treino');
  const nome = document.querySelector('#nome-treino');
  const modalidade = document.querySelector('#modalidade-treino');
  const grupo = document.querySelector('#grupo-treino');

  document.querySelectorAll('[data-criar-treino]').forEach(botao => {
    botao.addEventListener('click', () => {
      grupo.replaceChildren(new Option('Treino individual', ''));
      dados.grupos.forEach(item => grupo.append(new Option(item.nome, item.id)));
      dialogo.showModal();
    });
  });
  nome.addEventListener('input', () => nome.setCustomValidity(''));
  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    if (!nome.value.trim()) {
      nome.setCustomValidity('Digite um nome para o treino.');
      nome.reportValidity();
      return;
    }
    const treino = { id: crypto.randomUUID(), nome: nome.value.trim(), modalidade: modalidade.value, grupoId: grupo.value || null, exercicios: [] };
    dados.treinos.push(treino);
    atualizar();
    dialogo.close();
    formulario.reset();
    [...document.querySelectorAll('.cartao-treino [data-treino]')].find(botao => botao.dataset.treino === treino.id)?.focus();
  });
}
