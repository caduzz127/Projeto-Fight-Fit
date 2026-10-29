CREATE TABLE grupos
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_grupo  VARCHAR(255) UNIQUE NOT NULL,
    senha_grupo VARCHAR(255) NOT NULL
);