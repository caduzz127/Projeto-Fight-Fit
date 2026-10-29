CREATE TABLE treinos
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_treinos VARCHAR(255),
    id_usuarios UUID,
    CONSTRAINT fk_treino_usuario
        FOREIGN KEY (id_usuarios)
            REFERENCES usuarios (id)
);