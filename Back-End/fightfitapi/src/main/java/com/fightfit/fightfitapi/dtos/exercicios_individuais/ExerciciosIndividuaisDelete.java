package com.fightfit.fightfitapi.dtos.exercicios_individuais;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExerciciosIndividuaisDelete(@NotNull UUID id,@NotNull  UUID id_treino) {
}
