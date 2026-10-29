package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.dtos.usuarios.*;
import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioInfoResponse;
import com.fightfit.fightfitapi.security.model.CustomUserDetails;
import com.fightfit.fightfitapi.security.service.JwtService;
import com.fightfit.fightfitapi.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fight-fit/usuarios")
@CrossOrigin("*")
public class UsuariosController {

    @Autowired
    private UsuariosService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> salvar(@RequestBody UsuarioCreate create){
       usuarioService.salvarUsuario(create);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@RequestBody UsuarioLogin login){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    login.username(),
                    login.senha()
                )
        );
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.gerarToken(customUserDetails);
        UsuarioResponse reponse = new UsuarioResponse(
                customUserDetails.getUsername(),
                token
        );
        return ResponseEntity.ok().body(reponse);
    }

    @GetMapping("/pesquisar/{nome}")
    public ResponseEntity<List<UsuariosListResponse>> pesquisar(@PathVariable("nome") String nome){
        List<UsuariosListResponse> response = usuarioService.buscarUsuarios(nome);
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/atualizar")
    public ResponseEntity<UsuarioResponse> atualizar(@RequestBody UsuarioUpdate update){
        UsuarioResponse response = usuarioService.atualizarUsuario(update);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<?> deletar(@AuthenticationPrincipal Jwt jwt, @RequestBody String senha){
        usuarioService.deleteUsuario(UUID.fromString(jwt.getSubject()), senha);
        return ResponseEntity.noContent().build();
    }


}
