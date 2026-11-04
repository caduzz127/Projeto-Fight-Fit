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
        ├── api/
        │   ├── config.js
        │   ├── requisicao.js
        │   ├── sessao.js
        │   └── index/
        │       ├── login.js
        │       └── cadastro.js
        └── ui/
            ├── alternar-abas.js
            ├── mostrar-senha.js
            ├── validar-senhas.js
            ├── formulario.js
            ├── atualizar-ano.js
            └── digitar-titulo.js
```

O HTML carrega apenas `app.js`, que inicia os módulos:

- `alternar-abas.js`: alterna títulos, textos, aba selecionada e confirmação de
  senha. Aceita cliques, setas, Home e End; a marca retorna ao login.
- `mostrar-senha.js`: controla cada campo de senha de forma independente e oculta
  novamente as senhas ao trocar de aba.
- `validar-senhas.js`: valida a confirmação no cadastro com a API nativa do navegador.
- `formulario.js`: valida o formulário, chama login/cadastro e exibe o resultado.
  Bloqueia envios duplicados e cancela a espera ao mudar de aba (isso não desfaz
  um cadastro que o servidor já tenha recebido).
- `atualizar-ano.js`: preenche o ano do rodapé.
- `digitar-titulo.js`: revela o título letra por letra uma vez ao abrir a página,
  com cursor durante a digitação. Preserva o espaço do texto e respeita a
  preferência de movimento reduzido; sem JavaScript, a frase aparece completa.

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
- Envie dados válidos: confira as mensagens de sucesso e de erro, sem recarregamento.
- Confira o ano do rodapé, navegação por Tab e a apresentação em telas pequenas.

## API

O endereço da API fica em `assets/js/api/config.js` (padrão `http://localhost:8080`).
`localhost` aponta para a máquina de quem abre o navegador. Ao hospedar o projeto,
troque pela URL HTTPS pública da API; uma página HTTPS não pode chamar HTTP.

- `api/index/login.js`: POST `/fight-fit/usuarios/login`, com `{ username, senha }`;
  recebe `{ username, token }`.
- `api/index/cadastro.js`: POST `/fight-fit/usuarios/cadastrar`, com `{ nome, senha }`;
  aceita `204 No Content`. A confirmação da senha nunca é enviada.
- `api/requisicao.js`: transporte JSON compartilhado, timeout de 15 segundos e
  mensagens de falha. Endpoints públicos não recebem cookies nem Bearer token.
- `api/sessao.js`: mantém usuário e token apenas em memória; use `obterSessao()`
  para futuras chamadas protegidas. Recarregar a página encerra a sessão local.
  Senhas não são armazenadas; os campos são limpos após sucesso.

O cadastro não faz login automaticamente. Ainda não há dashboard nem redirecionamento.
O backend precisa estar ativo com PostgreSQL e as variáveis descritas em
`application.properties` e `JwtConfiguration`. Configure o CORS no Spring Security
para aceitar o preflight OPTIONS e as chamadas JSON entre portas diferentes.
O cadastro também precisa inicializar `token_version`, exigido pelo banco.
Não coloque credenciais do banco ou a chave JWT no front-end.

## Testes dos módulos de API

Com Node.js 22 ou superior, a partir de `Front-End`:

```sh
node --test tests/autenticacao.test.mjs
```

Esses testes usam respostas simuladas para conferir o contrato, os erros, o
cancelamento e a sessão. A verificação pelo navegador requer a API real ativa.
