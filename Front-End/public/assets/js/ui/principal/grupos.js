import { detalharGrupo } from '../../api/grupos/detalhar.js';
import { buscarGrupos } from '../../api/grupos/buscar.js';
import { cadastrarGrupo } from '../../api/grupos/cadastrar.js';
import { entrarGrupo } from '../../api/grupos/entrar.js';
import { adaptarGrupo, adaptarGrupos } from '../../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';

export function iniciarGrupos(dados, recarregar) {
  const detalhes = document.querySelector('#dialogo-grupo');
  const statusDetalhes = document.querySelector('#status-detalhes-grupo');
  const membros = document.querySelector('#lista-integrantes');
  let detalheControle;
  detalhes.addEventListener('close', () => detalheControle?.abort());
  document.addEventListener('click', async evento => {
    const botao = evento.target.closest('[data-grupo]');
    if (!botao) return;
    const grupo = dados.grupos.find(item => item.id === botao.dataset.grupo);
    if (!grupo) return;
    detalheControle?.abort();
    detalheControle = new AbortController();
    const atual = detalheControle;
    document.querySelector('#titulo-dialogo-grupo').textContent = grupo.nome;
    document.querySelector('#tag-dialogo-grupo').textContent = grupo.tag ? `#${grupo.tag}` : '';
    membros.replaceChildren();
    statusDetalhes.textContent = 'Carregando integrantes…';
    detalhes.showModal();
    try {
      const resposta = await detalharGrupo(grupo.id, { signal: atual.signal });
      const completo = adaptarGrupo(resposta);
      if (atual.signal.aborted) return;
      document.querySelector('#titulo-dialogo-grupo').textContent = completo.nome;
      document.querySelector('#tag-dialogo-grupo').textContent = completo.tag ? `#${completo.tag}` : '';
      statusDetalhes.textContent = completo.membros.length === 1 ? '1 integrante' : `${completo.membros.length} integrantes`;
      resposta.usuarios.forEach(usuario => {
        const item = document.createElement('li');
        const nome = document.createElement('span');
        nome.textContent = usuario.nome;
        const cargo = document.createElement('small');
        cargo.textContent = ['SYSTEM_ROOT_GROUP_ADMIN', 'SYSTEM_GROUP_ADMIN'].includes(usuario.cargo) ? 'Administrador' : 'Integrante';
        item.append(nome, cargo);
        membros.append(item);
      });
    } catch (erro) {
      if (!atual.signal.aborted && !tratarSessaoExpirada(erro)) statusDetalhes.textContent = erro.message;
    }
  });

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
