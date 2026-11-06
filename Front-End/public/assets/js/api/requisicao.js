import { API_URL } from './config.js';
import { obterSessao, definirSessao } from './sessao.js';

export class ErroApi extends Error {
  constructor(mensagem, status = 0) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

export async function requisitarJson(caminho, { metodo = 'GET', dados, mensagens = {}, autenticado = true, signal } = {}) {
  const limite = AbortSignal.timeout(15000);
  const sinal = signal ? AbortSignal.any([signal, limite]) : limite;
  const headers = { Accept: 'application/json' };
  if (dados !== undefined) headers['Content-Type'] = 'application/json';
  if (autenticado) {
    const sessao = obterSessao();
    if (!sessao) throw new ErroApi('Sua sessão expirou. Entre novamente.', 401);
    headers.Authorization = `Bearer ${sessao.token}`;
  }
  try {
    const resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo, credentials: 'omit', headers,
      body: dados === undefined ? undefined : JSON.stringify(dados), signal: sinal,
    });
    if (!resposta.ok) {
      const corpo = await resposta.json().catch(() => null);
      if (autenticado && resposta.status === 401) {
        definirSessao(null);
        throw new ErroApi('Sua sessão expirou. Entre novamente.', 401);
      }
      let mensagem = resposta.status >= 500
        ? 'O servidor não conseguiu concluir a solicitação. Tente novamente.'
        : mensagens[resposta.status] || (resposta.status === 403
          ? 'Você não tem permissão para realizar esta ação.' : 'Não foi possível concluir a solicitação.');
      const detalhe = typeof corpo?.mensage === 'string' ? corpo.mensage.toLowerCase() : '';
      if (resposta.status === 400) {
        if (caminho === '/usuarios/cadastrar' && detalhe.includes('já existe um usuário')) mensagem = 'Este nome de usuário já está em uso.';
        if (caminho === '/grupos/entrar' && detalhe.includes('senha incorreta')) mensagem = 'Senha do grupo incorreta.';
        if (caminho === '/grupos/entrar' && detalhe.includes('já pertence')) mensagem = 'Você já participa deste grupo.';
      }
      throw new ErroApi(mensagem, resposta.status);
    }
    if (resposta.status === 204) return null;
    return await resposta.json();
  } catch (erro) {
    if (sinal.aborted) {
      if (signal?.aborted) throw signal.reason;
      throw new ErroApi('O servidor demorou para responder. Tente novamente.');
    }
    if (erro instanceof TypeError) throw new ErroApi('Não foi possível conectar à API. Confira se o servidor está ativo e permite acesso pelo front-end.');
    if (erro instanceof SyntaxError) throw new ErroApi('O servidor retornou uma resposta inválida. Tente novamente.');
    throw erro;
  }
}

export function enviarJson(caminho, dados, mensagens, signal) {
  return requisitarJson(caminho, { metodo: 'POST', dados, mensagens, signal, autenticado: false });
}
