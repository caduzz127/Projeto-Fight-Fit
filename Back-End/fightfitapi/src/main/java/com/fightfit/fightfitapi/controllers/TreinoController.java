package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.dtos.exercicios_individuais.ExerciciosIndividuaisCreate;
import com.fightfit.fightfitapi.dtos.treinos.*;
import com.fightfit.fightfitapi.service.TreinoService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fight-fit/treinos")
@CrossOrigin("*")
public class TreinoController {

    @Autowired
    TreinoService treinoService;

    @PostMapping("/cadastrar/{nome}")
    public ResponseEntity<TreinoResponse> cadastrar(@PathVariable("nome") String nome,@AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(treinoService.salvarTreino(nome, UUID.fromString(jwt.getSubject())));
    }

    @PutMapping("/atualizar")
    public ResponseEntity<TreinoResponse> cadastrar(@RequestBody TreinoUpdate update, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(treinoService.atualizarTreino(UUID.fromString(jwt.getSubject()),update));
    }

    @GetMapping("/buscar-por-nome/{nome}")
    public ResponseEntity<List<TreinoBuscarResponse>> buscarPorNomeAndUsuario(@PathVariable("nome") String nome, @AuthenticationPrincipal Jwt jwt){
        UUID id = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok().body(treinoService.buscarTreinosByNameAndUsuario(nome,id));
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable("id")UUID id,@AuthenticationPrincipal Jwt jwt){
       treinoService.deletarTreino(id, UUID.fromString(jwt.getSubject()));
       return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar-pelo-usuario")
    public ResponseEntity<List<TreinoBuscarResponse>> buscarPeloUsuario(@AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(treinoService.buscarTreinosByUsuario(UUID.fromString(jwt.getSubject())));
    }
}
