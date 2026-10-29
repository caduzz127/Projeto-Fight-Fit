# Fight Fit — Front-end

Interface de login e cadastro em português, com HTML, CSS e JavaScript nativos. Não exige instalação de pacotes nem build.

## Executar

```sh
cd /workspace/Projeto-Fight-Fit/Front-End/public
python3 -m http.server 5173 --bind 0.0.0.0
```

Abra a porta 5173 no seu ambiente de desenvolvimento. Não abra o HTML diretamente como arquivo: os módulos JavaScript precisam de HTTP.

## Integração pendente

Os arquivos do servidor estão em `Back-End/fightfitapi`. A integração de autenticação ainda precisa ser implementada conforme o contrato do back-end; as rotas em `config.js` continuam sem configuração.

Antes de conectar os formulários, confirme os endpoints, nomes dos campos, mecanismo de sessão (cookie ou token), política de senha e CORS. Configure `public/assets/js/config.js` e ajuste o adaptador em `public/assets/js/auth-service.js` conforme o contrato real. O adaptador inicial envia `{ username, senha }` com cookies; não persiste senhas nem tokens no navegador. Não coloque segredos em arquivos do front-end.

Enquanto as rotas forem `null`, o formulário informa que a integração está pendente e não faz requisições nem simula autenticação. Não há dashboard nem recuperação de senha nesta etapa.

## Verificação manual

- Alterne entre Entrar e Criar conta, inclusive pelas setas nas abas.
- Verifique campos obrigatórios e confirmação de senha divergente.
- Mostre e oculte cada senha.
- Envie os formulários: sem configuração da API, deve aparecer a mensagem de conexão pendente.
- Verifique a navegação com Tab e a apresentação em telas pequenas.

A fonte remota é opcional; há fontes locais de fallback.

## Organização

```text
Front-End/
├── README.md
├── version.txt
└── public/
    ├── index.html
    └── assets/
        ├── css/
        │   └── styles.css
        ├── js/
        │   ├── app.js
        │   ├── auth-service.js
        │   └── config.js
        └── images/
```

Mantenha as telas HTML diretamente em `public/`, os estilos em `public/assets/css/`, os scripts em `public/assets/js/` e as imagens em `public/assets/images/`. A pasta de imagens está reservada para os próximos recursos visuais.

## JavaScript

- `public/assets/js/app.js`: referências da tela, textos de login/cadastro, validação, eventos e atualização da interface.
- `public/assets/js/auth-service.js`: configuração das requisições de autenticação e tradução de erros HTTP e de conexão.
- `public/assets/js/config.js`: endereço do servidor e rotas pendentes de confirmação.

Os eventos chamam funções nomeadas; o serviço de autenticação não acessa o DOM.
