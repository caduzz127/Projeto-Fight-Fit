import { buscarRanking } from './api/participantes/ranking.js';
import { detalharGrupo } from './api/grupos/detalhar.js';
import { obterSessao } from './api/sessao.js';
import { adaptarExercicioGrupo, adaptarGrupo } from './dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './ui/compartilhado/autenticacao-principal.js';
import { iniciarPagina, plural } from './ui/compartilhado/pagina-base.js';
import { linkGrupo } from './ui/compartilhado/rotas.js';
import { renderizarRanking } from './ui/grupo_ranking/ranking.js';

const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NAO_ENCONTRADO = 'Este ranking não existe ou é de um grupo do qual você não participa.';

if (iniciarPagina()) {
  const id = new URLSearchParams(location.search).get('id') || '';
  const painel = document.querySelector('#estado-carregamento');
  const mensagem = document.querySelector('#mensagem-carregamento');
  const tentar = document.querySelector('#tentar-novamente');
  let controle;

  function mostrarErro(texto, podeTentar) {
    painel.hidden = false;
    painel.dataset.estado = 'erro';
    mensagem.textContent = texto;
    tentar.hidden = !podeTentar;
  }

  async function carregar() {
    if (!FORMATO_UUID.test(id)) {
      mostrarErro(NAO_ENCONTRADO, false);
      return;
    }
    controle?.abort();
    controle = new AbortController();
    const atual = controle;
    painel.hidden = false;
    painel.dataset.estado = 'carregando';
    mensagem.textContent = 'Carregando o ranking…';
    tentar.hidden = true;
    document.querySelector('main').setAttribute('aria-busy', 'true');
    try {
      const exercicio = adaptarExercicioGrupo(await buscarRanking(id, { signal: atual.signal }));
      const grupo = adaptarGrupo(await detalharGrupo(exercicio.idGrupo, { signal: atual.signal }));
      if (atual.signal.aborted) return;
      if (!grupo.membros.includes(obterSessao()?.username)) {
        mostrarErro(NAO_ENCONTRADO, false);
        return;
      }
      document.title = `Ranking: ${exercicio.nome} — Fight Fit`;
      document.querySelector('#nome-exercicio').textContent = exercicio.nome;
      document.querySelector('#voltar-grupo').href = linkGrupo(grupo.id);
      document.querySelector('#texto-voltar').textContent = grupo.nome;
      document.querySelector('#resumo-ranking').textContent = exercicio.participantes.length
        ? `${plural(exercicio.participantes.length, 'participante', 'participantes')} · ${grupo.nome}` : grupo.nome;
      renderizarRanking({
        podio: document.querySelector('#podio'),
        lista: document.querySelector('#lista-ranking'),
        vazio: document.querySelector('#ranking-vazio'),
        participantes: exercicio.participantes,
      });
      painel.hidden = true;
      document.querySelector('#conteudo-ranking').hidden = false;
    } catch (erro) {
      if (atual.signal.aborted || tratarSessaoExpirada(erro)) return;
      if ([400, 403, 404].includes(erro.status)) mostrarErro(NAO_ENCONTRADO, false);
      else mostrarErro(`Não foi possível carregar o ranking. ${erro.message}`, true);
    } finally {
      if (controle === atual) document.querySelector('main').removeAttribute('aria-busy');
    }
  }

  tentar.addEventListener('click', carregar);
  window.addEventListener('pagehide', () => controle?.abort(), { once: true });
  carregar();
}
