package com.fightfit.fightfitapi.controllers.admin;

import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioInfoResponse;
import com.fightfit.fightfitapi.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/fight-fit/admin")
@RestController
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @GetMapping("/user/all")
    public ResponseEntity<List<UsuarioInfoResponse>> findAllUsers(){
        return ResponseEntity.ok().body(administradorService.findAll());
    }
}
