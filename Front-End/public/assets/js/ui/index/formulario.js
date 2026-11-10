import { login } from '../../api/index/login.js';
import { cadastrar } from '../../api/index/cadastro.js';
import { definirSessao } from '../../api/sessao.js';

export function iniciarFormulario() {
  const formulario = document.querySelector('#auth-form');
  const status = document.querySelector('#status');
  const botao = formulario.querySelector('.submit');
  const senha = document.querySelector('#password');
  const confirmacao = document.querySelector('#confirm-password');
  let requisicao = null;
  queueMicrotask(() => {
    if (new URLSearchParams(location.search).get('motivo') === 'sessao') {
      status.dataset.kind = 'info';
      status.textContent = 'Sua sessão expirou ou não está disponível. Entre novamente.';
    }
  });

  function limparMensagens() {
    status.textContent = '';
    delete status.dataset.kind;
    formulario.querySelectorAll('[aria-invalid]').forEach(campo => {
      campo.removeAttribute('aria-invalid');
    });
  }

  formulario.addEventListener('input', () => {
    if (!requisicao) limparMensagens();
  });
  formulario.addEventListener('modoalterado', () => {
    requisicao?.abort();
    requisicao = null;
    botao.disabled = false;
    formulario.removeAttribute('aria-busy');
    limparMensagens();
  });
  formulario.addEventListener('invalid', evento => {
    evento.target.setAttribute('aria-invalid', 'true');
    // Mantém a mensagem do primeiro campo inválido, que recebe o foco nativo.
    if (evento.target === formulario.querySelector(':invalid')) {
      status.textContent = evento.target.validationMessage;
      status.dataset.kind = 'error';
    }
  }, true);

  formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (requisicao) return;
    limparMensagens();
    const cadastro = formulario.dataset.modo === 'cadastro';
    const username = document.querySelector('#username').value;
    const senhaEnviada = senha.value;
    const controle = new AbortController();
    requisicao = controle;
    definirSessao(null);
    botao.disabled = true;
    formulario.setAttribute('aria-busy', 'true');
    status.dataset.kind = 'info';
    status.textContent = cadastro ? 'Criando sua conta…' : 'Entrando…';

    try {
      if (cadastro) {
        await cadastrar({ nome: username, senha: senhaEnviada }, { signal: controle.signal });
      } else {
        const usuario = await login({ username, senha: senhaEnviada }, { signal: controle.signal });
        if (requisicao !== controle) return;
        definirSessao(usuario);
      }
      if (requisicao !== controle) return;
      senha.value = '';
      confirmacao.value = '';
      confirmacao.setCustomValidity('');
      status.dataset.kind = 'success';
      status.textContent = cadastro
        ? 'Conta criada com sucesso! Entre na aba Entrar para acessar sua conta.'
        : 'Login realizado com sucesso!';
      if (!cadastro) location.assign('pagina_principal.html');
    } catch (erro) {
      if (requisicao !== controle) return;
      status.dataset.kind = 'error';
      status.textContent = erro.message;
    } finally {
      if (requisicao === controle) {
        requisicao = null;
        botao.disabled = false;
        formulario.removeAttribute('aria-busy');
      }
    }
  });
}
