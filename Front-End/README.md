# Fight Fit — Front-end

Login, cadastro e página principal em português com HTML, CSS e JavaScript nativos.
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

O endereço da API fica em `assets/js/api/config.js` (padrão `http://localhost:8080/fight-fit`).
`localhost` aponta para a máquina de quem abre o navegador. Ao hospedar o projeto,
troque pela URL HTTPS pública da API; uma página HTTPS não pode chamar HTTP.

- `api/index/login.js`: POST `/usuarios/login`, relativo à URL base, com `{ username, senha }`;
  recebe `{ username, token }`.
- `api/index/cadastro.js`: POST `/usuarios/cadastrar`, relativo à URL base, com `{ nome, senha }`;
  aceita `204 No Content`. A confirmação da senha nunca é enviada.
- `api/requisicao.js`: transporte JSON compartilhado, timeout de 15 segundos e
  mensagens de falha. Endpoints públicos não recebem cookies nem Bearer token.
- `api/sessao.js`: mantém usuário e token no `sessionStorage` da aba para o
  redirecionamento e recarregamento. A expiração do JWT, uma resposta 401 e o botão
  Sair encerram a sessão. Senhas não são armazenadas; os campos são limpos após sucesso.

O cadastro não faz login automaticamente. O login redireciona para `pagina_principal.html`.
O backend precisa estar ativo com PostgreSQL e as variáveis descritas em
`application.properties` e `JwtConfiguration`. Configure o CORS no Spring Security
para aceitar o preflight OPTIONS e as chamadas JSON entre portas diferentes.
O cadastro também precisa inicializar `token_version`, exigido pelo banco.
Não coloque credenciais do banco ou a chave JWT no front-end.

## Testes dos módulos de API

Com Node.js 22 ou superior, a partir de `Front-End`:

```sh
node --test tests/*.test.mjs
```

Esses testes usam respostas simuladas para conferir o contrato, os erros, o
cancelamento e a sessão. A verificação pelo navegador requer a API real ativa.

## Página principal integrada à API

Após o login, o token é guardado no `sessionStorage` da aba e o navegador abre
`public/pagina_principal.html`. Acessar essa página sem sessão válida retorna ao login.

São executadas duas consultas em paralelo, com `Authorization: Bearer <JWT>`:

- `GET /fight-fit/grupos/buscar-pelo-usuario/{id}`: o ID vem do `sub` do JWT.
- `GET /fight-fit/treinos/buscar-pelo-usuario`: o backend identifica o usuário pelo JWT.

Os caminhos dos módulos são relativos à URL base `http://localhost:8080/fight-fit`.
O backend continua responsável por validar a assinatura, a sessão e as permissões.
O cliente ler o `sub` não representa uma autorização.

A tela é única e os estados são determinados pelas listas retornadas:

| Respostas | Conteúdo |
| --- | --- |
| Grupos e treinos preenchidos | Cartões dos grupos e treinos |
| Duas listas vazias | Boas-vindas e convites para começar |
| Somente grupos | Grupos e convite para criar um treino |
| Somente treinos | Treinos e convite para encontrar uma comunidade |

Uma resposta com erro, JSON inválido ou formato inesperado nunca é convertida em
lista vazia. O painel mostra o erro e oferece Tentar novamente. O conteúdo só é
exibido depois que as duas consultas terminarem com sucesso. Uma resposta 401
limpa a sessão e volta ao login; 403 mostra a falta de permissão sem fingir logout.
Não existem seletor de cenário, dados de exemplo ou usuários fictícios no aplicativo.

### Operações conectadas

- Criação de grupo: `POST /grupos/cadastrar`, com `{ nome, senha }`.
- Busca de comunidades: `GET /grupos/buscar-pelo-nome/{nome}`.
- Entrada em grupo: `POST /grupos/entrar`, com `{ id_grupo, tag_grupo, senha }`.
- Detalhes e integrantes: `GET /grupos/buscar-pelo-id/{id}`.
- Criação de treino individual: `POST /treinos/cadastrar/{nome}`.
- Exercícios do treino: `GET /exercicios-individuais/buscar-por-treino/{id}`.

As operações só apresentam sucesso após a resposta da API e recarregam as
listagens após criar ou entrar. A tag é produzida pelo backend. Campos de senha
são limpos após sucesso. Os formulários bloqueiam envios duplicados.

A API atual de listagem de treinos retorna `id_treino`, `nome_treino` e
`exerciciosIndividuaisList`, contendo apenas nomes. A página busca os detalhes dos
exercícios quando o treino é aberto. O cadastro de treino aceita somente nome;
por isso não oferece seletores de modalidade ou grupo que seriam ignorados pelo
backend. A listagem de grupos não inclui contagem de integrantes: esses dados
são consultados nos detalhes. Não inventamos horários, integrantes, modalidade
ou associação entre treinos individuais e grupos.

O gerenciamento completo de exercícios, atualização/exclusão de grupos e treinos
não faz parte desta tela. Não há checkboxes que simulem salvar progresso de treino.

### Arquivos

- `assets/js/principal.js`: carrega as duas listagens e trata carregamento/erro.
- `api/grupos/`: uma função por chamada dos grupos.
- `api/treinos/`: listagem, cadastro e exercícios dos treinos.
- `api/requisicao.js`: transporte HTTP, JWT, timeout e erros.
- `api/sessao.js`: sessão por aba, expiração e leitura do ID do usuário.
- `dados/adaptar-principal.js`: mapeamento e validação dos DTOs reais.
- `ui/estado-principal.js` e `ui/renderizar-principal.js`: estados e cartões.
- `ui/grupos.js`: formulários e detalhes dos grupos.
- `ui/criar-treino.js` e `ui/detalhes-treino.js`: cadastro e leitura de exercícios.
- `ui/autenticacao-principal.js`: acesso à página, logout e sessão expirada.
- `ui/avatar-iniciais.js`, `ui/modalidades.js` e `assets/images/icons/`: apresentação.

### Conferir

1. Inicie a API com banco configurado e CORS habilitado.
2. Sirva a pasta `public` por HTTP, abra `index.html` e faça login.
3. No navegador, confira os dois GETs após o redirecionamento.
4. Crie um grupo e um treino; recarregue a página e confira a persistência real.
5. Pare a API para conferir o erro de conexão; reinicie e use Tentar novamente.
6. Clique Sair e confira que o acesso direto à página retorna ao login.

Os testes Node cobrem o contrato de autenticação, os endpoints protegidos, os
adaptadores de JSON, sessão, expiração e erros. Os testes usam respostas simuladas;
a validação de ponta a ponta requer a API real ativa.
