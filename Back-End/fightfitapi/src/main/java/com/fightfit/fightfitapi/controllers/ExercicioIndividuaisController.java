package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.dtos.exercicios_individuais.*;
import com.fightfit.fightfitapi.service.ExerciciosIndividuaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ExerciciosIndividuaisResponse> salvar(@RequestBody ExerciciosIndividuaisCreate create){
        return ResponseEntity.ok().body(exerciciosIndividuaisService.salvarExerciciosIndividuais(create));
    }

    @PutMapping("/atualizar")
    public ResponseEntity<ExerciciosIndividuaisResponse> atualizar(@RequestBody ExercicioIndividuaisUpdate update){
        return ResponseEntity.ok().body(exerciciosIndividuaisService.atualizarExerciciosIndividuais(update));
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<?> deletar(@RequestBody ExerciciosIndividuaisDelete delete){
        exerciciosIndividuaisService.deletarExerciciosIndividuais(delete);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/buscar-por-treino/{id}")
    public ResponseEntity<List<ExerciciosIndividuaisResponse>> buscarPorTreino(@PathVariable UUID id){
        return ResponseEntity.ok().body(exerciciosIndividuaisService.buscarPeloIdTreino(id));
    }

    @GetMapping("/buscar-por-nome")
    public ResponseEntity<List<ExerciciosIndividuaisResponse>> buscarPeloNome(@RequestBody ExercicioIndividuaisRequest request){
        return ResponseEntity.ok().body(exerciciosIndividuaisService.buscarExerciciosIndividuais(request));
    }

}
