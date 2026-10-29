CREATE TABLE exercicios_individuais
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome_exercicios_individuais       VARCHAR(255)     NOT NULL,
    serie_exercicios_individuais      INTEGER          NOT NULL,
    repeticoes_exercicios_individuais INTEGER          NOT NULL,
    carga_exercicios_individuais      DOUBLE PRECISION NOT NULL,

    id_treinos  UUID,
    CONSTRAINT fk_exercicios_individuais
        FOREIGN KEY (id_treinos)
            REFERENCES treinos (id)
);