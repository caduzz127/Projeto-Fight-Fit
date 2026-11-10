import { listarTreinos } from './api/treinos/listar.js';
import { listarExerciciosTreino } from './api/exercicios/listar.js';
import { adaptarExercicios, adaptarTreinos } from './dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './ui/autenticacao-principal.js';
import { iniciarPagina, plural } from './ui/pagina-base.js';
import { iniciarExerciciosTreino } from './ui/exercicios-treino.js';

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
      // Não há busca de treino por ID na API: o nome vem da lista do próprio usuário.
      const [treinos, exercicios] = await Promise.all([
        listarTreinos({ signal: atual.signal }), listarExerciciosTreino(id, { signal: atual.signal }),
      ]);
      if (atual.signal.aborted) return;
      const treino = adaptarTreinos(treinos).find(item => item.id === id);
      if (!treino) {
        mostrarErro(NAO_ENCONTRADO, false);
        return;
      }
      document.title = `${treino.nome} — Fight Fit`;
      document.querySelector('#nome-treino').textContent = treino.nome;
      document.querySelector('#caminho-treino').textContent = treino.nome;
      iniciarExerciciosTreino({
        idTreino: id,
        exercicios: adaptarExercicios(exercicios),
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
