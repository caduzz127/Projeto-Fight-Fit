import { detalharGrupo } from './api/grupos/detalhar.js';
import { listarExerciciosGrupo } from './api/exercicios-grupo/listar.js';
import { obterSessao } from './api/sessao.js';
import { adaptarExerciciosGrupo, adaptarGrupo, CARGO_DONO_GRUPO, CARGOS_ADMIN_GRUPO } from './dados/adaptar-principal.js';
import { tratarSessaoExpirada } from './ui/compartilhado/autenticacao-principal.js';
import { iniciarPagina, plural } from './ui/compartilhado/pagina-base.js';
import { iniciarConfiguracoes } from './ui/grupo_detalhes/configuracoes-grupo.js';
import { iniciarExerciciosGrupo } from './ui/grupo_detalhes/exercicios-grupo.js';

const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NAO_ENCONTRADO = 'Este grupo não existe ou você não participa dele.';

if (iniciarPagina()) {
  const id = new URLSearchParams(location.search).get('id') || '';
  const painel = document.querySelector('#estado-carregamento');
  const mensagem = document.querySelector('#mensagem-carregamento');
  const tentar = document.querySelector('#tentar-novamente');
  const anuncio = document.querySelector('#anuncio');
  let controle;

  function mostrarErro(texto, podeTentar) {
    painel.hidden = false;
    painel.dataset.estado = 'erro';
    mensagem.textContent = texto;
    tentar.hidden = !podeTentar;
  }

  function mostrarCabecalho(grupo, totalExercicios) {
    document.title = `${grupo.nome} — Fight Fit`;
    document.querySelector('#nome-grupo').textContent = grupo.nome;
    const tag = document.querySelector('#tag-grupo');
    tag.textContent = grupo.tag ? `#${grupo.tag}` : '';
    tag.hidden = !grupo.tag;
    const dono = document.querySelector('#dono-grupo');
    dono.textContent = grupo.dono ? `Administrador: ${grupo.dono}` : '';
    dono.hidden = !grupo.dono;
    document.querySelector('#resumo-grupo').textContent =
      `${plural(grupo.totalIntegrantes, 'integrante', 'integrantes')} · ${plural(totalExercicios, 'modalidade', 'modalidades')}`;
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
    mensagem.textContent = 'Carregando o grupo…';
    tentar.hidden = true;
    document.querySelector('main').setAttribute('aria-busy', 'true');
    try {
      const [respostaGrupo, respostaExercicios] = await Promise.all([
        detalharGrupo(id, { signal: atual.signal }), listarExerciciosGrupo(id, { signal: atual.signal }),
      ]);
      if (atual.signal.aborted) return;
      const grupo = adaptarGrupo(respostaGrupo);
      const exercicios = adaptarExerciciosGrupo(respostaExercicios);
      // A busca por id não confere se você é membro; a tela confere pelo seu nome.
      const meuCargo = grupo.usuarios.find(usuario => usuario.nome === obterSessao()?.username)?.cargo;
      if (!meuCargo) {
        mostrarErro(NAO_ENCONTRADO, false);
        return;
      }
      mostrarCabecalho(grupo, exercicios.length);
      document.querySelector('#estado-sem-exercicios').hidden = exercicios.length > 0;
      iniciarExerciciosGrupo({
        lista: document.querySelector('#lista-exercicios-grupo'),
        exercicios, idGrupo: id, podeEditar: CARGOS_ADMIN_GRUPO.includes(meuCargo),
        aoRenomear: exercicio => { anuncio.textContent = `Exercício renomeado para ${exercicio.nome}.`; },
      });
      iniciarConfiguracoes({
        grupo, souAdmin: CARGOS_ADMIN_GRUPO.includes(meuCargo), souDono: meuCargo === CARGO_DONO_GRUPO,
        aoAtualizar: atualizado => mostrarCabecalho({ ...grupo, ...atualizado }, exercicios.length),
      });
      painel.hidden = true;
      document.querySelector('#conteudo-grupo').hidden = false;
    } catch (erro) {
      if (atual.signal.aborted || tratarSessaoExpirada(erro)) return;
      if ([400, 403, 404].includes(erro.status)) mostrarErro(NAO_ENCONTRADO, false);
      else mostrarErro(`Não foi possível carregar o grupo. ${erro.message}`, true);
    } finally {
      if (controle === atual) document.querySelector('main').removeAttribute('aria-busy');
    }
  }

  tentar.addEventListener('click', carregar);
  window.addEventListener('pagehide', () => controle?.abort(), { once: true });
  carregar();
}
