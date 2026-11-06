import { descreverIntegrantes } from './renderizar-principal.js';

export function iniciarPreviaGrupos(dados, abrirTreino, atualizar) {
  const dialogo = document.querySelector('#dialogo-grupo');
  const explorar = document.querySelector('#dialogo-explorar');
  let treinoSelecionado;
  let origem;

  document.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-grupo]');
    if (!botao) return;
    const grupo = dados.grupos.find(item => item.id === botao.dataset.grupo);
    if (!grupo) return;
    origem = botao;
    document.querySelector('#titulo-dialogo-grupo').textContent = grupo.nome;
    document.querySelector('#descricao-grupo').textContent = grupo.descricao || '';
    document.querySelector('#membros-grupo').textContent = descreverIntegrantes(grupo);
    const treinos = dados.treinos.filter(treino => treino.grupoId === grupo.id);
    document.querySelector('#treinos-grupo').textContent = String(treinos.length);
    treinoSelecionado = treinos[0];
    document.querySelector('#ver-treino-grupo').hidden = !treinoSelecionado;
    document.querySelector('#grupo-sem-treinos').hidden = !!treinoSelecionado;
    dialogo.showModal();
  });
  document.querySelector('#ver-treino-grupo').addEventListener('click', () => {
    dialogo.close();
    if (treinoSelecionado) abrirTreino(treinoSelecionado.id, origem);
  });
  document.querySelectorAll('[data-explorar]').forEach(botao => {
    botao.addEventListener('click', () => explorar.showModal());
  });
  document.querySelectorAll('[data-participar]').forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.dataset.participar;
      if (dados.grupos.some(grupo => grupo.id === id)) return;
      const nome = botao.closest('article').querySelector('h3').textContent;
      dados.grupos.push({ id, nome, descricao: botao.closest('article').querySelector('p').textContent, membros: [dados.usuario.nome] });
      botao.textContent = 'Participando';
      botao.disabled = true;
      atualizar();
      document.querySelector('#status-explorar').textContent = `Você entrou em ${nome} nesta demonstração. Nenhum cadastro real foi realizado.`;
    });
  });

  const criar = document.querySelector('#dialogo-criar-grupo');
  const formulario = document.querySelector('#form-criar-grupo');
  const nomeGrupo = document.querySelector('#nome-grupo');
  document.querySelectorAll('[data-criar-grupo]').forEach(botao => {
    botao.addEventListener('click', () => criar.showModal());
  });
  nomeGrupo.addEventListener('input', () => nomeGrupo.setCustomValidity(''));
  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    const nome = nomeGrupo.value.trim();
    if (!nome) {
      nomeGrupo.setCustomValidity('Digite um nome para o grupo.');
      nomeGrupo.reportValidity();
      return;
    }
    const id = crypto.randomUUID();
    dados.grupos.push({ id, nome, descricao: 'Seu novo espaço para reunir amigos e combinar os próximos treinos.', totalIntegrantes: 1, membros: [dados.usuario.nome] });
    document.querySelector('#buscar-grupo').value = '';
    atualizar();
    criar.close();
    formulario.reset();
    [...document.querySelectorAll('[data-grupo]')].find(botao => botao.dataset.grupo === id)?.focus();
  });
}
