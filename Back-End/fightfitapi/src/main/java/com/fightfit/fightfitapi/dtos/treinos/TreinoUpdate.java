package com.fightfit.fightfitapi.dtos.treinos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record TreinoUpdate(@NotNull UUID id, @NotNull String nome){
}
