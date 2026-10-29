package com.fightfit.fightfitapi.dtos.exercicios_individuais;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExerciciosIndividuaisCreate(@NotNull UUID id_treino,@NotNull  String nome,@NotNull  Double carga,@NotNull  Integer repeticoes,@NotNull  Integer serie) {
}
