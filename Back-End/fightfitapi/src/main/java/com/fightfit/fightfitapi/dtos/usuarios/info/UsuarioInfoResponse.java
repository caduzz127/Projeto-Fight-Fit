package com.fightfit.fightfitapi.dtos.usuarios.info;

import java.util.UUID;
import java.util.List;

public record UsuarioInfoResponse(UUID id_usuario, String username, List<UsuarioTreinoInfoResponse> treinos) {
}
