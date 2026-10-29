package com.fightfit.fightfitapi.dtos.grupos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GrupoEnter(@NotNull UUID id_grupo, @NotNull String senha) {
}
