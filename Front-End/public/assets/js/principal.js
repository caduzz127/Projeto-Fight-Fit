import { listarGrupos } from './api/grupos/listar.js';
import { listarTreinos } from './api/treinos/listar.js';
import { obterSessao } from './api/sessao.js';
import { adaptarGrupos, adaptarTreinos } from './dados/adaptar-principal.js';
import { iniciarAutenticacaoPrincipal, tratarSessaoExpirada } from './ui/autenticacao-principal.js';
import { iniciarNavegacaoPrincipal } from './ui/navegacao-principal.js';
import { renderizarPrincipal } from './ui/renderizar-principal.js';
import { iniciarGrupos } from './ui/grupos.js';
import { iniciarFiltroGrupos } from './ui/filtrar-grupos.js';

if (iniciarAutenticacaoPrincipal()) {
  const dados = { usuario: { nome: obterSessao().username }, grupos: [], treinos: [] };
  const conteudo = document.querySelector('#conteudo-principal');
  const painel = document.querySelector('#estado-carregamento');
  const mensagem = document.querySelector('#mensagem-carregamento');
  const tentar = document.querySelector('#tentar-novamente');
  const botoesAtalhos = document.querySelectorAll('.sidebar [data-explorar]');
  let controle;

  async function carregar() {
    controle?.abort();
    controle = new AbortController();
    const atual = controle;
    conteudo.hidden = true;
    painel.hidden = false;
    painel.dataset.estado = 'carregando';
    document.querySelector('main').setAttribute('aria-busy', 'true');
    mensagem.textContent = 'Carregando seus grupos e treinos…';
    tentar.hidden = true;
    botoesAtalhos.forEach(botao => { botao.disabled = true; });
    try {
      // São as duas listagens reais do usuário autenticado, executadas em paralelo.
      const [grupos, treinos] = await Promise.all([
        listarGrupos({ signal: atual.signal }), listarTreinos({ signal: atual.signal }),
      ]);
      if (atual.signal.aborted) return;
      dados.grupos = adaptarGrupos(grupos);
      dados.treinos = adaptarTreinos(treinos);
      renderizarPrincipal(dados);
      painel.hidden = true;
      conteudo.hidden = false;
      botoesAtalhos.forEach(botao => { botao.disabled = false; });
      // Links de outras telas (ex.: pagina_principal.html#grupos) só têm destino após carregar.
      if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
      return true;
    } catch (erro) {
      if (atual.signal.aborted || tratarSessaoExpirada(erro)) return false;
      // Erros não são convertidos em [], para não simular uma conta sem atividades.
      painel.dataset.estado = 'erro';
      mensagem.textContent = `Não foi possível carregar seus dados. ${erro.message}`;
      tentar.hidden = false;
      return false;
    } finally {
      if (controle === atual) document.querySelector('main').removeAttribute('aria-busy');
    }
  }

  iniciarNavegacaoPrincipal();
  iniciarGrupos(dados, carregar);
  iniciarFiltroGrupos();
  tentar.addEventListener('click', carregar);
  window.addEventListener('pagehide', () => controle?.abort(), { once: true });
  carregar();
}
