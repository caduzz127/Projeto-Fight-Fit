package com.fightfit.fightfitapi.security.validator;

import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TokenVersionValidator implements OAuth2TokenValidator<Jwt> {

    @Autowired
    UsuariosRepository usuarioRepository;

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {

        OAuth2Error erro = new OAuth2Error(
                "invalid_token",
                "Token inválido ou revogado",
                null
        );

        // 1. Recuperar a versão do JWT
        Object claim = jwt.getClaim("token_version");

        if (!(claim instanceof Number versaoToken)) {
            return OAuth2TokenValidatorResult.failure(erro);
        }

        // 2. Recuperar o UUID do usuário
        UUID usuarioId;

        try {
            usuarioId = UUID.fromString(jwt.getSubject());
        } catch (RuntimeException exception) {
            return OAuth2TokenValidatorResult.failure(erro);
        }

        // 3. Buscar o usuário no PostgreSQL
        var usuario = usuarioRepository.findById(usuarioId);

        if (usuario.isEmpty()) {
            return OAuth2TokenValidatorResult.failure(erro);
        }

        // 4. Comparar as versões
        Integer versaoBanco = usuario.get().getToken_version();

        if (versaoBanco == null || versaoToken.longValue() != versaoBanco.longValue()) {
            return OAuth2TokenValidatorResult.failure(erro);
        }

        // 5. Aprovar a validação
        return OAuth2TokenValidatorResult.success();
    }
}
