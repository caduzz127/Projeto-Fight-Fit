package com.fightfit.fightfitapi.service;

import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioInfoResponse;
import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioTreinoExerciciosIndividuaisInfoResponse;
import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioTreinoInfoResponse;
import com.fightfit.fightfitapi.models.ExerciciosIndividuais;
import com.fightfit.fightfitapi.models.Treino;
import com.fightfit.fightfitapi.models.Usuarios;
import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class AdministradorService {

    @Autowired
    private UsuariosRepository usuariosRepository;


    public List<UsuarioInfoResponse> findAll(){
        List<Usuarios> usuarios = usuariosRepository.findAll();
        List<UsuarioInfoResponse> response = new ArrayList<>();
        for(Usuarios usu : usuarios){
            List<UsuarioTreinoInfoResponse> treinos = new ArrayList<>();
            for (Treino tr : usu.getTreinos()){
                List<UsuarioTreinoExerciciosIndividuaisInfoResponse> exercicios = new ArrayList<>();
                for(ExerciciosIndividuais exer : tr.getExerciciosIndividuais()){
                    UsuarioTreinoExerciciosIndividuaisInfoResponse exerciciosIndividuaisInfo = new UsuarioTreinoExerciciosIndividuaisInfoResponse(
                            exer.getId(),
                            exer.getNome()
                    );
                    exercicios.add(exerciciosIndividuaisInfo);
                }
                UsuarioTreinoInfoResponse treino = new UsuarioTreinoInfoResponse(
                        tr.getId(),
                        tr.getNome(),
                        exercicios
                );
                treinos.add(treino);
            }
            UsuarioInfoResponse usuarioInfo = new UsuarioInfoResponse(
                    usu.getId(),
                    usu.getNome(),
                    treinos
            );
            response.add(usuarioInfo);
        }
        return response;
    }
}
