package com.fightfit.fightfitapi.dtos.usuarios;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UsuarioUpdate(@NotNull String username, @NotNull String usernameNovo, @NotNull String senhaAntiga, @NotNull String senhaNova) {
}
