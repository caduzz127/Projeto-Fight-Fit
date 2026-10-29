package com.fightfit.fightfitapi.security.service;

import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioNotExists;
import com.fightfit.fightfitapi.models.Usuarios;
import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import com.fightfit.fightfitapi.security.model.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.support.JettyHeadersAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class JwtService {

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private UsuariosRepository usuariosRepository;


    public String gerarToken(CustomUserDetails usuario){
        Usuarios usuarioBanco = usuariosRepository.findById(usuario.getId()).orElseThrow(()-> new UsuarioNotExists("usuário não existe"));

        Instant gerado = Instant.now();

        Instant expira = gerado.plus(15, ChronoUnit.MINUTES);


        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("fightfit-api")
                .subject(usuario.getId().toString())
                .issuedAt(gerado)
                .expiresAt(expira)
                .claim("token_version", usuarioBanco.getToken_version())
                .claim("roles", usuarioBanco.getRoles())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        Jwt jwt = jwtEncoder.encode(JwtEncoderParameters.from(header,claims));

        return jwt.getTokenValue();
    }

    public String gerarToken(Usuarios usuario){
        Usuarios usuarioBanco = usuariosRepository.findById(usuario.getId()).orElseThrow(()-> new UsuarioNotExists("usuário não existe"));

        Instant gerado = Instant.now();

        Instant expira = gerado.plus(15, ChronoUnit.MINUTES);


        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("fightfit-api")
                .subject(usuario.getId().toString())
                .issuedAt(gerado)
                .expiresAt(expira)
                .claim("token_version", usuarioBanco.getToken_version())
                .claim("roles", usuarioBanco.getRoles())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        Jwt jwt = jwtEncoder.encode(JwtEncoderParameters.from(header,claims));

        return jwt.getTokenValue();
    }
}
