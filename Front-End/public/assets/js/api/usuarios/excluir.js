import { requisitarJson } from '../requisicao.js';

// O back-end recebe a senha como texto puro no corpo (@RequestBody String).
export function excluirUsuario(senha, { signal } = {}) {
  return requisitarJson('/usuarios/deletar', {
    metodo: 'DELETE', signal, texto: senha,
    mensagens: { 400: 'Não foi possível excluir a conta. Exclua seus treinos e saia dos grupos antes de tentar de novo.', 404: 'Senha incorreta.' },
    detalhes: [['senha incorreta', 'Senha incorreta.']],
  });
}
