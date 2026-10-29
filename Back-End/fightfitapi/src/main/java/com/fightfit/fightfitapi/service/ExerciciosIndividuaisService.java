package com.fightfit.fightfitapi.service;

import com.fightfit.fightfitapi.dtos.exercicios_individuais.*;
import com.fightfit.fightfitapi.exceptions.exerciciosIndividuais.ExerciciosIndividuaisNotExists;
import com.fightfit.fightfitapi.exceptions.treinos.TreinoNotExists;
import com.fightfit.fightfitapi.models.ExerciciosIndividuais;
import com.fightfit.fightfitapi.models.Treino;
import com.fightfit.fightfitapi.repositorys.ExerciciosIndividuaisRespository;
import com.fightfit.fightfitapi.repositorys.TreinoRepository;
import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ExerciciosIndividuaisService {

    @Autowired
    private ExerciciosIndividuaisRespository exerciciosIndividuaisRespository;

    @Autowired
    private TreinoRepository treinoRepository;



    public ExerciciosIndividuaisResponse salvarExerciciosIndividuais(ExerciciosIndividuaisCreate create){
        Treino treino = treinoRepository.findById(create.id_treino()).orElseThrow(()-> new TreinoNotExists("Não existe esse treino no sistema!"));
        ExerciciosIndividuais exerciciosIndividuais = ExerciciosIndividuais.builder()
                .nome(create.nome())
                .carga(create.carga())
                .series(create.serie())
                .treinos(treino)
                .repeticoes(create.repeticoes())
                .build();

        ExerciciosIndividuais save = exerciciosIndividuaisRespository.save(exerciciosIndividuais);
        ExerciciosIndividuaisResponse response = new ExerciciosIndividuaisResponse(
                save.getId(),
                save.getTreinos().getId(),
                save.getNome(),
                save.getCarga(),
                save.getRepeticoes(),
                save.getSeries()
        );
        return response;
    }


    public List<ExerciciosIndividuaisResponse> buscarExerciciosIndividuais(ExercicioIndividuaisRequest request){
        List<ExerciciosIndividuais> exerciciosIndividuais = exerciciosIndividuaisRespository.findByNameIlikeAndIdTreino("%"+request.nome()+"%", request.id_treino());
        List<ExerciciosIndividuaisResponse> exerciciosIndividuaisResponseList = new ArrayList<>();
        for(ExerciciosIndividuais exercicio : exerciciosIndividuais){
            ExerciciosIndividuaisResponse exerciciosIndividuaisResponse = new ExerciciosIndividuaisResponse(
                    exercicio.getId(),
                    exercicio.getTreinos().getId(),
                    exercicio.getNome(),
                    exercicio.getCarga(),
                    exercicio.getRepeticoes(),
                    exercicio.getSeries()
            );
            exerciciosIndividuaisResponseList.add(exerciciosIndividuaisResponse);
        }

        return exerciciosIndividuaisResponseList;
    }


    public void deletarExerciciosIndividuais(ExerciciosIndividuaisDelete delete){
        Treino treino = treinoRepository.findById(delete.id_treino()).orElseThrow(()-> new TreinoNotExists("Não existe esse treino!"));
        ExerciciosIndividuais exerciciosIndividuais = exerciciosIndividuaisRespository.findById(delete.id()).orElseThrow(()-> new ExerciciosIndividuaisNotExists("Não existe esse exercicio!"));
        if(treino.getId()!=exerciciosIndividuais.getTreinos().getId()){
            throw new RuntimeException("Treino incorreto, exercício não pertence a esse Treino!");
        }
        exerciciosIndividuaisRespository.deleteById(exerciciosIndividuais.getId());
    }


    public ExerciciosIndividuaisResponse atualizarExerciciosIndividuais(ExercicioIndividuaisUpdate update){
        Treino treino = treinoRepository.findById(update.id_treino()).orElseThrow(()-> new TreinoNotExists("Não existe esse treino no sistema!"));
        ExerciciosIndividuais exerciciosIndividuais = exerciciosIndividuaisRespository.findById(update.id()).orElseThrow(()-> new ExerciciosIndividuaisNotExists("não existe esse exercicio!"));
        if(treino.getId()!=exerciciosIndividuais.getTreinos().getId()){
            throw new RuntimeException("Treino incorreto, exercício não pertence a esse Treino!");
        }
        exerciciosIndividuais = ExerciciosIndividuais.builder()
                .id(exerciciosIndividuais.getId())
                .nome(update.nome())
                .treinos(treino)
                .carga(update.carga())
                .repeticoes(update.repeticoes())
                .series(update.serie())
                .build();
        ExerciciosIndividuais up = exerciciosIndividuaisRespository.save(exerciciosIndividuais);
        ExerciciosIndividuaisResponse response = new ExerciciosIndividuaisResponse(
                up.getId(),
                up.getTreinos().getId(),
                up.getNome(),
                up.getCarga(),
                up.getRepeticoes(),
                up.getSeries()
        );
        return response;
    }

    public List<ExerciciosIndividuaisResponse> buscarPeloIdTreino(UUID id_treino){
        Treino treino = treinoRepository.findById(id_treino).orElseThrow(()-> new TreinoNotExists("Não existe esse treino no sistema!"));
        List<ExerciciosIndividuais> list = exerciciosIndividuaisRespository.findByTreino(treino.getId());
        List<ExerciciosIndividuaisResponse> listResponse = new ArrayList<>();
        for(ExerciciosIndividuais exerciciosIndividuais : list){
            ExerciciosIndividuaisResponse response = new ExerciciosIndividuaisResponse(
                    exerciciosIndividuais.getId(),
                    exerciciosIndividuais.getTreinos().getId(),
                    exerciciosIndividuais.getNome(),
                    exerciciosIndividuais.getCarga(),
                    exerciciosIndividuais.getRepeticoes(),
                    exerciciosIndividuais.getSeries()
            );

            listResponse.add(response);
        }

        return listResponse;
    }
}
