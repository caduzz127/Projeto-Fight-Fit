import { authConfig } from './config.js';
const $ = (id) => document.getElementById(id);
let mode = 'login';
let pending = false;
const tabs = [$('login-tab'), $('register-tab')];
function setMode(next) {
  if (pending) return;
  mode = next;
  const register = mode === 'register';
  tabs.forEach((tab, index) => {
    const active = index === (register ? 1 : 0);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  $('auth-panel').setAttribute('aria-labelledby', register ? 'register-tab' : 'login-tab');
  $('form-title').textContent = register ? 'Comece sua evolução.' : 'Bom ter você de volta.';
  $('form-description').textContent = register ? 'Crie sua conta e dê o primeiro passo no Fight Fit.' : 'Entre na sua conta e continue de onde parou.';
  $('step').textContent = register ? 'SEU PRIMEIRO PASSO' : 'SEU ESPAÇO DE EVOLUÇÃO';
  $('confirmation').hidden = !register;
  $('confirm-password').disabled = !register;
  $('confirm-password').required = register;
  $('password').autocomplete = register ? 'new-password' : 'current-password';
  $('submit-label').textContent = register ? 'Criar minha conta' : 'Entrar na minha conta';
  $('switch-description').textContent = register ? 'Já tem uma conta?' : 'Ainda não faz parte?';
  $('switch-mode').textContent = register ? 'Entre na sua conta' : 'Crie sua conta';
  $('auth-form').reset();
  $('confirm-password').setCustomValidity('');
  document.querySelectorAll('.reveal').forEach(button => {
    button.previousElementSibling.type = 'password';
    button.textContent = 'Mostrar';
    button.setAttribute('aria-pressed', 'false');
  });
  $('status').textContent = '';
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setMode(index ? 'register' : 'login'));
  tab.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
      setMode(target ? 'register' : 'login');
      if (!pending) tabs[target].focus();
    }
  });
});
$('switch-mode').addEventListener('click', () => { setMode(mode === 'login' ? 'register' : 'login'); if (!pending) $('username').focus(); });
document.querySelectorAll('.reveal').forEach(button => button.addEventListener('click', () => {
  const input = button.previousElementSibling;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.textContent = show ? 'Ocultar' : 'Mostrar';
  button.setAttribute('aria-pressed', String(show));
  button.setAttribute('aria-label', `${show ? 'Ocultar' : 'Mostrar'} ${input.id === 'password' ? 'senha' : 'confirmação da senha'}`);
}));
function validateConfirmation() {
  $('confirm-password').setCustomValidity(mode === 'register' && $('password').value !== $('confirm-password').value ? 'As senhas precisam ser iguais.' : '');
}
$('password').addEventListener('input', validateConfirmation);
$('confirm-password').addEventListener('input', validateConfirmation);
$('auth-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (pending) return;
  validateConfirmation();
  if (!$('auth-form').reportValidity()) return;
  const username = $('username').value.trim();
  if (!username) { $('status').textContent = 'Informe seu nome de usuário.'; $('username').focus(); return; }
  const path = mode === 'login' ? authConfig.loginPath : authConfig.registerPath;
  $('status').dataset.kind = 'error';
  if (!path) {
    $('status').textContent = 'A conexão com o servidor ainda está sendo preparada. Tente novamente quando estiver disponível.';
    return;
  }
  pending = true;
  const submit = document.querySelector('.submit');
  submit.disabled = true;
  $('auth-form').setAttribute('aria-busy', 'true');
  $('status').textContent = mode === 'login' ? 'Entrando…' : 'Criando sua conta…';
  try {
    const response = await fetch(`${authConfig.baseUrl}${path}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, senha: $('password').value }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      const messages = { 400: 'Confira os dados informados.', 401: 'Usuário ou senha inválidos.', 403: 'Acesso não autorizado.', 409: 'Este nome de usuário já está em uso.', 429: 'Muitas tentativas. Aguarde um pouco e tente novamente.' };
      throw new Error(messages[response.status] || 'O servidor não conseguiu concluir a solicitação. Tente novamente.');
    }
    $('password').value = '';
    $('confirm-password').value = '';
    $('status').dataset.kind = 'success';
    $('status').textContent = mode === 'register' ? 'Conta criada! Entre com seu usuário e senha.' : 'Login realizado com sucesso.';
  } catch (error) {
    $('status').textContent = error.name === 'TimeoutError' ? 'O servidor demorou para responder. Tente novamente.' : error instanceof TypeError ? 'Não foi possível conectar ao servidor. Tente novamente.' : error.message;
  } finally {
    pending = false;
    submit.disabled = false;
    $('auth-form').removeAttribute('aria-busy');
  }
});
$('year').textContent = new Date().getFullYear();
