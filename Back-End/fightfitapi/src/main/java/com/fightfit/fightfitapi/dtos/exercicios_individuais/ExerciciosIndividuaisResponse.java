package com.fightfit.fightfitapi.dtos.exercicios_individuais;

import java.util.UUID;

public record ExerciciosIndividuaisResponse(UUID id, UUID id_treino, String nome, double carga, Integer repeticoes, Integer serie) {
}
