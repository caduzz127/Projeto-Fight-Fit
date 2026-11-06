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

O endereço da API fica em `assets/js/api/config.js` (padrão `http://localhost:8080/fight-fit`).
`localhost` aponta para a máquina de quem abre o navegador. Ao hospedar o projeto,
troque pela URL HTTPS pública da API; uma página HTTPS não pode chamar HTTP.

- `api/index/login.js`: POST `/usuarios/login`, relativo à URL base, com `{ username, senha }`;
  recebe `{ username, token }`.
- `api/index/cadastro.js`: POST `/usuarios/cadastrar`, relativo à URL base, com `{ nome, senha }`;
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

## Página principal: um HTML, quatro estados

Abra `public/pagina_principal.html` pelo mesmo servidor HTTP. O CSS, a logo e os
módulos devem acompanhar o HTML; não copie apenas esse arquivo.

A tela é única. O JavaScript lê `grupos` e `treinos` e atualiza as seções de forma
independente. Não existe outra página para o usuário recém-cadastrado:

| Dados disponíveis | O que a página mostra |
| --- | --- |
| Grupos e treinos | Cartões dos grupos e treinos, com um treino em destaque |
| Nenhum dos dois | Boas-vindas e convites para começar |
| Somente grupos | Grupos disponíveis e convite para criar um treino |
| Somente treinos | Treinos disponíveis e convite para encontrar uma comunidade |

O seletor **Dados de demonstração**, no topo, serve para conferir esses quatro
estados durante a revisão visual. Ele recarrega o mesmo `pagina_principal.html` usando
`?cenario=completo`, `?cenario=novo`, `?cenario=so-grupos` ou `?cenario=so-treinos`.
A escolha altera somente os dados de exemplo, nunca permissões de acesso.

### Dados e futura integração

Os exemplos ficam em `assets/js/dados/demonstracao-principal.js`. Cada cenário
fornece um objeto com estas listas e o usuário:

```json
{
  "usuario": { "nome": "Atleta" },
  "grupos": [],
  "treinos": []
}
```

Um grupo usa `id`, `nome`, `tag` e, opcionalmente, `descricao`, `totalIntegrantes`
e `membros` (lista de nomes). Um treino usa `id`, `nome`, `modalidade`, `grupoId`
(`null` para individual) e `exercicios` (lista de `{ nome, orientacao }`).

Este é o modelo de apresentação da prévia, não uma exigência de mudança na API.
Na integração, um adaptador deve mapear os DTOs reais para esse modelo e fornecer
os grupos e treinos autorizados pelo backend. A fonte de demonstração e seu
seletor serão retirados. Falhas de rede devem ser tratadas como erro; não devem
ser convertidas em listas vazias que pareçam um usuário sem atividades.

Os detalhes não inventam datas ou horários de treinos. Modalidades disponíveis
nos exemplos: força, cardio e mobilidade, identificadas por SVGs locais. Cada
grupo mantém um ícone de comunidade; as etiquetas refletem os tipos dos seus treinos.
Essas modalidades são exemplos visuais e não ativam recursos novos no backend.

### Organização

- `assets/css/principal.css`: estilos da página e dos estados vazios.
- `assets/js/principal.js`: carrega os dados de exemplo e inicia os módulos.
- `dados/demonstracao-principal.js`: exemplos separados do HTML e das interações.
- `ui/estado-principal.js`: determina quais seções têm conteúdo, sem IDs fixos.
- `ui/renderizar-principal.js`: preenche os cartões e a saudação com os dados.
- `ui/filtrar-grupos.js`: busca pelo nome ou tag, ignorando acentos e caixa.
- `ui/navegacao-principal.js`: menu móvel e fechamento de diálogos.
- `ui/previa-grupos.js`: detalhes e criação/participação ilustrativas em grupos.
- `ui/previa-treino.js`: detalhes dos exercícios e marcação de progresso local.
- `ui/criar-treino-previa.js`: criação ilustrativa de treino individual ou de grupo.
- `ui/avatar-iniciais.js`: iniciais dos nomes; não há upload de fotos.
- `ui/modalidades.js` e `assets/images/icons/`: nomes e ícones das modalidades.

A criação de grupos e treinos, participação e marcação de exercícios são locais
à prévia, sem chamadas à API ou persistência. Um treino criado começa sem
exercícios. Recarregar descarta alterações. O login em `index.html` continua
independente desta página até definirmos o contrato dos endpoints protegidos.

### Conferir a prévia

- Compare os quatro cenários pelo seletor no topo.
- Confira que só grupos não cria treinos fictícios, e só treinos não cria grupos.
- Busque um grupo por nome sem acentos ou por tag; abra os detalhes.
- Abra um treino individual e um de grupo; marque exercícios e feche com Escape.
- Crie um grupo e depois um treino dentro dele; confira contagens e etiquetas.
- Teste o menu e os diálogos no celular.
