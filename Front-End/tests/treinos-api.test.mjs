import test from 'node:test';
import assert from 'node:assert/strict';
import { definirSessao } from '../public/assets/js/api/sessao.js';
import { cadastrarTreino } from '../public/assets/js/api/treinos/cadastrar.js';
import { deletarTreino } from '../public/assets/js/api/treinos/deletar.js';
import { listarExerciciosTreino } from '../public/assets/js/api/exercicios/listar.js';
import { cadastrarExercicio } from '../public/assets/js/api/exercicios/cadastrar.js';
import { atualizarExercicio } from '../public/assets/js/api/exercicios/atualizar.js';
import { deletarExercicio } from '../public/assets/js/api/exercicios/deletar.js';
import { adaptarTreino, obterNomeTreino } from '../public/assets/js/dados/adaptar-principal.js';
import { linkTreino } from '../public/assets/js/ui/compartilhado/rotas.js';

const API = 'http://localhost:8080/fight-fit';
const idTreino = '326efbc6-4844-451f-8245-679af26b8a24';
const idExercicio = 'a1b2c3d4-0000-4000-8000-000000000001';
const token = `e30.${Buffer.from(JSON.stringify({ sub: idTreino, exp: Math.floor(Date.now() / 1000) + 600 })).toString('base64url')}.x`;

function entrar(t, resposta = () => Response.json({})) {
  definirSessao({ username: 'atleta', token });
  t.after(() => definirSessao(null));
  const chamadas = [];
  t.mock.method(globalThis, 'fetch', async (url, opcoes) => {
    chamadas.push({ url, metodo: opcoes.method, corpo: opcoes.body && JSON.parse(opcoes.body), auth: opcoes.headers.Authorization });
    return resposta();
  });
  return chamadas;
}

test('treinos: cria pelo nome na URL e exclui com DELETE sem corpo', async t => {
  const chamadas = entrar(t, () => new Response(null, { status: 204 }));
  await cadastrarTreino('Treino A/B');
  await deletarTreino(idTreino);
  assert.deepEqual(chamadas.map(({ url, metodo, corpo }) => ({ url, metodo, corpo })), [
    { url: `${API}/treinos/cadastrar/Treino%20A%2FB`, metodo: 'POST', corpo: undefined },
    { url: `${API}/treinos/deletar/${idTreino}`, metodo: 'DELETE', corpo: undefined },
  ]);
  assert.ok(chamadas.every(chamada => chamada.auth === `Bearer ${token}`));
});

test('exercícios: listar, cadastrar, atualizar e excluir usam os DTOs do back-end', async t => {
  const chamadas = entrar(t);
  const dados = { idTreino, nome: 'Supino', carga: 42.5, repeticoes: 12, serie: 3 };
  await listarExerciciosTreino(idTreino);
  await cadastrarExercicio(dados);
  await atualizarExercicio({ ...dados, id: idExercicio });
  await deletarExercicio({ id: idExercicio, idTreino });
  assert.deepEqual(chamadas.map(({ url, metodo, corpo }) => ({ url, metodo, corpo })), [
    { url: `${API}/exercicios-individuais/buscar-por-treino/${idTreino}`, metodo: 'GET', corpo: undefined },
    { url: `${API}/exercicios-individuais/cadastrar`, metodo: 'POST', corpo: { id_treino: idTreino, nome: 'Supino', carga: 42.5, repeticoes: 12, serie: 3 } },
    { url: `${API}/exercicios-individuais/atualizar`, metodo: 'PUT', corpo: { id: idExercicio, id_treino: idTreino, nome: 'Supino', carga: 42.5, repeticoes: 12, serie: 3 } },
    { url: `${API}/exercicios-individuais/deletar`, metodo: 'DELETE', corpo: { id: idExercicio, id_treino: idTreino } },
  ]);
});

test('exercícios: 403 de treino de outra pessoa preserva o status para a tela tratar', async t => {
  entrar(t, () => Response.json({ status: 403, mensage: 'treino não pertence ao usuario' }, { status: 403 }));
  await assert.rejects(listarExerciciosTreino(idTreino), erro => erro.status === 403);
});

test('treino criado é adaptado e vira link da tela de detalhe', () => {
  const treino = adaptarTreino({ id_treino: idTreino, nome_treino: 'Treino A' });
  assert.deepEqual(treino, { id: idTreino, nome: 'Treino A' });
  assert.equal(linkTreino(treino.id), `treino.html?id=${idTreino}`);
  assert.throws(() => adaptarTreino({ nome_treino: 'Sem ID' }), /incompletos/);
});

test('nome do treino vem do primeiro exercício; lista vazia ou sem campo devolve null', () => {
  assert.equal(obterNomeTreino([{ id: idExercicio, id_treino: idTreino, nome_treino: 'Treino A', nome: 'Supino' }]), 'Treino A');
  assert.equal(obterNomeTreino([]), null);
  assert.equal(obterNomeTreino([{ id: idExercicio, nome: 'Supino' }]), null);
});
