package com.fightfit.fightfitapi.dtos.exercicios_grupo;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExerciciosGrupoDelete(@NotNull UUID id_exercicio_grupo, @NotNull UUID id_usuario,@NotNull UUID id_grupo) {
}
