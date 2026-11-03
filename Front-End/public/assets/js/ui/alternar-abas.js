const textos = {
  login: {
    etapa: 'SEU ESPAÇO DE EVOLUÇÃO',
    titulo: 'Bom ter você de volta.',
    descricao: 'Entre na sua conta e continue de onde parou.',
    enviar: 'Entrar na minha conta',
    convite: 'Ainda não faz parte?',
    alternar: 'Crie sua conta',
  },
  cadastro: {
    etapa: 'SUA EVOLUÇÃO COMEÇA AQUI',
    titulo: 'Comece sua jornada.',
    descricao: 'Crie sua conta e dê o primeiro passo na sua evolução.',
    enviar: 'Criar minha conta',
    convite: 'Já faz parte?',
    alternar: 'Entre na sua conta',
  },
};

export function iniciarAbas() {
  const formulario = document.querySelector('#auth-form');
  const abas = [...document.querySelectorAll('.tabs [role="tab"]')];
  const painel = document.querySelector('#auth-panel');
  const confirmacao = document.querySelector('#confirmation');
  const campoConfirmacao = document.querySelector('#confirm-password');
  const senha = document.querySelector('#password');

  function selecionarModo(modo) {
    const cadastro = modo === 'cadastro';
    const abaAtiva = document.querySelector(cadastro ? '#register-tab' : '#login-tab');
    const texto = textos[modo];

    abas.forEach(aba => {
      const ativa = aba === abaAtiva;
      aba.setAttribute('aria-selected', String(ativa));
      aba.tabIndex = ativa ? 0 : -1;
    });
    painel.setAttribute('aria-labelledby', abaAtiva.id);
    formulario.dataset.modo = modo;
    confirmacao.hidden = !cadastro;
    campoConfirmacao.disabled = !cadastro;
    campoConfirmacao.required = cadastro;
    campoConfirmacao.value = '';
    senha.autocomplete = cadastro ? 'new-password' : 'current-password';

    document.querySelector('#step').textContent = texto.etapa;
    document.querySelector('#form-title').textContent = texto.titulo;
    document.querySelector('#form-description').textContent = texto.descricao;
    document.querySelector('#submit-label').textContent = texto.enviar;
    document.querySelector('#switch-description').textContent = texto.convite;
    document.querySelector('#switch-mode').textContent = texto.alternar;
    formulario.dispatchEvent(new Event('modoalterado'));
  }

  abas.forEach((aba, indice) => {
    function ativar() {
      selecionarModo(aba.id === 'register-tab' ? 'cadastro' : 'login');
    }

    aba.addEventListener('click', ativar);
    aba.addEventListener('keydown', evento => {
      let destino;
      if (evento.key === 'ArrowRight') destino = (indice + 1) % abas.length;
      if (evento.key === 'ArrowLeft') destino = (indice - 1 + abas.length) % abas.length;
      if (evento.key === 'Home') destino = 0;
      if (evento.key === 'End') destino = abas.length - 1;
      if (destino === undefined) return;
      evento.preventDefault();
      abas[destino].focus();
      abas[destino].click();
    });
  });

  document.querySelector('#switch-mode').addEventListener('click', () => {
    selecionarModo(formulario.dataset.modo === 'login' ? 'cadastro' : 'login');
    document.querySelector('#username').focus();
  });

  document.querySelector('.brand').addEventListener('click', evento => {
    evento.preventDefault();
    selecionarModo('login');
    document.querySelector('#login-tab').focus();
  });

  selecionarModo('login');
}
