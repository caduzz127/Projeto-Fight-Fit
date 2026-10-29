package com.fightfit.fightfitapi.exceptions.usuarios;

public class UsuarioAlreadyExists extends RuntimeException {
    public UsuarioAlreadyExists(String message) {
        super(message);
    }
}
