package com.fightfit.fightfitapi.dtos.exercicios_grupo;

import java.util.List;
import java.util.UUID;

public record ExerciciosGrupoResponse(UUID id_exercicio_grupo, String nome_exercicio_grupo, UUID id_grupo, List<ExerciciosGrupoUsuariosResponse> usuarios) {



}

