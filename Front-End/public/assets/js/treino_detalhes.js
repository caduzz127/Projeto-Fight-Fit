import { listarTreinos } from './api/treinos/listar.js';
import { listarExerciciosTreino } from './api/exercicios/listar.js';
import { adaptarExercicios, adaptarTreinos, obterNomeTreino } from './dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './ui/compartilhado/autenticacao-principal.js';
import { iniciarPagina, plural } from './ui/compartilhado/pagina-base.js';
import { iniciarExerciciosTreino } from './ui/treino_detalhes/exercicios-treino.js';

const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NAO_ENCONTRADO = 'Este treino não existe ou não pertence a você.';

if (iniciarPagina()) {
  const id = new URLSearchParams(location.search).get('id') || '';
  const conteudo = document.querySelector('#conteudo-treino');
  const painel = document.querySelector('#estado-carregamento');
  const mensagem = document.querySelector('#mensagem-carregamento');
  const tentar = document.querySelector('#tentar-novamente');
  const resumo = document.querySelector('#resumo-exercicios');
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
    mensagem.textContent = 'Carregando o treino…';
    tentar.hidden = true;
    document.querySelector('main').setAttribute('aria-busy', 'true');
    try {
      const resposta = await listarExerciciosTreino(id, { signal: atual.signal });
      const exercicios = adaptarExercicios(resposta);
      let nome = obterNomeTreino(resposta);
      // Treino sem exercícios não traz o nome; só então buscamos a lista de treinos.
      if (!nome) {
        const treino = adaptarTreinos(await listarTreinos({ signal: atual.signal })).find(item => item.id === id);
        if (atual.signal.aborted) return;
        if (!treino) {
          mostrarErro(NAO_ENCONTRADO, false);
          return;
        }
        nome = treino.nome;
      }
      if (atual.signal.aborted) return;
      document.title = `${nome} — Fight Fit`;
      document.querySelector('#nome-treino').textContent = nome;
      iniciarExerciciosTreino({
        idTreino: id,
        exercicios,
        aoMudar: lista => {
          resumo.textContent = lista.length ? plural(lista.length, 'exercício', 'exercícios') : '';
        },
      });
      painel.hidden = true;
      conteudo.hidden = false;
    } catch (erro) {
      if (atual.signal.aborted || tratarSessaoExpirada(erro)) return;
      if ([400, 403, 404].includes(erro.status)) mostrarErro(NAO_ENCONTRADO, false);
      else mostrarErro(`Não foi possível carregar o treino. ${erro.message}`, true);
    } finally {
      if (controle === atual) document.querySelector('main').removeAttribute('aria-busy');
    }
  }

  tentar.addEventListener('click', carregar);
  window.addEventListener('pagehide', () => controle?.abort(), { once: true });
  carregar();
}
