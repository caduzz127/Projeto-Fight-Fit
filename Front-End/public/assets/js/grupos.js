import { listarGrupos } from './api/grupos/listar.js';
import { detalharGrupo } from './api/grupos/detalhar.js';
import { listarExerciciosGrupo } from './api/exercicios-grupo/listar.js';
import { adaptarExerciciosGrupo, adaptarGrupo, adaptarGrupos } from './dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './ui/compartilhado/autenticacao-principal.js';
import { iniciarFiltroCartoes } from './ui/compartilhado/filtrar-cartoes.js';
import { iniciarPagina, plural } from './ui/compartilhado/pagina-base.js';
import { renderizarGrupos } from './ui/grupos/lista-grupos.js';

// A lista de grupos não traz o dono nem as modalidades: cada grupo busca os
// detalhes e os exercícios em paralelo. Uma falha só afeta o próprio cartão.
async function completarGrupo(grupo, signal) {
  const [detalhes, exercicios] = await Promise.allSettled([
    detalharGrupo(grupo.id, { signal }), listarExerciciosGrupo(grupo.id, { signal }),
  ]);
  for (const resultado of [detalhes, exercicios]) {
    if (resultado.status === 'rejected' && resultado.reason?.status === 401) throw resultado.reason;
  }
  const lerOuNulo = (resultado, adaptar) => {
    if (resultado.status !== 'fulfilled') return null;
    try { return adaptar(resultado.value); } catch { return null; }
  };
  return {
    ...grupo,
    dono: lerOuNulo(detalhes, adaptarGrupo)?.dono || null,
    exercicios: lerOuNulo(exercicios, adaptarExerciciosGrupo),
  };
}

if (iniciarPagina()) {
  const lista = document.querySelector('#lista-grupos');
  const vazio = document.querySelector('#estado-sem-grupos');
  const painel = document.querySelector('#estado-carregamento');
  const mensagem = document.querySelector('#mensagem-carregamento');
  const tentar = document.querySelector('#tentar-novamente');
  const filtrar = iniciarFiltroCartoes({
    lista,
    area: document.querySelector('#filtro-grupos'),
    campo: document.querySelector('#buscar-grupo'),
    resultado: document.querySelector('#resultado-busca'),
    vazio: document.querySelector('#busca-vazia'),
  });
  let controle;

  async function carregar() {
    controle?.abort();
    controle = new AbortController();
    const atual = controle;
    painel.hidden = false;
    painel.dataset.estado = 'carregando';
    mensagem.textContent = 'Carregando seus grupos…';
    tentar.hidden = true;
    lista.hidden = true;
    vazio.hidden = true;
    document.querySelector('main').setAttribute('aria-busy', 'true');
    try {
      const grupos = adaptarGrupos(await listarGrupos({ signal: atual.signal }));
      const completos = await Promise.all(grupos.map(grupo => completarGrupo(grupo, atual.signal)));
      if (atual.signal.aborted) return;
      renderizarGrupos(lista, completos);
      painel.hidden = true;
      lista.hidden = completos.length === 0;
      vazio.hidden = completos.length > 0;
      document.querySelector('#resumo-grupos').textContent = completos.length
        ? `Você participa de ${plural(completos.length, 'grupo', 'grupos')}.` : '';
      filtrar();
    } catch (erro) {
      if (atual.signal.aborted || tratarSessaoExpirada(erro)) return;
      painel.dataset.estado = 'erro';
      mensagem.textContent = `Não foi possível carregar seus grupos. ${erro.message}`;
      tentar.hidden = false;
    } finally {
      if (controle === atual) document.querySelector('main').removeAttribute('aria-busy');
    }
  }

  tentar.addEventListener('click', carregar);
  window.addEventListener('pagehide', () => controle?.abort(), { once: true });
  carregar();
}
