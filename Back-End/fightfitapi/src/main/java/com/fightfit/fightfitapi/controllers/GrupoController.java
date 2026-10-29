package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.dtos.grupos.*;
import com.fightfit.fightfitapi.service.GrupoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fight-fit/grupos")
@CrossOrigin("*")
public class GrupoController {

    @Autowired
    private GrupoService service;


    @PostMapping("/cadastrar")
    public ResponseEntity<GrupoResponse> cadastrar(@RequestBody GrupoCreate create, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(service.criarGrupo(create, UUID.fromString(jwt.getSubject())));
    }

    @PostMapping("/entrar")
    public ResponseEntity<GrupoAllResponse> entrar(@RequestBody GrupoEnter enter, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(service.entrarGrupo(enter, UUID.fromString(jwt.getSubject())));
    }

    @PutMapping("/atualizar")
    public ResponseEntity<GrupoAllResponse> atualizar(@RequestBody GrupoUpdate update, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok().body(service.atualizarGrupo(update, UUID.fromString(jwt.getSubject())));
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<?> deletar(@RequestBody GrupoDelete delete, @AuthenticationPrincipal Jwt jwt){
        service.deleteGrupo(delete, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/sair/{id}")
    public ResponseEntity<?> sair(@PathVariable("id")UUID id, @AuthenticationPrincipal Jwt jwt){
        service.sairGrupo(id, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/buscar-pelo-nome/{nome}")
    public ResponseEntity<List<GrupoResponse>> buscarPeloNome(@PathVariable("nome") String nome){
        return ResponseEntity.ok().body(service.buscarPeloNome(nome));
    }

    @GetMapping("/buscar-pelo-usuario/{id}")
    public ResponseEntity<List<GrupoResponse>> buscarPeloUsuario(@PathVariable("id")UUID id){
        return ResponseEntity.ok().body(service.buscarPeloUsuario(id));
    }

    @GetMapping("/buscar-pelo-id/{id}")
    public ResponseEntity<GrupoAllResponse> buscarPeloId(@PathVariable("id")UUID id){
        return ResponseEntity.ok().body(service.buscarPeloId(id));
    }



}
