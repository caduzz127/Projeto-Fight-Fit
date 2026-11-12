import { listarTreinos } from './api/treinos/listar.js';
import { listarGrupos } from './api/grupos/listar.js';
import { obterSessao } from './api/sessao.js';
import { adaptarGrupos, adaptarTreinos } from './dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './ui/compartilhado/autenticacao-principal.js';
import { preencherAvatares } from './ui/compartilhado/avatar-iniciais.js';
import { iniciarPagina } from './ui/compartilhado/pagina-base.js';
import { iniciarConta } from './ui/usuario/conta.js';

function mostrarIdentidade(nome) {
  document.title = `${nome} — Fight Fit`;
  document.querySelector('#nome-usuario').textContent = nome;
  document.querySelector('#dado-username').textContent = nome;
  document.querySelector('#avatar-conta').dataset.avatarNome = nome;
  document.querySelector('.perfil').dataset.avatarNome = nome;
  preencherAvatares();
}

async function carregarResumo() {
  const status = document.querySelector('#status-resumo');
  try {
    const [treinos, grupos] = await Promise.all([listarTreinos(), listarGrupos()]);
    const listaTreinos = adaptarTreinos(treinos);
    document.querySelector('#resumo-treinos').textContent = String(listaTreinos.length);
    document.querySelector('#resumo-exercicios').textContent = String(listaTreinos.reduce((total, treino) => total + treino.exercicios.length, 0));
    document.querySelector('#resumo-grupos').textContent = String(adaptarGrupos(grupos).length);
  } catch (erro) {
    if (tratarSessaoExpirada(erro)) return;
    status.textContent = `Não foi possível carregar o resumo. ${erro.message}`;
    status.dataset.tipo = 'erro';
  }
}

if (iniciarPagina()) {
  mostrarIdentidade(obterSessao().username);
  iniciarConta({ aoAtualizar: mostrarIdentidade });
  carregarResumo();
}
