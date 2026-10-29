package com.fightfit.fightfitapi.dtos.grupos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GrupoCreate(@NotNull String nome, @NotNull String senha) {
}
