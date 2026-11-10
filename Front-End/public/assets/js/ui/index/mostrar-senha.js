export function iniciarMostrarSenha() {
  const formulario = document.querySelector('#auth-form');

  document.querySelectorAll('.reveal').forEach(botao => {
    const campo = botao.closest('.password-field').querySelector('input');
    const descricao = campo.id === 'confirm-password' ? 'confirmação da senha' : 'senha';
    botao.setAttribute('aria-controls', campo.id);

    function definirVisibilidade(visivel) {
      campo.type = visivel ? 'text' : 'password';
      botao.textContent = visivel ? 'Ocultar' : 'Mostrar';
      botao.setAttribute('aria-pressed', String(visivel));
      botao.setAttribute('aria-label', `${visivel ? 'Ocultar' : 'Mostrar'} ${descricao}`);
    }

    botao.addEventListener('click', () => definirVisibilidade(campo.type === 'password'));
    formulario.addEventListener('modoalterado', () => definirVisibilidade(false));
  });
}
