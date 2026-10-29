package com.fightfit.fightfitapi.dtos.grupos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GrupoDelete(@NotNull UUID id_grupo,@NotNull  String senha) {
}
