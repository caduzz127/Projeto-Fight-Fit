package com.fightfit.fightfitapi.exceptions;

public class NotPermission extends RuntimeException {
    public NotPermission(String message) {
        super(message);
    }
}
