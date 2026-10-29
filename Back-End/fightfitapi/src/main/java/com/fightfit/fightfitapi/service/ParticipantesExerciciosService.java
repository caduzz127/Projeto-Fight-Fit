package com.fightfit.fightfitapi.service;

import com.fightfit.fightfitapi.dtos.exercicios_grupo.ExerciciosGrupoResponse;
import com.fightfit.fightfitapi.dtos.exercicios_grupo.ExerciciosGrupoUsuariosResponse;
import com.fightfit.fightfitapi.dtos.participantes_exercicios.ParticipanteExerciciosEnter;
import com.fightfit.fightfitapi.dtos.participantes_exercicios.ParticipanteExerciciosExit;
import com.fightfit.fightfitapi.dtos.participantes_exercicios.ParticipanteExerciciosUpdate;
import com.fightfit.fightfitapi.models.ExerciciosGrupo;
import com.fightfit.fightfitapi.models.GrupoMembros;
import com.fightfit.fightfitapi.models.ParticipantesExercicios;
import com.fightfit.fightfitapi.repositorys.ExercicioGrupoRepository;
import com.fightfit.fightfitapi.repositorys.GrupoMembrosRepository;
import com.fightfit.fightfitapi.repositorys.ParticipantesExerciciosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ParticipantesExerciciosService {

    @Autowired
    private ExercicioGrupoRepository exercicioGrupoRepository;

    @Autowired
    private ParticipantesExerciciosRepository participantesExerciciosRepository;

    @Autowired
    private GrupoMembrosRepository grupoMembrosRepository;



    public ExerciciosGrupoResponse entrar(ParticipanteExerciciosEnter enter, UUID id_usuario) {
        ExerciciosGrupo exerciciosGrupo = exercicioGrupoRepository.findById(enter.id_exericicio_grupo()).orElseThrow(() -> new RuntimeException("exercicio não cadastrado"));
        GrupoMembros grupoMembros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(id_usuario, enter.id_grupo()).orElseThrow(() -> new RuntimeException("usuario não cadastrado no grupo"));
        ParticipantesExercicios participante = ParticipantesExercicios.builder()
                .exercicio_grupo(exerciciosGrupo)
                .grupo_membros(grupoMembros)
                .series(enter.serie())
                .carga(enter.carga())
                .repeticoes(enter.repeticoes())
                .build();
        ParticipantesExercicios participantesExerciciosSave = participantesExerciciosRepository.save(participante);
        exerciciosGrupo.getParticipantes().add(participantesExerciciosSave);
        List<ParticipantesExercicios> list = participantesExerciciosRepository.findParticipantesByExericicioOrderCarga(exerciciosGrupo.getId());
        List<ExerciciosGrupoUsuariosResponse> listUsuario = new ArrayList<>();
        for (ParticipantesExercicios participantes : list) {
            ExerciciosGrupoUsuariosResponse usuariosResponse = new ExerciciosGrupoUsuariosResponse(
                    participantes.getGrupo_membros().getUsuario().getId(),
                    participantes.getGrupo_membros().getUsuario().getNome(),
                    participantes.getSeries(),
                    participantes.getCarga(),
                    participantes.getRepeticoes()

            );
            listUsuario.add(usuariosResponse);
        }
        ExerciciosGrupoResponse response = new ExerciciosGrupoResponse(
                exerciciosGrupo.getId(),
                exerciciosGrupo.getNome(),
                exerciciosGrupo.getGrupo().getId(),
                listUsuario
        );
        return response;
    }

    public ExerciciosGrupoResponse atualizar(ParticipanteExerciciosUpdate update) {
        ExerciciosGrupo exerciciosGrupo = exercicioGrupoRepository.findById(update.id_exericicio_grupo()).orElseThrow(() -> new RuntimeException("exercicio não cadastrado"));
        GrupoMembros grupoMembros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(update.id_usuario(), update.id_grupo()).orElseThrow(() -> new RuntimeException("usuario não cadastrado no grupo"));
        ParticipantesExercicios participantesExercicios = participantesExerciciosRepository.findParticipantesByExericicioAndMembro(exerciciosGrupo.getId(), grupoMembros.getId()).orElseThrow(()-> new RuntimeException("não existe esse participante nesse exercicio"));
        ParticipantesExercicios participante = ParticipantesExercicios.builder()
                .id(participantesExercicios.getId())
                .exercicio_grupo(exerciciosGrupo)
                .grupo_membros(grupoMembros)
                .series(update.serie())
                .carga(update.carga())
                .repeticoes(update.repeticoes())
                .build();
        ParticipantesExercicios participantesExerciciosUpdate = participantesExerciciosRepository.save(participante);
        exerciciosGrupo.getParticipantes().add(participantesExerciciosUpdate);
        List<ParticipantesExercicios> list = participantesExerciciosRepository.findParticipantesByExericicioOrderCarga(exerciciosGrupo.getId());
        List<ExerciciosGrupoUsuariosResponse> listUsuario = new ArrayList<>();
        for (ParticipantesExercicios participantes : list) {
            ExerciciosGrupoUsuariosResponse usuariosResponse = new ExerciciosGrupoUsuariosResponse(
                    participantes.getGrupo_membros().getUsuario().getId(),
                    participantes.getGrupo_membros().getUsuario().getNome(),
                    participantes.getSeries(),
                    participantes.getCarga(),
                    participantes.getRepeticoes()

            );
            listUsuario.add(usuariosResponse);
        }
        ExerciciosGrupoResponse response = new ExerciciosGrupoResponse(
                exerciciosGrupo.getId(),
                exerciciosGrupo.getNome(),
                exerciciosGrupo.getGrupo().getId(),
                listUsuario
        );
        return response;
    }

    public void sair(ParticipanteExerciciosExit exit) {
        ExerciciosGrupo exerciciosGrupo = exercicioGrupoRepository.findById(exit.id_exericicio_grupo()).orElseThrow(() -> new RuntimeException("exercicio não cadastrado"));
        GrupoMembros grupoMembros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(exit.id_usuario(), exit.id_grupo()).orElseThrow(() -> new RuntimeException("usuario não cadastrado no grupo"));
        ParticipantesExercicios participante = participantesExerciciosRepository.findParticipantesByExericicioAndMembro(exerciciosGrupo.getId(), grupoMembros.getId()).orElseThrow(()-> new RuntimeException("não existe esse participante nesse exercicio"));
        participantesExerciciosRepository.delete(participante);
    }


    public ExerciciosGrupoResponse buscarPeloExercicio(UUID id){
        ExerciciosGrupo exerciciosGrupo = exercicioGrupoRepository.findById(id).orElseThrow(()-> new RuntimeException("exercicio não existe"));
        List<ParticipantesExercicios> list = participantesExerciciosRepository.findParticipantesByExericicio(exerciciosGrupo.getId());

        List<ExerciciosGrupoUsuariosResponse> listParticipantes = new ArrayList<>();
        for (ParticipantesExercicios participantes : list) {

                ExerciciosGrupoUsuariosResponse usuariosResponse = new ExerciciosGrupoUsuariosResponse(
                        participantes.getGrupo_membros().getUsuario().getId(),
                        participantes.getGrupo_membros().getUsuario().getNome(),
                        participantes.getSeries(),
                        participantes.getCarga(),
                        participantes.getRepeticoes()

                );
            listParticipantes.add(usuariosResponse);



        }
            ExerciciosGrupoResponse response = new ExerciciosGrupoResponse(
                    exerciciosGrupo.getId(),
                    exerciciosGrupo.getNome(),
                    exerciciosGrupo.getGrupo().getId(),
                    listParticipantes
            );

        return response;
    }


}
