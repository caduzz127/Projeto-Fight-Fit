import { listarTreinos } from './api/treinos/listar.js';
import { adaptarTreinos } from './dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './ui/compartilhado/autenticacao-principal.js';
import { iniciarPagina, plural } from './ui/compartilhado/pagina-base.js';
import { iniciarExclusaoTreinos, renderizarTreinos } from './ui/treinos/lista-treinos.js';
import { linkTreino } from './ui/compartilhado/rotas.js';
import { iniciarNovoTreino } from './ui/treinos/novo-treino.js';
import { iniciarFiltroTreinos } from './ui/treinos/filtrar-treinos.js';

if (iniciarPagina()) {
  const lista = document.querySelector('#lista-treinos');
  const vazio = document.querySelector('#estado-sem-treinos');
  const painel = document.querySelector('#estado-carregamento');
  const mensagem = document.querySelector('#mensagem-carregamento');
  const tentar = document.querySelector('#tentar-novamente');
  const resumo = document.querySelector('#resumo-treinos');
  const anuncio = document.querySelector('#anuncio');
  let total = 0;
  let controle;
  const filtrar = iniciarFiltroTreinos(lista);

  function atualizarTotal(novoTotal) {
    total = novoTotal;
    document.querySelector('#total-treinos').textContent = String(total);
    resumo.textContent = total ? `Você tem ${plural(total, 'treino', 'treinos')}.` : '';
    lista.hidden = total === 0;
    vazio.hidden = total > 0;
    filtrar();
  }

  async function carregar() {
    controle?.abort();
    controle = new AbortController();
    const atual = controle;
    painel.hidden = false;
    painel.dataset.estado = 'carregando';
    mensagem.textContent = 'Carregando seus treinos…';
    tentar.hidden = true;
    lista.hidden = true;
    vazio.hidden = true;
    document.querySelector('main').setAttribute('aria-busy', 'true');
    try {
      const treinos = adaptarTreinos(await listarTreinos({ signal: atual.signal }));
      if (atual.signal.aborted) return;
      renderizarTreinos(lista, treinos);
      painel.hidden = true;
      atualizarTotal(treinos.length);
    } catch (erro) {
      if (atual.signal.aborted || tratarSessaoExpirada(erro)) return;
      painel.dataset.estado = 'erro';
      mensagem.textContent = `Não foi possível carregar seus treinos. ${erro.message}`;
      tentar.hidden = false;
    } finally {
      if (controle === atual) document.querySelector('main').removeAttribute('aria-busy');
    }
  }

  iniciarExclusaoTreinos(lista, ({ nome, proximoFoco }) => {
    atualizarTotal(total - 1);
    anuncio.textContent = `Treino ${nome} excluído.`;
    (proximoFoco || document.querySelector('#adicionar-treino')).focus();
  });
  // Depois de criar, o usuário vai direto para o treino para adicionar os exercícios.
  iniciarNovoTreino(treino => location.assign(linkTreino(treino.id)));
  tentar.addEventListener('click', carregar);
  window.addEventListener('pagehide', () => controle?.abort(), { once: true });
  carregar();
}
