package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.dtos.exercicios_grupo.ExerciciosGrupoCreate;
import com.fightfit.fightfitapi.dtos.exercicios_grupo.ExerciciosGrupoDelete;
import com.fightfit.fightfitapi.dtos.exercicios_grupo.ExerciciosGrupoResponse;
import com.fightfit.fightfitapi.dtos.exercicios_grupo.ExerciciosGrupoUpdate;
import com.fightfit.fightfitapi.dtos.exercicios_individuais.*;
import com.fightfit.fightfitapi.models.ExerciciosGrupo;
import com.fightfit.fightfitapi.service.ExerciciosGrupoService;
import com.fightfit.fightfitapi.service.ExerciciosIndividuaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin("*")
@RestController
@RequestMapping("/fight-fit/exercicio-grupo")
public class ExercicioGrupoController {


    @Autowired
    private ExerciciosGrupoService exerciciosGrupoService;

    @PostMapping("/cadastrar")
    public ResponseEntity<ExerciciosGrupoResponse> salvar(@RequestBody ExerciciosGrupoCreate create, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(exerciciosGrupoService.cadastrar(create, UUID.fromString(jwt.getSubject())));
    }

    @PutMapping("/atualizar")
    public ResponseEntity<ExerciciosGrupoResponse> salvar(@RequestBody ExerciciosGrupoUpdate update, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(exerciciosGrupoService.atualizar(update, UUID.fromString(jwt.getSubject())));
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<?> deletar(@RequestBody ExerciciosGrupoDelete delete){
        exerciciosGrupoService.deletar(delete);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/buscar/{id_grupo}/{nome}")
    public ResponseEntity<List<ExerciciosGrupoResponse>> buscarPeloNome(@PathVariable("id_grupo") UUID id_grupo,@PathVariable("nome") String nome){
        return ResponseEntity.ok().body(exerciciosGrupoService.buscarPorNome(id_grupo,nome));
    }

}
