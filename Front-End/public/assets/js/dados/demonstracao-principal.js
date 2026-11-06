// Fonte temporária da prévia. A integração futura fornecerá o mesmo modelo à UI.
// Nenhum dado desta página é enviado ou salvo na API.
const usuario = { nome: 'Atleta' };
const grupos = [
  { id: 'forca', nome: 'Força em equipe', tag: 'FF-K7M2Q9', descricao: 'Treinos compartilhados, incentivo de verdade. Todo mundo tem espaço para evoluir.', totalIntegrantes: 8, membros: ['Maria Costa', 'João Pereira', 'Ana Lima'] },
  { id: 'constancia', nome: 'Clube da constância', tag: 'FF-R3B8P6', descricao: 'Menos pressa. Mais presença. Uma comunidade para fazer do treino um hábito.', totalIntegrantes: 12, membros: ['Bruno Ribeiro', 'Luiza Ferreira', 'Camila Alves'] },
  { id: 'corrida', nome: 'Corrida de sábado', tag: 'FF-T8H4N2', descricao: 'Para quem gosta de somar quilômetros e boas conversas pelo caminho.', totalIntegrantes: 16, membros: ['Pedro Souza', 'Ana Lima', 'Rafael Melo'] },
  { id: 'movimento', nome: 'Movimento leve', tag: 'FF-M9D5X7', descricao: 'Mobilidade e movimento sem pressa. Uma pausa para cuidar de você.', totalIntegrantes: 6, membros: ['Camila Alves', 'Luiza Ferreira', 'Maria Costa'] },
  { id: 'desafio', nome: 'Desafio 30 dias', tag: 'FF-C6Z3W8', descricao: 'Pequenos compromissos, grandes mudanças. Mais constância em boa companhia.', totalIntegrantes: 24, membros: ['João Pereira', 'Bruno Ribeiro', 'Pedro Souza'] },
  { id: 'amigos', nome: 'Treino com os amigos', tag: 'FF-A2F7Y5', descricao: 'O encontro de sempre, com um motivo a mais. Incentivo do início ao último exercício.', totalIntegrantes: 5, membros: ['Rafael Melo', 'Maria Costa', 'Ana Lima'] },
];
const treinos = [
  { id: 'coletivo', nome: 'Corpo inteiro, energia renovada', modalidade: 'FORCA', grupoId: 'forca', exercicios: [
    { nome: 'Agachamento livre', orientacao: '3 séries · 12 repetições' },
    { nome: 'Remada com halteres', orientacao: '3 séries · 12 repetições' },
    { nome: 'Flexão de braços', orientacao: '3 séries · 10 repetições' },
    { nome: 'Prancha', orientacao: '3 séries · 30 segundos' },
  ] },
  { id: 'mobilidade', nome: 'Comece o dia em movimento', modalidade: 'MOBILIDADE', grupoId: 'constancia', exercicios: [
    { nome: 'Mobilidade de quadril', orientacao: '2 séries · 10 repetições' },
    { nome: 'Rotação torácica', orientacao: '2 séries · 10 repetições' },
    { nome: 'Mobilidade de tornozelos', orientacao: '2 séries · 12 repetições' },
  ] },
  { id: 'cardio', nome: 'Um passo de cada vez', modalidade: 'CARDIO', grupoId: 'corrida', exercicios: [
    { nome: 'Caminhada', orientacao: 'Exemplo de exercício medido por duração' },
    { nome: 'Corrida leve', orientacao: 'Exemplo de exercício medido por duração e distância' },
  ] },
  { id: 'individual', nome: 'Meu treino A', modalidade: 'FORCA', grupoId: null, exercicios: [
    { nome: 'Supino com halteres', orientacao: '3 séries · 10 repetições' },
    { nome: 'Remada baixa', orientacao: '3 séries · 12 repetições' },
  ] },
];

export const cenariosDemonstracao = {
  completo: { usuario, grupos, treinos },
  novo: { usuario, grupos: [], treinos: [] },
  'so-grupos': { usuario, grupos, treinos: [] },
  'so-treinos': { usuario, grupos: [], treinos: treinos.filter(treino => !treino.grupoId) },
};

export function carregarDemonstracao(cenario = 'completo') {
  return structuredClone(cenariosDemonstracao[cenario] || cenariosDemonstracao.completo);
}
