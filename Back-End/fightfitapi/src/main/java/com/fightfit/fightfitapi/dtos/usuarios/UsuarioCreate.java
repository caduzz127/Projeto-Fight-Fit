package com.fightfit.fightfitapi.dtos.usuarios;

import jakarta.validation.constraints.NotNull;

public record UsuarioCreate(@NotNull String nome, @NotNull String senha) {
}
