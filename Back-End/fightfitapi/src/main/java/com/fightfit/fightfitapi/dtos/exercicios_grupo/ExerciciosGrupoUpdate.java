package com.fightfit.fightfitapi.dtos.exercicios_grupo;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExerciciosGrupoUpdate(@NotNull UUID id_exercicio_grupo, @NotNull String nome, @NotNull UUID id_grupo) {
}
