package com.fightfit.fightfitapi.exceptions.usuarios;

public class UsuarioNotExists extends RuntimeException {
    public UsuarioNotExists(String message) {
        super(message);
    }
}
