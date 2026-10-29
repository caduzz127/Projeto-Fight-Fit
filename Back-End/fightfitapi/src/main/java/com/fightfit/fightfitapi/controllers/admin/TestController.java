package com.fightfit.fightfitapi.controllers.admin;

import com.fightfit.fightfitapi.dtos.usuarios.UsuarioLogin;
import com.fightfit.fightfitapi.dtos.usuarios.UsuarioLoginResponse;
import com.fightfit.fightfitapi.security.model.CustomUserDetails;
import com.fightfit.fightfitapi.security.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin("*")
public class TestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/teste-auth")
    public String testeVerificacao(Authentication authentication){
        if (authentication == null){
            return "nenhum usuario encontrado";
        }

        return """
                Nome: %s
                Autenticado: %s
                Authorities: %s"""
                .formatted(
                        authentication.getName(),
                        authentication.isAuthenticated(),
                        authentication.getAuthorities()
                );
    }

    @GetMapping("/publico")
    public String publico() {
        return "Rota pública";
    }

    @GetMapping("/perfil")
    public String perfil(Authentication authentication) {
        return "Usuário: " + authentication.getName()
                + " | Roles: " + authentication.getAuthorities();
    }

    @GetMapping("/admin")
    public String admin() {
        return "Área do administrador";
    }

    @GetMapping("/moderador")
    public String moderador(Authentication authentication) {
        return "Área do moderador do sistema" + "\nnome: "+authentication.getName()+"\ncargo: "+authentication.getAuthorities();
    }

    @PostMapping("/user")
    public ResponseEntity<UsuarioLoginResponse> userSecurity(@RequestBody UsuarioLogin login){
        System.out.println("user: "+login.username());
        System.out.println("senha: "+login.senha());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.username(),
                        login.senha()
                )
        );
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.gerarToken(user);
        UsuarioLoginResponse response = new UsuarioLoginResponse(
                user.getId(),
                token,
                user.getUsername()

        );
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UUID> me(@RequestBody String nome, @AuthenticationPrincipal Jwt jwt){
        UUID id = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok().body(id);
    }



}
