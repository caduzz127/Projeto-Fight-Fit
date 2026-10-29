package com.fightfit.fightfitapi.dtos.exercicios_individuais;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExercicioIndividuaisRequest(@NotNull String nome,@NotNull UUID id_treino) {
}
