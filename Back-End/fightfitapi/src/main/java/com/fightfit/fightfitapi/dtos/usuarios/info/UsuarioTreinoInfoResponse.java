package com.fightfit.fightfitapi.dtos.usuarios.info;

import java.util.List;
import java.util.UUID;

public record UsuarioTreinoInfoResponse(UUID id, String nome, List<UsuarioTreinoExerciciosIndividuaisInfoResponse> exercicios){
}
