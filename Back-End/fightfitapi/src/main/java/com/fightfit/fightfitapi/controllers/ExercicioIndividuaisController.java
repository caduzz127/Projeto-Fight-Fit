package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.dtos.exercicios_individuais.*;
import com.fightfit.fightfitapi.service.ExerciciosIndividuaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fight-fit/exercicios-individuais")
@CrossOrigin("*")
public class ExercicioIndividuaisController {

    @Autowired
    private ExerciciosIndividuaisService exerciciosIndividuaisService;

    @PostMapping("/cadastrar")
    public ResponseEntity<ExerciciosIndividuaisResponse> salvar(@RequestBody ExerciciosIndividuaisCreate create, @AuthenticationPrincipal Jwt jwt){
        UUID id_usuario = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok().body(exerciciosIndividuaisService.salvarExerciciosIndividuais(create,id_usuario));
    }

    @PutMapping("/atualizar")
    public ResponseEntity<ExerciciosIndividuaisResponse> atualizar(@RequestBody ExercicioIndividuaisUpdate update, @AuthenticationPrincipal Jwt jwt){
        UUID id_usuario = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok().body(exerciciosIndividuaisService.atualizarExerciciosIndividuais(update,id_usuario));
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<?> deletar(@RequestBody ExerciciosIndividuaisDelete delete, @AuthenticationPrincipal Jwt jwt){
        UUID id_usuario = UUID.fromString(jwt.getSubject());
        exerciciosIndividuaisService.deletarExerciciosIndividuais(delete,id_usuario);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/buscar-por-treino/{id}")
    public ResponseEntity<List<ExerciciosIndividuaisResponse>> buscarPorTreino(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt){
        UUID id_usuario = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok().body(exerciciosIndividuaisService.buscarPeloIdTreino(id,id_usuario));
    }

    @GetMapping("/buscar-por-nome")
    public ResponseEntity<List<ExerciciosIndividuaisResponse>> buscarPeloNome(@RequestBody ExercicioIndividuaisRequest request, @AuthenticationPrincipal Jwt jwt){
        UUID id_usuario = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok().body(exerciciosIndividuaisService.buscarExerciciosIndividuais(request,id_usuario));
    }

}
