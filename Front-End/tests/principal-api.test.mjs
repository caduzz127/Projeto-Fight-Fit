import test from 'node:test';
import assert from 'node:assert/strict';
import { definirSessao, obterSessao, obterIdUsuario } from '../public/assets/js/api/sessao.js';
import { listarGrupos } from '../public/assets/js/api/grupos/listar.js';
import { listarTreinos } from '../public/assets/js/api/treinos/listar.js';
import { adaptarGrupos, adaptarTreinos, adaptarGrupo, adaptarExercicios } from '../public/assets/js/dados/adaptar-principal.js';

const id = '326efbc6-4844-451f-8245-679af26b8a24';
const token = claims => `e30.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.assinatura-de-teste`;
function entrar(t) {
  definirSessao({ username: 'atleta', token: token({ sub: id, exp: Math.floor(Date.now() / 1000) + 600 }) });
  t.after(() => definirSessao(null));
}

test('listagens usam endpoints reais, JWT no header e ID do próprio token', async t => {
  entrar(t);
  const requisicoes = [];
  t.mock.method(globalThis, 'fetch', async (url, opcoes) => {
    requisicoes.push(url);
    assert.equal(opcoes.method, 'GET');
    assert.equal(opcoes.body, undefined);
    assert.equal(opcoes.headers.Authorization, `Bearer ${obterSessao().token}`);
    return Response.json([]);
  });
  assert.deepEqual(await Promise.all([listarGrupos(), listarTreinos()]), [[], []]);
  assert.deepEqual(requisicoes, [
    `http://localhost:8080/fight-fit/grupos/buscar-pelo-usuario/${id}`,
    'http://localhost:8080/fight-fit/treinos/buscar-pelo-usuario',
  ]);
});

test('falha HTTP não é interpretada como lista vazia', async t => {
  entrar(t);
  t.mock.method(globalThis, 'fetch', async () => Response.json({}, { status: 500 }));
  await assert.rejects(listarTreinos(), erro => erro.status === 500);
});

test('401 limpa a sessão; 403 preserva a sessão', async t => {
  entrar(t);
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({}, { status: 403 }));
  await assert.rejects(listarGrupos(), erro => erro.status === 403);
  assert.ok(obterSessao());
  fetch.mock.mockImplementation(async () => Response.json({}, { status: 401 }));
  await assert.rejects(listarTreinos(), erro => erro.status === 401);
  assert.equal(obterSessao(), null);
});

test('token expirado e token sem sub não permitem as consultas', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Não deveria requisitar'); });
  definirSessao({ username: 'teste', token: token({ sub: id, exp: 1 }) });
  assert.equal(obterSessao(), null);
  await assert.rejects(listarTreinos(), erro => erro.status === 401);
  definirSessao({ username: 'teste', token: token({ exp: Math.floor(Date.now() / 1000) + 600 }) });
  assert.throws(obterIdUsuario, erro => erro.status === 401);
  assert.equal(fetch.mock.callCount(), 0);
  definirSessao(null);
});

test('sessionStorage mantém a sessão entre páginas e logout a remove', async t => {
  const valores = new Map();
  const antigo = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
    setItem: (chave, valor) => valores.set(chave, valor), getItem: chave => valores.get(chave) || null,
    removeItem: chave => valores.delete(chave),
  } });
  t.after(() => {
    definirSessao(null);
    if (antigo) Object.defineProperty(globalThis, 'sessionStorage', antigo);
    else delete globalThis.sessionStorage;
  });
  entrar(t);
  const outraPagina = await import('../public/assets/js/api/sessao.js?teste-nova-pagina');
  assert.equal(outraPagina.obterSessao().username, 'atleta');
  assert.equal(outraPagina.obterIdUsuario(), id);
  assert.equal(valores.size, 1);
  definirSessao(null);
  assert.equal(outraPagina.obterSessao(), null);
  assert.equal(valores.size, 0);
});

test('adaptadores usam os DTOs sem inventar membros, modalidade ou associação', () => {
  const [grupo] = adaptarGrupos([{ id_do_grupo: id, nome_do_grupo: 'Minha turma', tag_do_grupo: 'FF-A2B3C4' }]);
  assert.equal(grupo.tag, 'FF-A2B3C4');
  assert.equal(grupo.totalIntegrantes, undefined);
  const completo = adaptarGrupo({ id_do_grupo: id, nome_do_grupo: 'Minha turma', tag: 'FF-A2B3C4', usuarios: [{ nome: 'Ana' }] });
  assert.equal(completo.totalIntegrantes, 1);
  const [treino] = adaptarTreinos([{ id_treino: id, nome_treino: 'Treino A', exerciciosIndividuaisList: [{ nome: 'Supino' }] }]);
  assert.equal(treino.nome, 'Treino A');
  assert.equal(treino.grupoId, null);
  assert.equal(treino.modalidade, null);
  assert.deepEqual(treino.exercicios, [{ nome: 'Supino' }]);
  assert.deepEqual(adaptarGrupos([]), []);
  assert.deepEqual(adaptarTreinos([]), []);
});

test('respostas malformadas geram erro e exercícios preservam valores zero', () => {
  assert.throws(() => adaptarGrupos({ grupos: [] }), /lista inválida/);
  assert.throws(() => adaptarTreinos([{ nome_treino: 'Sem ID' }]), /incompletos/);
  assert.throws(() => adaptarTreinos([{ id_treino: id, nome_treino: 'A' }]), /lista inválida/);
  assert.deepEqual(adaptarExercicios([{ id, id_treino: id, nome: 'Supino', serie: 3, repeticoes: 10, carga: 0 }]),
    [{ id, idTreino: id, nome: 'Supino', serie: 3, repeticoes: 10, carga: 0 }]);
  assert.throws(() => adaptarExercicios([{ id, id_treino: id, nome: 'Supino', serie: 3, repeticoes: 10 }]), /incompletos/);
});
