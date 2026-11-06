import test from 'node:test';
import assert from 'node:assert/strict';
import { login } from '../public/assets/js/api/index/login.js';
import { cadastrar } from '../public/assets/js/api/index/cadastro.js';
import { definirSessao, obterSessao } from '../public/assets/js/api/sessao.js';

test('login envia o contrato público e retorna usuário e token', async t => {
  t.mock.method(globalThis, 'fetch', async (url, opcoes) => {
    assert.equal(url, 'http://localhost:8080/fight-fit/usuarios/login');
    assert.equal(opcoes.method, 'POST');
    assert.equal(opcoes.credentials, 'omit');
    assert.equal(opcoes.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(opcoes.body), { username: 'teste', senha: 'senha-teste' });
    assert.equal(opcoes.headers.Authorization, undefined);
    return Response.json({ username: 'teste', token: 'token-de-teste' });
  });
  assert.deepEqual(await login({ username: 'teste', senha: 'senha-teste' }), {
    username: 'teste', token: 'token-de-teste',
  });
});

test('cadastro envia nome, não username, e aceita resposta 204 vazia', async t => {
  t.mock.method(globalThis, 'fetch', async (url, opcoes) => {
    assert.equal(url, 'http://localhost:8080/fight-fit/usuarios/cadastrar');
    assert.deepEqual(JSON.parse(opcoes.body), { nome: 'teste', senha: 'senha-teste' });
    return new Response(null, { status: 204 });
  });
  assert.equal(await cadastrar({ nome: 'teste', senha: 'senha-teste' }), undefined);
});

test('login rejeita token ausente, falhas HTTP e JSON inválido', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ username: 'teste' }));
  await assert.rejects(login({}), /dados necessários/);
  fetch.mock.mockImplementation(async () => new Response(null, { status: 401 }));
  await assert.rejects(login({}), /Usuário ou senha inválidos/);
  fetch.mock.mockImplementation(async () => new Response('inválido', { status: 200 }));
  await assert.rejects(login({}), /resposta inválida/);
});

test('cadastro apresenta a mensagem de duplicidade do backend', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({
    error: 400, mensage: 'já existe um usuário com esse username',
  }, { status: 400 }));
  await assert.rejects(cadastrar({}), /Este nome de usuário já está em uso/);
});

test('falhas de rede e servidor têm mensagens úteis sem detalhes internos', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(login({}), /Não foi possível conectar/);
  fetch.mock.mockImplementation(async () => Response.json({ mensage: 'detalhe interno' }, { status: 500 }));
  await assert.rejects(cadastrar({}), /O servidor não conseguiu/);
});

test('cancelamento do formulário cancela o fetch', async t => {
  t.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    signal.throwIfAborted();
  });
  const controle = new AbortController();
  controle.abort();
  await assert.rejects(login({}, { signal: controle.signal }), { name: 'AbortError' });
});

test('timeout apresenta mensagem sem depender de uma espera real', async t => {
  t.mock.method(AbortSignal, 'timeout', () => AbortSignal.abort(new DOMException('Timeout', 'TimeoutError')));
  t.mock.method(globalThis, 'fetch', async (url, { signal }) => signal.throwIfAborted());
  await assert.rejects(login({}), /O servidor demorou para responder/);
});

test('sessão é copiada e pode ser encerrada', () => {
  definirSessao({ username: 'teste', token: 'token-de-teste' });
  const copia = obterSessao();
  copia.token = 'alterado';
  assert.equal(obterSessao().token, 'token-de-teste');
  definirSessao(null);
  assert.equal(obterSessao(), null);
});
