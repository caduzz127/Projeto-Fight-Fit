// Apenas interação local: não envia dados nem simula autenticação.
export function iniciarFormulario() {
  const formulario = document.querySelector('#auth-form');
  const status = document.querySelector('#status');

  function limparMensagens() {
    status.textContent = '';
    delete status.dataset.kind;
    formulario.querySelectorAll('[aria-invalid]').forEach(campo => {
      campo.removeAttribute('aria-invalid');
    });
  }

  formulario.addEventListener('input', limparMensagens);
  formulario.addEventListener('modoalterado', limparMensagens);
  formulario.addEventListener('invalid', evento => {
    evento.target.setAttribute('aria-invalid', 'true');
    // Mantém a mensagem do primeiro campo inválido, que recebe o foco nativo.
    if (evento.target === formulario.querySelector(':invalid')) {
      status.textContent = evento.target.validationMessage;
      status.dataset.kind = 'error';
    }
  }, true);

  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    limparMensagens();
    status.dataset.kind = 'info';
    status.textContent = 'Esta tela está em demonstração. O envio de dados ainda não está disponível.';
  });
}
