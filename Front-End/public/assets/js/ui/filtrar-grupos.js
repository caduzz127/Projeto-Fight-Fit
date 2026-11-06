export function iniciarFiltroGrupos() {
  const campo = document.querySelector('#buscar-grupo');
  if (!campo) return;

  const grade = document.querySelector('.grade-grupos');
  const resultado = document.querySelector('#resultado-busca');
  const vazio = document.querySelector('#busca-vazia');
  const normalizar = texto => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  function filtrar() {
    const busca = normalizar(campo.value.trim());
    const cartoes = [...grade.children];
    let encontrados = 0;
    cartoes.forEach(cartao => {
      const nomeETag = `${cartao.querySelector('h3').textContent} ${cartao.querySelector('.tag-grupo')?.textContent || ''}`;
      const corresponde = normalizar(nomeETag).includes(busca);
      cartao.hidden = !corresponde;
      if (corresponde) encontrados++;
    });
    resultado.textContent = busca
      ? `${encontrados} de ${cartoes.length} grupos`
      : `${cartoes.length} grupos`;
    vazio.hidden = cartoes.length === 0 || encontrados !== 0;
  }

  campo.addEventListener('input', filtrar);
  grade.addEventListener('gruposatualizados', filtrar);
  filtrar();
}
