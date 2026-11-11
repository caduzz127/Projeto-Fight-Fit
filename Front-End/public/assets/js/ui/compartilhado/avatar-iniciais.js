export function preencherAvatares(raiz = document) {
  raiz.querySelectorAll('[data-avatar-nome]').forEach(avatar => {
    const nome = avatar.dataset.avatarNome.trim();
    const partes = nome.split(/\s+/).filter(Boolean);
    const iniciais = partes.length > 1
      ? Array.from(partes[0])[0] + Array.from(partes.at(-1))[0]
      : Array.from(nome).slice(0, 2).join('');
    avatar.textContent = iniciais.toLocaleUpperCase('pt-BR') || '?';
    // Avatar decorativo (dentro de um link com rótulo próprio) não recebe nome acessível.
    if (avatar.getAttribute('aria-hidden') === 'true') return;
    avatar.setAttribute('role', 'img');
    avatar.setAttribute('aria-label', nome ? `Perfil de ${nome}` : 'Perfil sem nome');
  });
}
