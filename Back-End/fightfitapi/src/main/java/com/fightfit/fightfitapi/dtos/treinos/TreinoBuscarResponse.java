package com.fightfit.fightfitapi.dtos.treinos;

import java.util.List;
import java.util.UUID;

public record TreinoBuscarResponse (UUID id_treino, String nome_treino, List<TreinoExerciciosIndividuaisBuscarResponse> exerciciosIndividuaisList){
}
