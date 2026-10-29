package com.fightfit.fightfitapi.dtos.treinos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record TreinoRequestById(@NotNull UUID id) {
}
