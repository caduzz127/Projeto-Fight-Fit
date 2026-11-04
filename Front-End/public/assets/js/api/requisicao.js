import { API_URL } from './config.js';

export async function enviarJson(caminho, dados, mensagens, signal) {
  const limite = AbortSignal.timeout(15000);
  const sinal = signal ? AbortSignal.any([signal, limite]) : limite;

  try {
    const resposta = await fetch(`${API_URL}${caminho}`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(dados),
      signal: sinal,
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      // Não exibe detalhes internos em falhas do servidor.
      const mensagem = resposta.status >= 500
        ? 'O servidor não conseguiu concluir a solicitação. Tente novamente.'
        : mensagens[resposta.status] || 'Não foi possível concluir a solicitação.';
      // Reconhece o erro de duplicidade sem mostrar SQL ou outros detalhes internos.
      const duplicado = caminho.endsWith('/cadastrar') && resposta.status === 400
        && typeof erro?.mensage === 'string'
        && erro.mensage.toLowerCase().includes('já existe um usuário');
      const detalhe = duplicado ? 'Este nome de usuário já está em uso.' : mensagem;
      throw new Error(detalhe);
    }

    if (resposta.status === 204) return null;
    return await resposta.json();
  } catch (erro) {
    if (sinal.aborted) {
      if (signal?.aborted) throw signal.reason;
      throw new Error('O servidor demorou para responder. Tente novamente.');
    }
    if (erro instanceof TypeError) {
      throw new Error('Não foi possível conectar à API. Confira se o servidor está ativo e permite acesso pelo front-end.');
    }
    if (erro instanceof SyntaxError) {
      throw new Error('O servidor retornou uma resposta inválida. Tente novamente.');
    }
    throw erro;
  }
}
