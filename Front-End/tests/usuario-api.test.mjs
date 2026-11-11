import test from 'node:test';
import assert from 'node:assert/strict';
import { definirSessao, obterCargo } from '../public/assets/js/api/sessao.js';
import { atualizarUsuario } from '../public/assets/js/api/usuarios/atualizar.js';
import { excluirUsuario } from '../public/assets/js/api/usuarios/excluir.js';

const API = 'http://localhost:8080/fight-fit';
const token = `e30.${Buffer.from(JSON.stringify({ sub: '326efbc6-4844-451f-8245-679af26b8a24', roles: 'SYSTEM_ADMIN', exp: Math.floor(Date.now() / 1000) + 600 })).toString('base64url')}.x`;

function entrar(t, resposta) {
  definirSessao({ username: 'admin', token });
  t.after(() => definirSessao(null));
  const chamadas = [];
  t.mock.method(globalThis, 'fetch', async (url, opcoes) => {
    chamadas.push({ url, metodo: opcoes.method, corpo: opcoes.body, tipo: opcoes.headers['Content-Type'] });
    return resposta();
  });
  return chamadas;
}

test('atualizar envia username, senhaAntiga e senhaNova (vazia mantém a senha)', async t => {
  const chamadas = entrar(t, () => Response.json({ username: 'SYSTEM_USER', token: 'novo' }));
  await atualizarUsuario({ username: 'carlos', senhaAntiga: 'a', senhaNova: 'b' });
  await atualizarUsuario({ username: 'carlos', senhaAntiga: 'a' });
  assert.equal(chamadas[0].url, `${API}/usuarios/atualizar`);
  assert.equal(chamadas[0].metodo, 'PUT');
  assert.equal(chamadas[0].tipo, 'application/json');
  assert.deepEqual(JSON.parse(chamadas[0].corpo), { username: 'carlos', senhaAntiga: 'a', senhaNova: 'b' });
  assert.deepEqual(JSON.parse(chamadas[1].corpo), { username: 'carlos', senhaAntiga: 'a', senhaNova: '' });
});

test('atualizar traduz nome em uso e senha incorreta', async t => {
  entrar(t, () => Response.json({ status: 400, mensage: 'já existe um usuário com esse username!' }, { status: 400 }));
  await assert.rejects(atualizarUsuario({ username: 'b', senhaAntiga: 'c' }), /já está em uso/);
  globalThis.fetch.mock.mockImplementation(async () => Response.json({ status: 404, mensage: 'Senha Incorreta, Verifique a senha!!' }, { status: 404 }));
  await assert.rejects(atualizarUsuario({ username: 'b', senhaAntiga: 'c' }), /Senha atual incorreta/);
});

test('excluir manda a senha como texto puro, sem aspas de JSON', async t => {
  const chamadas = entrar(t, () => new Response(null, { status: 204 }));
  await excluirUsuario('minha senha');
  assert.deepEqual(chamadas, [{ url: `${API}/usuarios/deletar`, metodo: 'DELETE', corpo: 'minha senha', tipo: 'text/plain;charset=UTF-8' }]);
});

test('cargo vem do token', t => {
  definirSessao({ username: 'admin', token });
  t.after(() => definirSessao(null));
  assert.equal(obterCargo(), 'SYSTEM_ADMIN');
});

test('404 sem "senha incorreta" não é mostrado como senha errada', async t => {
  entrar(t, () => Response.json({ status: 404, mensage: 'usuário não existe' }, { status: 404 }));
  await assert.rejects(atualizarUsuario({ username: 'novo', senhaAntiga: 'x' }), erro => !/senha/i.test(erro.message) && /Conta não encontrada/.test(erro.message));
});
