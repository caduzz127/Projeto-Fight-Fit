import test from 'node:test';
import assert from 'node:assert/strict';
import { definirSessao } from '../public/assets/js/api/sessao.js';
import { listarExerciciosGrupo } from '../public/assets/js/api/exercicios-grupo/listar.js';
import { atualizarExercicioGrupo } from '../public/assets/js/api/exercicios-grupo/atualizar.js';
import { buscarRanking } from '../public/assets/js/api/participantes/ranking.js';
import { atualizarGrupo } from '../public/assets/js/api/grupos/atualizar.js';
import { excluirGrupo } from '../public/assets/js/api/grupos/excluir.js';
import { sairGrupo } from '../public/assets/js/api/grupos/sair.js';
import { adaptarGrupo, adaptarExerciciosGrupo } from '../public/assets/js/dados/adaptar-principal.js';
import { montarRanking } from '../public/assets/js/dados/ranking.js';

const API = 'http://localhost:8080/fight-fit';
const G = '326efbc6-4844-451f-8245-679af26b8a24';
const E = 'a1b2c3d4-0000-4000-8000-000000000001';
const token = `e30.${Buffer.from(JSON.stringify({ sub: G, exp: Math.floor(Date.now() / 1000) + 600 })).toString('base64url')}.x`;

function entrar(t, resposta = () => Response.json([])) {
  definirSessao({ username: 'admin', token });
  t.after(() => definirSessao(null));
  const chamadas = [];
  t.mock.method(globalThis, 'fetch', async (url, opcoes) => {
    chamadas.push({ url, metodo: opcoes.method, corpo: opcoes.body && JSON.parse(opcoes.body) });
    return resposta();
  });
  return chamadas;
}

test('rotas de grupo, exercício de grupo e ranking', async t => {
  const chamadas = entrar(t);
  await listarExerciciosGrupo(G);
  await buscarRanking(E);
  await atualizarExercicioGrupo({ id: E, idGrupo: G, nome: 'Supino' });
  await atualizarGrupo({ idGrupo: G, nome: 'Turma', senhaAntiga: 'a', senhaNova: 'b' });
  await excluirGrupo({ idGrupo: G, senha: 'a' });
  await sairGrupo(G);
  assert.deepEqual(chamadas, [
    { url: `${API}/exercicio-grupo/buscar/${G}/%25`, metodo: 'GET', corpo: undefined },
    { url: `${API}/participantes/buscar/${E}`, metodo: 'GET', corpo: undefined },
    { url: `${API}/exercicio-grupo/atualizar`, metodo: 'PUT', corpo: { id_exercicio_grupo: E, nome: 'Supino', id_grupo: G } },
    { url: `${API}/grupos/atualizar`, metodo: 'PUT', corpo: { id_grupo: G, nome: 'Turma', senhaAntiga: 'a', senhaNova: 'b' } },
    { url: `${API}/grupos/deletar`, metodo: 'DELETE', corpo: { id_grupo: G, senha: 'a' } },
    { url: `${API}/grupos/sair/${G}`, metodo: 'DELETE', corpo: undefined },
  ]);
});

test('grupo detalhado identifica o dono pelo cargo', () => {
  const grupo = adaptarGrupo({ id_do_grupo: G, nome_do_grupo: 'Turma', tag: 'FF-1', usuarios: [
    { nome: 'Ana', cargo: 'SYSTEM_GROUP_USER' }, { nome: 'Cadu', cargo: 'SYSTEM_ROOT_GROUP_ADMIN' },
  ] });
  assert.equal(grupo.dono, 'Cadu');
  assert.deepEqual(grupo.membros, ['Ana', 'Cadu']);
});

test('exercícios de grupo trazem participantes com as marcas', () => {
  const [exercicio] = adaptarExerciciosGrupo([{ id_exercicio_grupo: E, nome_exercicio_grupo: 'Supino', id_grupo: G,
    usuarios: [{ id_usuario: G, nome_usuario: 'Ana', serie: 3, carga: 40, repeticoes: 10 }] }]);
  assert.deepEqual(exercicio.participantes, [{ id: G, nome: 'Ana', serie: 3, carga: 40, repeticoes: 10 }]);
  assert.throws(() => adaptarExerciciosGrupo([{ id_exercicio_grupo: E, nome_exercicio_grupo: 'X', id_grupo: G }]), /lista inválida/);
});

test('ranking: carga decide, repetições e séries desempatam, empate total divide a posição', () => {
  const p = (nome, carga, repeticoes, serie) => ({ nome, carga, repeticoes, serie });
  const ranking = montarRanking([
    p('Raphael', 35, 12, 3), p('Pedro', 40, 8, 3), p('Cadu', 45, 10, 3),
    p('Bia', 40, 10, 3), p('Duda', 40, 10, 4), p('Eli', 40, 10, 4),
  ]);
  assert.deepEqual(ranking.map(item => [item.posicao, item.nome]), [
    [1, 'Cadu'], [2, 'Duda'], [2, 'Eli'], [4, 'Bia'], [5, 'Pedro'], [6, 'Raphael'],
  ]);
  assert.deepEqual(ranking.map(item => item.percentual), [100, 89, 89, 89, 89, 78]);
  assert.deepEqual(montarRanking([]), []);
});
