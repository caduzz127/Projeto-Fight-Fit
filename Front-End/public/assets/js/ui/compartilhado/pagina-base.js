import { obterSessao } from '../../api/sessao.js';
import { iniciarAutenticacaoPrincipal } from './autenticacao-principal.js';
import { iniciarNavegacaoPrincipal } from './navegacao-principal.js';
import { preencherAvatares } from './avatar-iniciais.js';

// Partes comuns das telas autenticadas: sessão, botão Sair, menu lateral e avatar.
export function iniciarPagina() {
  if (!iniciarAutenticacaoPrincipal()) return false;
  iniciarNavegacaoPrincipal();
  document.querySelector('.perfil').dataset.avatarNome = obterSessao()?.username || 'Usuário';
  preencherAvatares();
  return true;
}

export function plural(total, singular, plural) {
  return `${total} ${total === 1 ? singular : plural}`;
}

export function formatarNumero(valor) {
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}
