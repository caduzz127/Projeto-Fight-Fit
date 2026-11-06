import { carregarDemonstracao, cenariosDemonstracao } from './dados/demonstracao-principal.js';
import { iniciarNavegacaoPrincipal } from './ui/navegacao-principal.js';
import { renderizarPrincipal } from './ui/renderizar-principal.js';
import { iniciarPreviaTreino } from './ui/previa-treino.js';
import { iniciarPreviaGrupos } from './ui/previa-grupos.js';
import { iniciarCriacaoTreino } from './ui/criar-treino-previa.js';
import { iniciarFiltroGrupos } from './ui/filtrar-grupos.js';

// O seletor existe apenas para conferir os quatro cenários com dados de exemplo.
const parametro = new URLSearchParams(location.search).get('cenario');
const cenario = Object.hasOwn(cenariosDemonstracao, parametro) ? parametro : 'completo';
const seletor = document.querySelector('#cenario-previa');
seletor.value = cenario;
seletor.addEventListener('change', () => {
  const url = new URL(location.href);
  url.searchParams.set('cenario', seletor.value);
  location.assign(url);
});

const dados = carregarDemonstracao(cenario);
const atualizar = () => renderizarPrincipal(dados);
iniciarNavegacaoPrincipal();
const abrirTreino = iniciarPreviaTreino(dados);
iniciarPreviaGrupos(dados, abrirTreino, atualizar);
iniciarCriacaoTreino(dados, atualizar);
iniciarFiltroGrupos();
atualizar();
