import { authConfig } from './config.js';

const REQUEST_TIMEOUT_MS = 15000;

const HTTP_ERROR_MESSAGES = {
  400: 'Confira os dados informados.',
  401: 'Usuário ou senha inválidos.',
  403: 'Acesso não autorizado.',
  409: 'Este nome de usuário já está em uso.',
  429: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
};

function getEndpoint(mode) {
  if (mode === 'register') {
    return authConfig.registerPath;
  }

  return authConfig.loginPath;
}

export async function authenticate(mode, credentials) {
  const endpoint = getEndpoint(mode);

  if (!endpoint) {
    throw new Error(
      'A conexão com o servidor ainda está sendo preparada. ' +
      'Tente novamente quando estiver disponível.'
    );
  }

  const response = await fetch(`${authConfig.baseUrl}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const message = HTTP_ERROR_MESSAGES[response.status] ||
      'O servidor não conseguiu concluir a solicitação. Tente novamente.';

    throw new Error(message);
  }
}

export function getAuthErrorMessage(error) {
  if (error.name === 'TimeoutError') {
    return 'O servidor demorou para responder. Tente novamente.';
  }

  if (error instanceof TypeError) {
    return 'Não foi possível conectar ao servidor. Tente novamente.';
  }

  return error.message;
}
