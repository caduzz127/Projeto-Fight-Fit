package com.fightfit.fightfitapi.service;

import com.fightfit.fightfitapi.dtos.exercicios_grupo.*;
import com.fightfit.fightfitapi.exceptions.grupos.GrupoNotExists;
import com.fightfit.fightfitapi.models.*;
import com.fightfit.fightfitapi.repositorys.ExercicioGrupoRepository;
import com.fightfit.fightfitapi.repositorys.GrupoMembrosRepository;
import com.fightfit.fightfitapi.repositorys.GrupoRepository;
import com.fightfit.fightfitapi.repositorys.ParticipantesExerciciosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ExerciciosGrupoService {

    @Autowired
    private ExercicioGrupoRepository exercicioGrupoRepository;

    @Autowired
    private ParticipantesExerciciosRepository participantesExerciciosRepository;

    @Autowired
    private GrupoMembrosRepository grupoMembrosRepository;

    @Autowired
    private GrupoRepository grupoRepository;

    private final Roles ADMIN = Roles.SYSTEM_GROUP_ADMIN;

    private final Roles ADMIN_ROOT = Roles.SYSTEM_ROOT_GROUP_ADMIN;

    public ExerciciosGrupoResponse cadastrar(ExerciciosGrupoCreate create, UUID id_usuario) {
        GrupoMembros grupoMembros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(id_usuario, create.id_grupo()).orElseThrow(() -> new RuntimeException("usuario não registrado no grupo"));
        if (!grupoMembros.getCargos().equals(ADMIN) || !grupoMembros.getCargos().equals(ADMIN_ROOT)) {
            throw new RuntimeException("usuario não tem permisão para criar exericicio do grupo");
        }
        ExerciciosGrupo exerciciosGrupo = ExerciciosGrupo.builder()
                .nome(create.nome_exercicio())
                .grupo(grupoMembros.getGrupo())
                .build();
        ExerciciosGrupo exerciciosGrupoSave = exercicioGrupoRepository.save(exerciciosGrupo);
        List<ParticipantesExercicios> list = participantesExerciciosRepository.findParticipantesByExericicioOrderCarga(exerciciosGrupoSave.getId());
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
                exerciciosGrupoSave.getId(),
                exerciciosGrupoSave.getNome(),
                exerciciosGrupoSave.getGrupo().getId(),
                listUsuario
        );
        return response;
    }

    public ExerciciosGrupoResponse atualizar(ExerciciosGrupoUpdate update, UUID id_usuario) {
        GrupoMembros membros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(id_usuario, update.id_grupo()).orElseThrow(() -> new RuntimeException("usuario não pertence ao grupo"));
        ExerciciosGrupo exercicio = exercicioGrupoRepository.findById(update.id_exercicio_grupo()).orElseThrow(() -> new RuntimeException("exercicio não existe"));
        if (!membros.getCargos().equals(ADMIN) || !membros.getCargos().equals(ADMIN_ROOT)) {
            throw new RuntimeException("usuario não possui cargo para editar");
        }
        ExerciciosGrupo exerciciosUpdate = ExerciciosGrupo.builder()
                .id(exercicio.getId())
                .nome(update.nome())
                .grupo(membros.getGrupo())
                .build();
        ExerciciosGrupo exerciciosGrupoUpdate = exercicioGrupoRepository.save(exerciciosUpdate);
        List<ParticipantesExercicios> list = participantesExerciciosRepository.findParticipantesByExericicioOrderCarga(exerciciosGrupoUpdate.getId());
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
                exerciciosGrupoUpdate.getId(),
                exerciciosGrupoUpdate.getNome(),
                exerciciosGrupoUpdate.getGrupo().getId(),
                listUsuario
        );
        return response;
    }

    public List<ExerciciosGrupoResponse> buscarPorNome(UUID id_grupo, String nome) {
        Grupo grupo = grupoRepository.findById(id_grupo).orElseThrow(() -> new GrupoNotExists("grupo não existe"));
        List<ExerciciosGrupo> exerciciosGrupos = exercicioGrupoRepository.findByNameAndGroup("%" + nome + "%", grupo.getId());
        List<ExerciciosGrupoResponse> listExercicioGrupo = new ArrayList<>();
        for (ExerciciosGrupo exercicios : exerciciosGrupos) {
            List<ExerciciosGrupoUsuariosResponse> listUsuario = new ArrayList<>();
            for (ParticipantesExercicios participantes : exercicios.getParticipantes()) {
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
                    exercicios.getId(),
                    exercicios.getNome(),
                    exercicios.getGrupo().getId(),
                    listUsuario
            );
            listExercicioGrupo.add(response);

        }

        return listExercicioGrupo;
    }

    public void deletar(ExerciciosGrupoDelete delete) {
        GrupoMembros grupoMembros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(delete.id_usuario(), delete.id_grupo()).orElseThrow(() -> new RuntimeException("usuario não registrado no grupo"));
        if (!grupoMembros.getCargos().equals(ADMIN_ROOT)) {
            throw new RuntimeException("usuario não tem permisão para criar exericicio do grupo");
        }
        ExerciciosGrupo exerciciosGrupo = exercicioGrupoRepository.findById(delete.id_exercicio_grupo()).orElseThrow(()->new RuntimeException("não existe esse "));
        exercicioGrupoRepository.delete(exerciciosGrupo);
    }

}
