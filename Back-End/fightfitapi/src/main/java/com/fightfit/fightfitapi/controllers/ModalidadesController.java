package com.fightfit.fightfitapi.controllers;

import com.fightfit.fightfitapi.models.Modalidades;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/fight-fit/modalidades")
public class ModalidadesController {

    @GetMapping()
    public String[] modalidades(){
        return Arrays.stream(Modalidades.values()).map(Enum::name).toArray(String[]::new);
    }
}
