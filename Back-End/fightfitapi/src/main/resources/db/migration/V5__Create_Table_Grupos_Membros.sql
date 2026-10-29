CREATE TABLE grupo_membros(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_grupo UUID NOT NULL,
    cargo VARCHAR(255) NOT NULL,

    CONSTRAINT fk_id_usuarios
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_id_grupo
        FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE

);