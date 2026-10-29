CREATE TABLE participantes_exercicios
(
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carga            DECIMAL NOT NULL,
    serie            INTEGER NOT NULL,
    repeticoes       INTEGER NOT NULL,
    id_grupo_membros UUID    NOT NULL,
    id_exercicio_grupo UUID    NOT NULL,

    CONSTRAINT fk_grupo_membros
        FOREIGN KEY (id_grupo_membros)
            REFERENCES grupo_membros (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_exercicio_grupo
        FOREIGN KEY (id_exercicio_grupo)
            REFERENCES exercicio_grupo(id)
            ON DELETE CASCADE
);