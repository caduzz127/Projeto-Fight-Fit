import { atualizarGrupo } from '../../api/grupos/atualizar.js';
import { excluirGrupo } from '../../api/grupos/excluir.js';
import { sairGrupo } from '../../api/grupos/sair.js';
import { adaptarGrupo } from '../../dados/adaptar-principal.js';
import { tratarSessaoExpirada } from '../compartilhado/autenticacao-principal.js';
import { ICONE_ENGRENAGEM } from '../compartilhado/icones.js';

function mostrarStatus(elemento, texto, erro = false) {
  elemento.textContent = texto;
  if (erro) elemento.dataset.tipo = 'erro';
  else delete elemento.dataset.tipo;
}

// Engrenagem do grupo: administradores editam nome e senha, o dono pode excluir
// e quem não é dono pode sair. Cada um só vê o que pode fazer.
export function iniciarConfiguracoes({ grupo, souAdmin, souDono, aoAtualizar }) {
  const abrir = document.querySelector('#abrir-configuracoes');
  const dialogo = document.querySelector('#dialogo-configuracoes');
  const formEditar = document.querySelector('#form-editar-grupo');
  const formExcluir = document.querySelector('#form-excluir-grupo');
  const areaSair = document.querySelector('#area-sair-grupo');
  const botaoSair = document.querySelector('#sair-grupo');
  const anuncio = document.querySelector('#anuncio');
  let ocupado = false;
  let confirmandoSaida = false;

  abrir.innerHTML = ICONE_ENGRENAGEM;
  formEditar.hidden = !souAdmin;
  formExcluir.hidden = !souDono;
  areaSair.hidden = souDono;

  function bloquear(elementos, bloqueado) {
    ocupado = bloqueado;
    elementos.forEach(elemento => { elemento.disabled = bloqueado; });
  }

  abrir.addEventListener('click', () => {
    formEditar.reset();
    formExcluir.reset();
    formEditar.elements.nome.value = grupo.nome;
    [formEditar, formExcluir, areaSair].forEach(area => mostrarStatus(area.querySelector('.status-cartao'), ''));
    confirmandoSaida = false;
    botaoSair.textContent = 'Sair do grupo';
    dialogo.showModal();
    (souAdmin ? formEditar.elements.nome : botaoSair).focus();
  });
  dialogo.addEventListener('cancel', evento => { if (ocupado) evento.preventDefault(); });
  dialogo.addEventListener('input', evento => evento.target.setCustomValidity?.(''));

  formEditar.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (ocupado) return;
    const { nome, senhaAntiga, senhaNova } = formEditar.elements;
    nome.setCustomValidity(nome.value.trim() ? '' : 'Digite o nome do grupo.');
    senhaAntiga.setCustomValidity(senhaAntiga.value ? '' : 'Digite a senha atual do grupo.');
    if (!formEditar.reportValidity()) return;
    const status = formEditar.querySelector('.status-cartao');
    const controles = [...formEditar.elements];
    bloquear(controles, true);
    mostrarStatus(status, 'Salvando…');
    try {
      // O back-end sempre grava uma senha nova; em branco, reenviamos a atual.
      const atualizado = adaptarGrupo(await atualizarGrupo({
        idGrupo: grupo.id, nome: nome.value.trim(), senhaAntiga: senhaAntiga.value,
        senhaNova: senhaNova.value || senhaAntiga.value,
      }));
      grupo.nome = atualizado.nome;
      bloquear(controles, false);
      dialogo.close();
      aoAtualizar(atualizado);
      anuncio.textContent = 'Grupo atualizado.';
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      bloquear(controles, false);
      mostrarStatus(status, erro.message, true);
    }
  });

  formExcluir.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (ocupado) return;
    const senha = formExcluir.elements.senha;
    senha.setCustomValidity(senha.value ? '' : 'Digite a senha do grupo.');
    if (!formExcluir.reportValidity()) return;
    const status = formExcluir.querySelector('.status-cartao');
    const controles = [...formExcluir.elements];
    bloquear(controles, true);
    mostrarStatus(status, 'Excluindo grupo…');
    try {
      await excluirGrupo({ idGrupo: grupo.id, senha: senha.value });
      location.replace('grupos.html');
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      bloquear(controles, false);
      mostrarStatus(status, erro.message, true);
    }
  });

  // Sair pede um segundo clique para confirmar.
  botaoSair.addEventListener('click', async () => {
    if (ocupado) return;
    const status = areaSair.querySelector('.status-cartao');
    if (!confirmandoSaida) {
      confirmandoSaida = true;
      botaoSair.textContent = 'Confirmar saída';
      mostrarStatus(status, 'Clique de novo para sair do grupo.');
      return;
    }
    bloquear([botaoSair], true);
    mostrarStatus(status, 'Saindo do grupo…');
    try {
      await sairGrupo(grupo.id);
      location.replace('grupos.html');
    } catch (erro) {
      if (tratarSessaoExpirada(erro)) return;
      bloquear([botaoSair], false);
      mostrarStatus(status, erro.message, true);
    }
  });
}
