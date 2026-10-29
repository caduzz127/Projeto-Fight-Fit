package com.fightfit.fightfitapi.security.config;

import com.fightfit.fightfitapi.security.validator.TokenVersionValidator;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
public class JwtConfiguration {

    @Bean
    public JwtEncoder jwtEncoder(@Value("${JWT_SECRET_BASE64}") String secretBase64) {
        byte[] secretBytes = Base64.getDecoder().decode(secretBase64);

        if (secretBytes.length < 32) {
            throw new IllegalArgumentException("A chave JWT deve ter pelo menos 32 bytes");
        }

        SecretKey secretKey = new SecretKeySpec(secretBytes, "HmacSHA256");

        return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${JWT_SECRET_BASE64}") String secretBase64, TokenVersionValidator tokenVersionValidator){
        byte[] chave = Base64.getDecoder().decode(secretBase64);

        SecretKey secretKey = new SecretKeySpec(chave, "HmacSHA256");

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(JwtValidators.createDefaultWithIssuer("fightfit-api"), tokenVersionValidator);

        decoder.setJwtValidator(validator);

        return decoder;
    }

}
