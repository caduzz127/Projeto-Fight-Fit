package com.fightfit.fightfitapi.dtos.usuarios;

import jakarta.validation.constraints.NotNull;

public record UsuarioLogin(@NotNull String username, @NotNull String senha) {
}
