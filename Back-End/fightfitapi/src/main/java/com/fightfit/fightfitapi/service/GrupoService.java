package com.fightfit.fightfitapi.service;


import com.fightfit.fightfitapi.dtos.grupos.*;
import com.fightfit.fightfitapi.exceptions.grupos.GrupoAlreadyExists;
import com.fightfit.fightfitapi.exceptions.grupos.GrupoNotExists;
import com.fightfit.fightfitapi.exceptions.grupos.NotPermission;
import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioNotExists;
import com.fightfit.fightfitapi.models.*;
import com.fightfit.fightfitapi.repositorys.GrupoMembrosRepository;
import com.fightfit.fightfitapi.repositorys.GrupoRepository;
import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GrupoService {

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private GrupoMembrosRepository grupoMembrosRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private PasswordEncoder enconder;

    private final Roles ADMIN_ROOT = Roles.SYSTEM_ROOT_GROUP_ADMIN;

    private final Roles ADMIN = Roles.SYSTEM_GROUP_ADMIN;

    private final Roles USER = Roles.SYSTEM_GROUP_USER;

    public GrupoResponse criarGrupo(GrupoCreate create, UUID id_usuario) {
        if (grupoRepository.findByName(create.nome()).isPresent()) {
            throw new GrupoAlreadyExists("Grupo já existe");
        }
        if (create.senha().isEmpty() || create.senha().isBlank()) {
            throw new RuntimeException("digite uma senha para criar o grupo");
        }
        Usuarios usuario = usuariosRepository.findById(id_usuario).orElseThrow(() -> new UsuarioNotExists(""));
        Grupo grupo = Grupo.builder()
                .nome(create.nome())
                .senha(enconder.encode(create.senha().trim()))
                .build();
        Grupo grupoSave = grupoRepository.save(grupo);

        GrupoMembros administrador = GrupoMembros.builder()
                .usuario(usuario)
                .grupo(grupoSave)
                .cargos(ADMIN_ROOT)
                .build();
        GrupoMembros grupoMembrosSave = grupoMembrosRepository.save(administrador);
        GrupoUsuarioResponse responseUsuario = new GrupoUsuarioResponse(
                grupoMembrosSave.getUsuario().getNome(),
                grupoMembrosSave.getCargos().name()
        );
        GrupoResponse response = new GrupoResponse(
                grupoSave.getId(),
                grupoSave.getNome(),
                responseUsuario
        );

        return response;
    }

    public GrupoAllResponse entrarGrupo(GrupoEnter enter, UUID id_usuario) {
        Usuarios usuario = usuariosRepository.findById(id_usuario).orElseThrow(() -> new UsuarioNotExists("Usuario não existe"));
        Grupo grupo = grupoRepository.findById(enter.id_grupo()).orElseThrow(() -> new GrupoNotExists("Grupos não existe"));
        if (enter.senha().isEmpty() || enter.senha().isBlank()) {
            throw new RuntimeException("digite uma senha para entrar no grupo");
        }
        if (!enconder.matches(enter.senha().trim(), grupo.getSenha())) {
            throw new RuntimeException("senha incorreta!");
        }
        if (grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(usuario.getId(), grupo.getId()).isPresent()) {
            throw new RuntimeException("usuario já pertence a esse grupo");
        }

        GrupoMembros grupoMembros = GrupoMembros.builder()
                .grupo(grupo)
                .usuario(usuario)
                .cargos(USER)
                .build();
        GrupoMembros membros = grupoMembrosRepository.save(grupoMembros);
        membros.getGrupo().getGrupoMembros().add(grupoMembros);
        List<GrupoUsuarioResponse> usuarioResponseList = new ArrayList<>();
        for (GrupoMembros m : membros.getGrupo().getGrupoMembros()) {
            GrupoUsuarioResponse usuResponse = new GrupoUsuarioResponse(
                    m.getUsuario().getNome(),
                    m.getCargos().name()
            );
            usuarioResponseList.add(usuResponse);
        }

        GrupoAllResponse response = new GrupoAllResponse(
                grupo.getId(),
                grupo.getNome(),
                usuarioResponseList
        );
        return response;
    }

    public GrupoAllResponse atualizarGrupo(GrupoUpdate update, UUID id_usuario) {
        Usuarios usuario = usuariosRepository.findById(id_usuario).orElseThrow(() -> new UsuarioNotExists("usuario não existe"));
        Grupo grupo = grupoRepository.findById(update.id_grupo()).orElseThrow(() -> new GrupoNotExists("grupo não existe"));
        GrupoMembros grupoMembros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(usuario.getId(), grupo.getId()).orElseThrow(() -> new RuntimeException("usuario não cadastrado no grupo"));
        if (!grupoMembros.getCargos().equals(ADMIN) || !grupoMembros.getCargos().equals(ADMIN_ROOT)) {
            throw new NotPermission("Usuario não tem permissão para alterar nada do Grupo");
        }
        if (grupoRepository.findByName(update.nomeNovo()).isPresent()) {
            throw new GrupoAlreadyExists("já existe um grupo com esse nome");
        }
        if (!enconder.matches(update.senhaAntiga(), grupo.getSenha())) {
            throw new RuntimeException("senha antiga incorreta");
        }

        Grupo grupoParaAtualizar = Grupo.builder()
                .id(grupo.getId())
                .nome(update.nomeNovo())
                .senha(enconder.encode(update.senhaNova().trim()))
                .build();
        Grupo grupoAtualizado = grupoRepository.save(grupoParaAtualizar);

        List<GrupoUsuarioResponse> usuariosResponse = new ArrayList<>();
        for (GrupoMembros gr : grupoAtualizado.getGrupoMembros()) {
            GrupoUsuarioResponse usu = new GrupoUsuarioResponse(
                    gr.getUsuario().getNome(),
                    gr.getCargos().name()
            );
            usuariosResponse.add(usu);
        }

        GrupoAllResponse response = new GrupoAllResponse(
                grupoAtualizado.getId(),
                grupoAtualizado.getNome(),
                usuariosResponse
        );

        return response;
    }

    public void deleteGrupo(GrupoDelete delete, UUID id_usuario) {
        Usuarios usuario = usuariosRepository.findById(id_usuario).orElseThrow(() -> new UsuarioNotExists("usuario não existe"));
        Grupo grupo = grupoRepository.findById(delete.id_grupo()).orElseThrow(() -> new GrupoNotExists("grupo não existe"));
        GrupoMembros grupoMembros = grupoMembrosRepository.findGrupoMembrosByUsuarioAndGrupo(usuario.getId(), grupo.getId()).orElseThrow(() -> new RuntimeException("Usuário não está no grupo"));
        if (!grupoMembros.getCargos().equals(ADMIN_ROOT)) {
            throw new NotPermission("Usuario não tem permissão para deletar o Grupo");
        }
        if (!enconder.matches(delete.senha(), grupo.getSenha())) {
            throw new RuntimeException("senha incorreta!");
        }

        grupoRepository.deleteById(delete.id_grupo());
    }

    public void sairGrupo(UUID id_grupo, UUID id_usuario){
        Grupo grupo = grupoRepository.findById(id_grupo).orElseThrow(()-> new GrupoNotExists("Grupo não existe!"));
        Usuarios usuario = usuariosRepository.findById(id_usuario).orElseThrow(() -> new UsuarioNotExists("usuario não existe"));
        grupoMembrosRepository.deleteGrupoMembrosByUsuarioAndGrupo(usuario.getId(), grupo.getId());
    }

    public List<GrupoResponse> buscarPeloNome(String nome) {
        List<Grupo> grupos = grupoRepository.findByNameLike("%" + nome + "%");
        List<GrupoResponse> response = new ArrayList<>();
        GrupoUsuarioResponse usuarioResponse  = new GrupoUsuarioResponse(
                null,null
        );;
        for (Grupo grupo : grupos) {

            for (GrupoMembros membros : grupo.getGrupoMembros()) {
                if (membros.getCargos().equals(ADMIN_ROOT)) {
                    usuarioResponse = new GrupoUsuarioResponse(
                            membros.getUsuario().getNome(),
                            membros.getCargos().name()
                    );
                }

            }
            GrupoResponse grupoResponse = new GrupoResponse(
                    grupo.getId(),
                    grupo.getNome(),
                    usuarioResponse
            );
            response.add(grupoResponse);
        }
        return response;
    }

    public List<GrupoResponse> buscarPeloUsuario(UUID id) {
        Usuarios usuario = usuariosRepository.findById(id).orElseThrow(() -> new UsuarioNotExists("usuario não existe"));

        List<GrupoResponse> response = new ArrayList<>();
        for (GrupoMembros gruposMembros : usuario.getGrupoMembros()) {
            List<GrupoUsuarioResponse> usuariosGrupo = new ArrayList<>();

            GrupoUsuarioResponse usuarioResponse = new GrupoUsuarioResponse(
                gruposMembros.getUsuario().getNome(),
                gruposMembros.getCargos().name()
            );

            GrupoResponse grupoesponse = new GrupoResponse(
                    gruposMembros.getGrupo().getId(),
                    gruposMembros.getGrupo().getNome(),
                    usuarioResponse
            );
            response.add(grupoesponse);

        }
        return response;
    }


    public GrupoAllResponse buscarPeloId(UUID id){
        Grupo grupo = grupoRepository.findById(id).orElseThrow(()-> new GrupoNotExists("Grupo não existe"));

        List<GrupoUsuarioResponse> usuariosResponse = new ArrayList<>();
        for(GrupoMembros membros : grupo.getGrupoMembros()){
            GrupoUsuarioResponse usuario = new GrupoUsuarioResponse(
                membros.getUsuario().getNome(),
                membros.getCargos().name()
            );
            usuariosResponse.add(usuario);
        }
        GrupoAllResponse response = new GrupoAllResponse(
                grupo.getId(),
                grupo.getNome(),
                usuariosResponse
        );

        return response;
    }


}
