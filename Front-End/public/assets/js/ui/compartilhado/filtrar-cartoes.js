const normalizar = texto => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR');

// Pesquisa local nos cartões já desenhados, pelo texto do título (h2) de cada um.
export function iniciarFiltroCartoes({ lista, area, campo, resultado, vazio }) {
  function filtrar() {
    const busca = normalizar(campo.value.trim());
    const cartoes = [...lista.children];
    let encontrados = 0;
    cartoes.forEach(cartao => {
      const corresponde = normalizar(cartao.querySelector('h2').textContent).includes(busca);
      cartao.hidden = !corresponde;
      if (corresponde) encontrados++;
    });
    area.hidden = cartoes.length === 0;
    resultado.textContent = busca ? `${encontrados} de ${cartoes.length}` : '';
    vazio.hidden = !busca || cartoes.length === 0 || encontrados > 0;
  }
  campo.addEventListener('input', filtrar);
  return filtrar;
}
