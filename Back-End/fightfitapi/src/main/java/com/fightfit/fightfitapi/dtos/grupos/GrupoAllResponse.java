package com.fightfit.fightfitapi.dtos.grupos;


import java.util.List;
import java.util.UUID;

public record GrupoAllResponse(UUID id_do_grupo, String nome_do_grupo, List<GrupoUsuarioResponse> usuarios) {
}
