package com.fightfit.fightfitapi.dtos.exercicios_grupo;

import java.util.UUID;

public record ExerciciosGrupoUsuariosResponse(UUID id_usuario, String nome_usuario, Integer serie, double carga, Integer repeticoes) {
}
