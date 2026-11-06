package com.fightfit.fightfitapi.dtos.grupos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GrupoUpdate(@NotNull UUID id_grupo, @NotNull String nome, @NotNull String senhaAntiga, @NotNull String senhaNova) {
}
