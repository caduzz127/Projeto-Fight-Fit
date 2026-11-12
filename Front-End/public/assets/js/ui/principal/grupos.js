import { buscarGrupos } from '../../api/grupos/buscar.js';
import { cadastrarGrupo } from '../../api/grupos/cadastrar.js';
import { entrarGrupo } from '../../api/grupos/entrar.js';
import { adaptarGrupos } from '../../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';

export function iniciarGrupos(dados, recarregar) {
  const explorar = document.querySelector('#dialogo-explorar');
  const busca = document.querySelector('#form-buscar-grupos');
  const campoBusca = document.querySelector('#nome-busca-grupo');
  const statusBusca = document.querySelector('#status-explorar');
  const resultados = document.querySelector('#resultados-grupos');
  const entrada = document.querySelector('#dialogo-entrar-grupo');
  const formEntrada = document.querySelector('#form-entrar-grupo');
  const senhaEntrada = document.querySelector('#senha-entrar-grupo');
  const statusEntrada = document.querySelector('#status-entrar-grupo');
  let grupoSelecionado;
  let buscaControle;
  let entrando = false;

  document.querySelectorAll('[data-explorar]').forEach(botao => botao.addEventListener('click', () => explorar.showModal()));
  explorar.addEventListener('close', () => buscaControle?.abort());
  busca.addEventListener('submit', async evento => {
    evento.preventDefault();
    const nome = campoBusca.value.trim();
    if (!nome) return;
    buscaControle?.abort();
    buscaControle = new AbortController();
    const atual = buscaControle;
    statusBusca.textContent = 'Buscando grupos…';
    resultados.replaceChildren();
    try {
      const grupos = adaptarGrupos(await buscarGrupos(nome, { signal: atual.signal }));
      if (atual.signal.aborted) return;
      statusBusca.textContent = grupos.length === 1 ? '1 grupo encontrado.' : grupos.length ? `${grupos.length} grupos encontrados.` : 'Nenhum grupo encontrado com esse nome.';
      grupos.forEach(grupo => {
        const linha = document.createElement('article');
        linha.className = 'grupo-explorar';
        const texto = document.createElement('div');
        const titulo = document.createElement('h3');
        titulo.textContent = grupo.nome;
        const tag = document.createElement('p');
        tag.textContent = grupo.tag ? `#${grupo.tag}` : '';
        texto.append(titulo, tag);
        const botao = document.createElement('button');
        botao.className = 'botao pequeno';
        botao.type = 'button';
        botao.disabled = dados.grupos.some(item => item.id === grupo.id);
        botao.textContent = botao.disabled ? 'Você já participa' : 'Entrar';
        botao.addEventListener('click', () => {
          grupoSelecionado = grupo;
          document.querySelector('#nome-grupo-entrada').textContent = `Entrar em ${grupo.nome}`;
          formEntrada.reset();
          statusEntrada.textContent = '';
          explorar.close();
          entrada.showModal();
        });
        linha.append(texto, botao);
        resultados.append(linha);
      });
    } catch (erro) {
      if (!atual.signal.aborted && !tratarSessaoExpirada(erro)) statusBusca.textContent = erro.message;
    }
  });
  formEntrada.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (entrando || !grupoSelecionado) return;
    const botao = formEntrada.querySelector('[type="submit"]');
    entrando = true;
    botao.disabled = true;
    statusEntrada.textContent = 'Entrando no grupo…';
    try {
      await entrarGrupo({ id_grupo: grupoSelecionado.id, tag_grupo: grupoSelecionado.tag, senha: senhaEntrada.value });
      formEntrada.reset();
      entrada.close();
      await recarregar();
    } catch (erro) {
      if (!tratarSessaoExpirada(erro)) statusEntrada.textContent = erro.message;
    } finally {
      entrando = false;
      botao.disabled = false;
    }
  });

  const criar = document.querySelector('#dialogo-criar-grupo');
  const formulario = document.querySelector('#form-criar-grupo');
  const nomeGrupo = document.querySelector('#nome-grupo');
  const senhaGrupo = document.querySelector('#senha-grupo');
  const statusCriar = document.querySelector('#status-criar-grupo');
  let criando = false;
  document.querySelectorAll('[data-criar-grupo]').forEach(botao => botao.addEventListener('click', () => {
    statusCriar.textContent = '';
    criar.showModal();
  }));
  nomeGrupo.addEventListener('input', () => nomeGrupo.setCustomValidity(''));
  formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (criando) return;
    if (!nomeGrupo.value.trim()) {
      nomeGrupo.setCustomValidity('Digite um nome para o grupo.');
      nomeGrupo.reportValidity();
      return;
    }
    criando = true;
    const botao = formulario.querySelector('[type="submit"]');
    botao.disabled = true;
    statusCriar.textContent = 'Criando grupo…';
    try {
      await cadastrarGrupo({ nome: nomeGrupo.value.trim(), senha: senhaGrupo.value });
      formulario.reset();
      criar.close();
      await recarregar();
    } catch (erro) {
      if (!tratarSessaoExpirada(erro)) statusCriar.textContent = erro.message;
    } finally {
      criando = false;
      botao.disabled = false;
    }
  });
}
