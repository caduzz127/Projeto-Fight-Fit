package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.dtos.exercicios_grupo.ExerciciosGrupoResponse;
import com.fightfit.fightfitapi.dtos.participantes_exercicios.ParticipanteExerciciosEnter;
import com.fightfit.fightfitapi.dtos.participantes_exercicios.ParticipanteExerciciosExit;
import com.fightfit.fightfitapi.dtos.participantes_exercicios.ParticipanteExerciciosUpdate;
import com.fightfit.fightfitapi.service.ParticipantesExerciciosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin("*")
@RequestMapping("/fight-fit/participantes")
public class ParticipantesExerciciosController {

    @Autowired
    private ParticipantesExerciciosService participantesExerciciosService;

    @PostMapping("/entrar")
    public ResponseEntity<ExerciciosGrupoResponse> entrar(@RequestBody ParticipanteExerciciosEnter enter, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(participantesExerciciosService.entrar(enter, UUID.fromString(jwt.getSubject())));
    }

    @PutMapping("/atualizar")
    public ResponseEntity<ExerciciosGrupoResponse> atualizar(@RequestBody ParticipanteExerciciosUpdate update){
        return ResponseEntity.ok().body(participantesExerciciosService.atualizar(update));
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<?> deletar(@RequestBody ParticipanteExerciciosExit delete){
        participantesExerciciosService.sair(delete);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<ExerciciosGrupoResponse> deletar(@PathVariable("id") UUID id){
        ExerciciosGrupoResponse response = participantesExerciciosService.buscarPeloExercicio(id);
        return ResponseEntity.ok().body(response);
    }

}
