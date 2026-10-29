package com.fightfit.fightfitapi.dtos.participantes_exercicios;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ParticipanteExerciciosEnter(@NotNull UUID id_exericicio_grupo, @NotNull UUID id_grupo, @NotNull Integer serie, @NotNull Integer repeticoes, @NotNull double carga) {
}
