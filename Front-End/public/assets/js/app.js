import { authenticate, getAuthErrorMessage } from './auth-service.js';

const elements = {
  form: document.getElementById('auth-form'),
  panel: document.getElementById('auth-panel'),
  title: document.getElementById('form-title'),
  description: document.getElementById('form-description'),
  step: document.getElementById('step'),
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  confirmation: document.getElementById('confirmation'),
  confirmPassword: document.getElementById('confirm-password'),
  status: document.getElementById('status'),
  submitButton: document.querySelector('.submit'),
  submitLabel: document.getElementById('submit-label'),
  switchDescription: document.getElementById('switch-description'),
  switchButton: document.getElementById('switch-mode'),
  tabs: [
    document.getElementById('login-tab'),
    document.getElementById('register-tab'),
  ],
  passwordButtons: document.querySelectorAll('.reveal'),
};

const SCREEN_CONTENT = {
  login: {
    title: 'Bom ter você de volta.',
    description: 'Entre na sua conta e continue de onde parou.',
    step: 'SEU ESPAÇO DE EVOLUÇÃO',
    submitLabel: 'Entrar na minha conta',
    switchDescription: 'Ainda não faz parte?',
    switchLabel: 'Crie sua conta',
    loadingMessage: 'Entrando…',
    successMessage: 'Login realizado com sucesso.',
  },
  register: {
    title: 'Comece sua evolução.',
    description: 'Crie sua conta e dê o primeiro passo no Fight Fit.',
    step: 'SEU PRIMEIRO PASSO',
    submitLabel: 'Criar minha conta',
    switchDescription: 'Já tem uma conta?',
    switchLabel: 'Entre na sua conta',
    loadingMessage: 'Criando sua conta…',
    successMessage: 'Conta criada! Entre com seu usuário e senha.',
  },
};

let currentMode = 'login';
let isSubmitting = false;

function showStatus(message, kind = 'error') {
  elements.status.textContent = message;
  elements.status.dataset.kind = kind;
}

function updateScreenContent() {
  const content = SCREEN_CONTENT[currentMode];

  elements.title.textContent = content.title;
  elements.description.textContent = content.description;
  elements.step.textContent = content.step;
  elements.submitLabel.textContent = content.submitLabel;
  elements.switchDescription.textContent = content.switchDescription;
  elements.switchButton.textContent = content.switchLabel;
}

function updateTabs() {
  const activeTabIndex = currentMode === 'register' ? 1 : 0;

  elements.tabs.forEach((tab, index) => {
    const isActive = index === activeTabIndex;

    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  elements.panel.setAttribute(
    'aria-labelledby',
    elements.tabs[activeTabIndex].id
  );
}

function setPasswordVisibility(button, isVisible) {
  const input = button.previousElementSibling;
  const action = isVisible ? 'Ocultar' : 'Mostrar';
  const label = input === elements.password ? 'senha' : 'confirmação da senha';

  input.type = isVisible ? 'text' : 'password';
  button.textContent = action;
  button.setAttribute('aria-pressed', String(isVisible));
  button.setAttribute('aria-label', `${action} ${label}`);
}

function resetForm() {
  elements.form.reset();
  elements.confirmPassword.setCustomValidity('');
  showStatus('');

  elements.passwordButtons.forEach(button => {
    setPasswordVisibility(button, false);
  });
}

function changeMode(mode) {
  if (isSubmitting) {
    return;
  }

  currentMode = mode;
  const isRegistering = currentMode === 'register';

  updateScreenContent();
  updateTabs();
  resetForm();

  elements.confirmation.hidden = !isRegistering;
  elements.confirmPassword.disabled = !isRegistering;
  elements.confirmPassword.required = isRegistering;
  elements.password.autocomplete = isRegistering
    ? 'new-password'
    : 'current-password';
}

function handleModeSwitch() {
  if (isSubmitting) {
    return;
  }

  const nextMode = currentMode === 'login' ? 'register' : 'login';

  changeMode(nextMode);
  elements.username.focus();
}

function handleTabKeydown(event, tabIndex) {
  const supportedKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

  if (!supportedKeys.includes(event.key)) {
    return;
  }

  event.preventDefault();

  if (isSubmitting) {
    return;
  }

  let nextTabIndex = 1 - tabIndex;

  if (event.key === 'Home') {
    nextTabIndex = 0;
  } else if (event.key === 'End') {
    nextTabIndex = 1;
  }

  changeMode(nextTabIndex === 0 ? 'login' : 'register');
  elements.tabs[nextTabIndex].focus();
}

function validatePasswordConfirmation() {
  const isRegistering = currentMode === 'register';
  const passwordsMatch = elements.password.value === elements.confirmPassword.value;
  let message = '';

  if (isRegistering && !passwordsMatch) {
    message = 'As senhas precisam ser iguais.';
  }

  elements.confirmPassword.setCustomValidity(message);
}

function validateForm() {
  validatePasswordConfirmation();

  if (!elements.form.reportValidity()) {
    return false;
  }

  if (!elements.username.value.trim()) {
    showStatus('Informe seu nome de usuário.');
    elements.username.focus();
    return false;
  }

  return true;
}

function setSubmitting(value) {
  isSubmitting = value;
  elements.submitButton.disabled = value;

  if (value) {
    elements.form.setAttribute('aria-busy', 'true');
  } else {
    elements.form.removeAttribute('aria-busy');
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  if (isSubmitting || !validateForm()) {
    return;
  }

  const credentials = {
    username: elements.username.value.trim(),
    senha: elements.password.value,
  };
  const content = SCREEN_CONTENT[currentMode];

  setSubmitting(true);
  showStatus(content.loadingMessage, 'loading');

  try {
    await authenticate(currentMode, credentials);

    elements.password.value = '';
    elements.confirmPassword.value = '';
    showStatus(content.successMessage, 'success');
  } catch (error) {
    showStatus(getAuthErrorMessage(error));
  } finally {
    setSubmitting(false);
  }
}

function bindEvents() {
  elements.tabs.forEach((tab, index) => {
    const mode = index === 0 ? 'login' : 'register';

    tab.addEventListener('click', () => changeMode(mode));
    tab.addEventListener('keydown', event => handleTabKeydown(event, index));
  });

  elements.passwordButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isHidden = button.previousElementSibling.type === 'password';
      setPasswordVisibility(button, isHidden);
    });
  });

  elements.switchButton.addEventListener('click', handleModeSwitch);
  elements.password.addEventListener('input', validatePasswordConfirmation);
  elements.confirmPassword.addEventListener('input', validatePasswordConfirmation);
  elements.form.addEventListener('submit', handleSubmit);
}

bindEvents();
document.getElementById('year').textContent = new Date().getFullYear();
