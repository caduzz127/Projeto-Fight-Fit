package com.fightfit.fightfitapi.dtos.participantes_exercicios;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ParticipanteExerciciosExit(@NotNull UUID id_exericicio_grupo, @NotNull UUID id_usuario, @NotNull UUID id_grupo) {
}
