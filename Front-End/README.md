# Fight Fit — Front-end

Interface de login e cadastro em português com HTML, CSS e JavaScript nativos.
Não exige instalação de pacotes nem build.

## Executar

```sh
cd /workspace/Projeto-Fight-Fit/Front-End/public
python3 -m http.server 5173 --bind 0.0.0.0
```

Sirva a pasta `public` por HTTP: os módulos JavaScript não devem ser abertos
como arquivos. A fonte remota é opcional, com fontes locais de fallback.

## Organização

```text
public/
├── index.html
└── assets/
    ├── css/styles.css
    └── js/
        ├── app.js
        └── ui/
            ├── alternar-abas.js
            ├── mostrar-senha.js
            ├── validar-senhas.js
            ├── formulario.js
            └── atualizar-ano.js
```

O HTML carrega apenas `app.js`, que inicia os módulos:

- `alternar-abas.js`: alterna títulos, textos, aba selecionada e confirmação de
  senha. Aceita cliques, setas, Home e End; a marca retorna ao login.
- `mostrar-senha.js`: controla cada campo de senha de forma independente e oculta
  novamente as senhas ao trocar de aba.
- `validar-senhas.js`: valida a confirmação no cadastro com a API nativa do navegador.
- `formulario.js`: exibe os erros e bloqueia o envio com uma mensagem de demonstração.
- `atualizar-ano.js`: preenche o ano do rodapé.

Ao trocar de modo, o módulo de abas dispara `modoalterado` no formulário para os
outros módulos limparem mensagens, validação e visibilidade. O nome de usuário e
a senha são preservados; a confirmação é limpa. Aparência, foco, estados de erro
e responsividade ficam em `styles.css`.

## Verificação manual

- Alterne entre Entrar e Criar conta pelas abas e pelo convite abaixo do formulário.
- Nas abas, use setas, Home e End; confira o foco e a seleção.
- No cadastro, confira os textos e o campo obrigatório de confirmação de senha.
- Mostre e oculte cada senha; ao trocar de aba, ambas voltam a ficar ocultas.
- Tente enviar campos vazios e senhas divergentes; corrija os dados e tente novamente.
- Envie dados válidos: a mensagem deve informar que a tela é uma demonstração,
  sem requisições, navegação ou recarregamento.
- Confira o ano do rodapé, navegação por Tab e a apresentação em telas pequenas.

## API

A interface ainda não chama o backend de `Back-End/fightfitapi`, não simula login
e não armazena senhas ou tokens. A integração será uma etapa separada, com os
arquivos de cada chamada em `assets/js/api/`. Não coloque segredos no front-end.
