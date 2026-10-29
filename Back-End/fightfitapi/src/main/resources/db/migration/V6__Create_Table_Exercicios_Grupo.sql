CREATE TABLE exercicio_grupo(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    id_grupo UUID NOT NULL,

    CONSTRAINT fk_id_grupo
    FOREIGN KEY (id_grupo)
    REFERENCES grupos(id)
    ON DELETE CASCADE

);