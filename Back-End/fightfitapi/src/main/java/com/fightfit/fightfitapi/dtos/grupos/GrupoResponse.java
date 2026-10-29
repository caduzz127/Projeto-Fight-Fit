package com.fightfit.fightfitapi.dtos.grupos;


import com.fightfit.fightfitapi.models.GrupoMembros;

import java.util.UUID;

public record GrupoResponse(UUID id_do_grupo, String nome_do_grupo, GrupoUsuarioResponse administrador) {
}
