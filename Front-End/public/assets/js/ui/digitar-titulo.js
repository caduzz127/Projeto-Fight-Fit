const INTERVALO_LETRAS_MS = 65;
const ATRASO_INICIAL_MS = 250;

export function iniciarDigitacao() {
  const titulo = document.querySelector('#headline');
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!titulo || movimentoReduzido.matches || titulo.dataset.digitacaoIniciada) return;
  titulo.dataset.digitacaoIniciada = 'true';

  // O leitor de tela recebe a frase completa, sem anunciar letra por letra.
  titulo.setAttribute('aria-label', titulo.innerText.replace(/\s+/g, ' ').trim());
  titulo.querySelectorAll('br').forEach(quebra => quebra.setAttribute('aria-hidden', 'true'));

  const textos = [];
  const leitor = document.createTreeWalker(titulo, NodeFilter.SHOW_TEXT);
  while (leitor.nextNode()) textos.push(leitor.currentNode);

  const letras = [];
  const segmentador = new Intl.Segmenter('pt-BR', { granularity: 'grapheme' });

  textos.forEach(texto => {
    const fragmento = document.createDocumentFragment();
    for (const { segment } of segmentador.segment(texto.textContent)) {
      const letra = document.createElement('span');
      letra.className = 'digitacao-letra';
      letra.textContent = segment;
      letra.setAttribute('aria-hidden', 'true');
      fragmento.append(letra);
      letras.push(letra);
    }
    texto.replaceWith(fragmento);
  });

  // Letras invisíveis continuam ocupando espaço, mantendo o layout estável.
  titulo.classList.add('digitacao-ativa');
  let quadro;
  let inicio;
  let exibidas = 0;

  function concluir() {
    cancelAnimationFrame(quadro);
    titulo.classList.remove('digitacao-ativa');
    letras.forEach(letra => letra.classList.remove('digitacao-cursor'));
    movimentoReduzido.removeEventListener('change', aoAlterarPreferencia);
  }

  function aoAlterarPreferencia(evento) {
    if (evento.matches) concluir();
  }

  function digitar(agora) {
    inicio ??= agora;
    const quantidade = Math.min(letras.length, Math.max(0,
      Math.floor((agora - inicio - ATRASO_INICIAL_MS) / INTERVALO_LETRAS_MS) + 1));

    if (quantidade > exibidas) {
      letras[exibidas - 1]?.classList.remove('digitacao-cursor');
      while (exibidas < quantidade) letras[exibidas++].classList.add('digitacao-visivel');
      letras[exibidas - 1].classList.add('digitacao-cursor');
    }

    if (exibidas === letras.length) concluir();
    else quadro = requestAnimationFrame(digitar);
  }

  movimentoReduzido.addEventListener('change', aoAlterarPreferencia);
  quadro = requestAnimationFrame(digitar);
}
