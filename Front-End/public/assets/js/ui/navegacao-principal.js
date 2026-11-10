export function iniciarNavegacaoPrincipal() {
  const menu = document.querySelector('#menu-principal');
  const botao = document.querySelector('.botao-menu');
  const links = [...menu.querySelectorAll('.menu-link')];

  function definirMenu(aberto) {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }

  botao.addEventListener('click', () => definirMenu(!menu.classList.contains('aberto')));
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
      definirMenu(false);
      botao.focus();
    }
  });
  document.addEventListener('click', evento => {
    if (!menu.contains(evento.target) && !botao.contains(evento.target)) definirMenu(false);
  });
  links.forEach(link => link.addEventListener('click', () => {
    definirMenu(false);
    // Links para outras telas seguem a navegação normal do navegador.
    if (link.pathname !== location.pathname || !link.hash) return;
    const destino = document.querySelector(link.hash);
    if (!destino) return;
    links.forEach(item => {
      item.classList.toggle('ativo', item === link);
      if (item === link) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
    destino.tabIndex = -1;
    destino.focus({ preventScroll: true });
  }));
  window.matchMedia('(min-width: 1001px)').addEventListener('change', () => definirMenu(false));

  document.querySelectorAll('dialog').forEach(dialogo => {
    dialogo.querySelector('.fechar-dialogo').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', evento => {
      const caixa = dialogo.getBoundingClientRect();
      if (evento.target === dialogo && (evento.clientX < caixa.left || evento.clientX > caixa.right
        || evento.clientY < caixa.top || evento.clientY > caixa.bottom)) dialogo.close();
    });
  });
}
