package com.fightfit.fightfitapi.dtos.usuarios;

import java.util.List;
import java.util.UUID;

public record UsuarioLoginResponse(UUID id, String token, String username) {
}
