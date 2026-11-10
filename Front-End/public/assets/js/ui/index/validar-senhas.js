export function iniciarValidacaoSenhas() {
  const formulario = document.querySelector('#auth-form');
  const senha = document.querySelector('#password');
  const confirmacao = document.querySelector('#confirm-password');

  function validar() {
    const divergente = !confirmacao.disabled && confirmacao.value !== '' &&
      confirmacao.value !== senha.value;
    confirmacao.setCustomValidity(divergente ? 'As senhas não coincidem.' : '');
  }

  senha.addEventListener('input', validar);
  confirmacao.addEventListener('input', validar);
  formulario.addEventListener('modoalterado', validar);
}
