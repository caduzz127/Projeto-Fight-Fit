import { atualizarUsuario } from '../../api/usuarios/atualizar.js';
import { excluirUsuario } from '../../api/usuarios/excluir.js';
import { definirSessao, obterSessao } from '../../api/sessao.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';

function mostrarStatus(elemento, texto, tipo) {
  elemento.textContent = texto;
  if (tipo) elemento.dataset.tipo = tipo;
  else delete elemento.dataset.tipo;
}

// Edição e exclusão da conta no próprio cartão: os dados viram formulário ao clicar em Editar,
// e Excluir abre a confirmação por senha no mesmo lugar.
export function iniciarConta({ aoAtualizar }) {
  const visualizar = document.querySelector('#visualizar-conta');
  const statusVisualizar = document.querySelector('#status-visualizar');
  const editar = document.querySelector('#editar-conta');
  const excluir = document.querySelector('#excluir-conta');
  const formulario = document.querySelector('#form-conta');
  const statusConta = document.querySelector('#status-conta');
  const formExcluir = document.querySelector('#form-excluir');
  const statusExcluir = document.querySelector('#status-excluir');
  const anuncio = document.querySelector('#anuncio');
  const campos = formulario.elements;
  let ocupado = false;

  function abrir(painel) {
    visualizar.hidden = painel !== null;
    formulario.hidden = painel !== formulario;
    formExcluir.hidden = painel !== formExcluir;
    mostrarStatus(statusVisualizar, '');
    mostrarStatus(statusConta, '');
    mostrarStatus(statusExcluir, '');
    formulario.reset();
    formExcluir.reset();
    [...formulario.elements, ...formExcluir.elements].forEach(campo => campo.setCustomValidity?.(''));
    if (painel === formulario) {
      campos.username.value = obterSessao()?.username || '';
      campos.username.focus();
    }
    if (painel === formExcluir) formExcluir.elements.senha.focus();
  }

  function fechar(foco) {
    abrir(null);
    foco.focus();
  }

  editar.addEventListener('click', () => abrir(formulario));
  excluir.addEventListener('click', () => abrir(formExcluir));
  document.querySelector('#cancelar-edicao').addEventListener('click', () => { if (!ocupado) fechar(editar); });
  document.querySelector('#cancelar-exclusao').addEventListener('click', () => { if (!ocupado) fechar(excluir); });
  formulario.addEventListener('keydown', evento => { if (evento.key === 'Escape' && !ocupado) fechar(editar); });
  formExcluir.addEventListener('keydown', evento => { if (evento.key === 'Escape' && !ocupado) fechar(excluir); });
  formulario.addEventListener('input', evento => evento.target.setCustomValidity(''));
  formExcluir.addEventListener('input', evento => evento.target.setCustomValidity(''));

  formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (ocupado) return;
    const sessao = obterSessao();
    const usernameNovo = campos.username.value.trim();
    const senhaNova = campos.senhaNova.value;
    campos.username.setCustomValidity(usernameNovo ? '' : 'Digite o nome de usuário.');
    campos.confirmacao.setCustomValidity(senhaNova && campos.confirmacao.value !== senhaNova ? 'As senhas não coincidem.' : '');
    campos.senhaAtual.setCustomValidity(campos.senhaAtual.value ? '' : 'Digite sua senha atual.');
    if (!formulario.reportValidity()) return;
    if (usernameNovo === sessao.username && !senhaNova) {
      fechar(editar);
      return;
    }

    const controles = [...formulario.elements];
    ocupado = true;
    controles.forEach(controle => { controle.disabled = true; });
    mostrarStatus(statusConta, 'Salvando…');
    try {
      // O back-end sempre pede uma senha nova; sem troca, reenviamos a atual.
      const resposta = await atualizarUsuario({
        username: sessao.username, usernameNovo,
        senhaAntiga: campos.senhaAtual.value, senhaNova: senhaNova || campos.senhaAtual.value,
      });
      const token = typeof resposta?.token === 'string' && resposta.token ? resposta.token : sessao.token;
      definirSessao({ username: usernameNovo, token });
      controles.forEach(controle => { controle.disabled = false; });
      abrir(null);
      aoAtualizar(usernameNovo);
      mostrarStatus(statusVisualizar, 'Alterações salvas.', 'sucesso');
      anuncio.textContent = 'Alterações salvas.';
      editar.focus();
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      controles.forEach(controle => { controle.disabled = false; });
      mostrarStatus(statusConta, erro.message, 'erro');
    } finally {
      ocupado = false;
    }
  });

  formExcluir.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (ocupado) return;
    const senha = formExcluir.elements.senha;
    senha.setCustomValidity(senha.value ? '' : 'Digite sua senha.');
    if (!formExcluir.reportValidity()) return;
    const controles = [...formExcluir.elements];
    ocupado = true;
    controles.forEach(controle => { controle.disabled = true; });
    mostrarStatus(statusExcluir, 'Excluindo conta…');
    try {
      await excluirUsuario(senha.value);
      definirSessao(null);
      location.replace('index.html?motivo=conta-excluida');
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      controles.forEach(controle => { controle.disabled = false; });
      mostrarStatus(statusExcluir, erro.message, 'erro');
      ocupado = false;
    }
  });
}
