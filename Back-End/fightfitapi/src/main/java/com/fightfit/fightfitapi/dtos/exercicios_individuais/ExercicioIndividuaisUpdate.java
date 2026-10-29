package com.fightfit.fightfitapi.dtos.exercicios_individuais;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExercicioIndividuaisUpdate(@NotNull UUID id,@NotNull  UUID id_treino,@NotNull  String nome,@NotNull  double carga,@NotNull  Integer repeticoes,@NotNull  Integer serie) {
}
