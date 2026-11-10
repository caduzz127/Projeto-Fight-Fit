package com.fightfit.fightfitapi.service;

import com.fightfit.fightfitapi.dtos.treinos.*;
import com.fightfit.fightfitapi.exceptions.NotPermission;
import com.fightfit.fightfitapi.exceptions.treinos.TreinoNotExists;
import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioNotExists;
import com.fightfit.fightfitapi.models.ExerciciosIndividuais;
import com.fightfit.fightfitapi.models.Treino;
import com.fightfit.fightfitapi.models.Usuarios;
import com.fightfit.fightfitapi.repositorys.TreinoRepository;
import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TreinoService {

    @Autowired
    private TreinoRepository treinoRepository;
    @Autowired
    private UsuariosRepository usuariosRepository;




    public TreinoResponse salvarTreino(String nome, UUID id){
        Usuarios usuario = usuariosRepository.findById(id).orElseThrow(()-> new UsuarioNotExists("usuário não existe"));

        Treino treino = Treino.builder()
                .nome(nome)
                .usuario(usuario)
                .build();

        Treino save = treinoRepository.save(treino);
        TreinoResponse response = new TreinoResponse(
                save.getId(),
                save.getNome()
        );
        return response;
    }

    public List<TreinoBuscarResponse> buscarTreinosByNameAndUsuario(String nome, UUID id_usuario ){
       List<Treino> treinos = treinoRepository.findByNameIlike("%"+nome+"%", id_usuario);
       List<TreinoBuscarResponse> treinosResponseList = new ArrayList<>();
       for(Treino treino : treinos){
           List<TreinoExerciciosIndividuaisBuscarResponse> exerciciosIndividuaisList = new ArrayList<>();
           for (ExerciciosIndividuais exerciciosIndividuais : treino.getExerciciosIndividuais()){
               TreinoExerciciosIndividuaisBuscarResponse treinoExerciciosIndividuaisResponse = new TreinoExerciciosIndividuaisBuscarResponse(
                       exerciciosIndividuais.getNome()
               );
               exerciciosIndividuaisList.add(treinoExerciciosIndividuaisResponse);
           }
           TreinoBuscarResponse treinosResponse = new TreinoBuscarResponse(
                   treino.getId(),
                   treino.getNome(),
                   exerciciosIndividuaisList
           );
           treinosResponseList.add(treinosResponse);
       }

        return treinosResponseList;
    }

    public void deletarTreino(UUID id, UUID id_usuario){
        Usuarios usuario = usuariosRepository.findById(id_usuario).orElseThrow(()-> new UsuarioNotExists("Não existe um usuário com esse username!"));
        Treino treino = treinoRepository.findById(id).orElseThrow(()-> new UsuarioNotExists("Não existe esse treino!"));
        verificarUsuario(treino.getId(), id_usuario);
        treinoRepository.deleteById(id);
    }


    public TreinoResponse atualizarTreino(UUID id_usuario,TreinoUpdate update){

        Usuarios usuario = usuariosRepository.findById(id_usuario).orElseThrow(()-> new UsuarioNotExists("Não existe um usuário!"));
        Treino treino = treinoRepository.findById(update.id()).orElseThrow(()-> new UsuarioNotExists("Não existe esse treino!"));
        verificarUsuario(treino.getId(), id_usuario);
        treino = Treino.builder()
                .id(treino.getId())
                .usuario(usuario)
                .nome(update.nome())
                .build();
        Treino up = treinoRepository.save(treino);
        TreinoResponse response = new TreinoResponse(
                up.getId(),
                up.getNome()
        );
        return response;
    }

    public List<TreinoBuscarResponse> buscarTreinosByUsuario(UUID id){
        Usuarios usuario = usuariosRepository.findById(id).orElseThrow(()-> new UsuarioNotExists("usuario não existente"));
        List<Treino> treinos = treinoRepository.findByUsuario(usuario.getId());
        List<TreinoBuscarResponse> treinosResponse = new ArrayList<>();
        for(Treino tr : treinos){
            List<TreinoExerciciosIndividuaisBuscarResponse> exerciciosResponse = new ArrayList<>();
            for (ExerciciosIndividuais ex : tr.getExerciciosIndividuais()){
                TreinoExerciciosIndividuaisBuscarResponse exercResponse = new TreinoExerciciosIndividuaisBuscarResponse(
                        ex.getNome()
                );
                exerciciosResponse.add(exercResponse);
            }
            TreinoBuscarResponse response = new TreinoBuscarResponse(
                    tr.getId(),
                    tr.getNome(),
                    exerciciosResponse
            );
            treinosResponse.add(response);
        }

        return treinosResponse;
    }


    private void verificarUsuario(UUID id_treino, UUID id_usuario){
        Treino treino = treinoRepository.findById(id_treino).orElseThrow(()-> new TreinoNotExists("Não existe esse treino no sistema!"));
        Usuarios usuarios = usuariosRepository.findById(id_usuario).orElseThrow(()-> new TreinoNotExists("Não existe esse usuario no sistema!"));
        if(!treino.getUsuario().getId().equals(usuarios.getId())){
            throw new NotPermission("treino não pertence ao usuario");
        }
    }
}
