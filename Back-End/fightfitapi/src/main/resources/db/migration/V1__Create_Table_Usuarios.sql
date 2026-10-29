CREATE
EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE usuarios
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_usuario VARCHAR(255) NOT NULL UNIQUE,
    senha_usuario   VARCHAR(255) NOT NULL
);

