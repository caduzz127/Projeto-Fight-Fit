package com.fightfit.fightfitapi.dtos.exercicios_grupo;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExerciciosGrupoCreate(@NotNull UUID id_grupo, @NotNull String nome_exercicio) {
}
