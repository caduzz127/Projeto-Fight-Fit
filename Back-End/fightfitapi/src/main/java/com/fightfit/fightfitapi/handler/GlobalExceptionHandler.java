package com.fightfit.fightfitapi.handler;

import com.fightfit.fightfitapi.exceptions.exerciciosIndividuais.ExerciciosIndividuaisNotExists;
import com.fightfit.fightfitapi.exceptions.grupos.GrupoAlreadyExists;
import com.fightfit.fightfitapi.exceptions.grupos.GrupoNotExists;
import com.fightfit.fightfitapi.exceptions.grupos.NotPermission;
import com.fightfit.fightfitapi.exceptions.treinos.TreinoNotExists;
import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioAlreadyExists;
import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioNotExists;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(UsuarioAlreadyExists.class)
    public ResponseEntity<ResponseError> usuarioAlreadyExists(UsuarioAlreadyExists exception){
        ResponseError response = new ResponseError(
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }


    @ExceptionHandler(UsuarioNotExists.class)
    public ResponseEntity<ResponseError> usuarioNotExists(UsuarioNotExists exception){
        ResponseError response = new ResponseError(
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(TreinoNotExists.class)
    public ResponseEntity<ResponseError> treinoNotExists(TreinoNotExists exception){
        ResponseError response = new ResponseError(
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(ExerciciosIndividuaisNotExists.class)
    public ResponseEntity<ResponseError> exerciciosIndividuaisNotExists(ExerciciosIndividuaisNotExists exception){
        ResponseError response = new ResponseError(
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(GrupoAlreadyExists.class)
    public ResponseEntity<ResponseError> grupoAlreadyExists(GrupoAlreadyExists exception){
        ResponseError response = new ResponseError(
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(GrupoNotExists.class)
    public ResponseEntity<ResponseError> grupoNotExists(GrupoNotExists exception){
        ResponseError response = new ResponseError(
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }


    @ExceptionHandler(NotPermission.class)
    public ResponseEntity<ResponseError> notPermission(NotPermission exception){
        ResponseError response = new ResponseError(
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseError> runtime(RuntimeException exception){
        ResponseError response = new ResponseError(
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}
