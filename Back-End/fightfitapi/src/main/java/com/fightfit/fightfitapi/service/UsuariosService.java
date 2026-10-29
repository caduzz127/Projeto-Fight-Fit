package com.fightfit.fightfitapi.service;

import com.fightfit.fightfitapi.dtos.usuarios.*;
import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioInfoResponse;
import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioTreinoExerciciosIndividuaisInfoResponse;
import com.fightfit.fightfitapi.dtos.usuarios.info.UsuarioTreinoInfoResponse;
import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioAlreadyExists;
import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioNotExists;
import com.fightfit.fightfitapi.models.ExerciciosIndividuais;
import com.fightfit.fightfitapi.models.Roles;
import com.fightfit.fightfitapi.models.Treino;
import com.fightfit.fightfitapi.models.Usuarios;
import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import com.fightfit.fightfitapi.security.model.CustomUserDetails;
import com.fightfit.fightfitapi.security.service.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtService jwtService;

    Roles user = Roles.SYSTEM_USER;

    public void salvarUsuario(UsuarioCreate create){
        if(usuariosRepository.findByUserName(create.nome()).isPresent()){
            throw new UsuarioAlreadyExists("já existe um usuário com esse username");
        }
        System.out.println("nome: "+ create.nome());
        System.out.println("nome: "+ create.senha());

        Usuarios usuario = Usuarios.builder()
                .nome(create.nome())
                .roles(user)
                .senha(encoder.encode(create.senha()))
                .build();

        usuariosRepository.save(usuario);
    }

      //AGORA O LOGIN É FEITO PELO SPRING SECURITY
//    public UsuarioLoginResponse loginUsuario(UsuarioLogin login){
//        Usuarios usuario = usuariosRepository.findByUserName(login.username()).orElseThrow(()-> new UsuarioNotExists("Não existe um usuário com esse username!"));
//        if(!encoder.matches(login.senha().trim(),usuario.getSenha())){
//            throw new UsuarioNotExists("Senha Incorreta, Verifique a senha!!");
//        }
//
//        UsuarioLoginResponse response = new UsuarioLoginResponse(
//                usuario.getId(),
//                "TOKEN",
//                usuario.getNome()
//        );
//        return response;
//    }

    public void deleteUsuario(UUID id, String senha){
        Usuarios usuario = usuariosRepository.findById(id).orElseThrow(()-> new UsuarioNotExists("Não existe esse usuário!"));
        if(!encoder.matches(senha,usuario.getSenha())){
            throw new UsuarioNotExists("Senha Incorreta, Verifique a senha!!");
        }
        usuariosRepository.deleteById(id);
    }


    public UsuarioResponse atualizarUsuario(UsuarioUpdate update){
        if(usuariosRepository.findByUserName(update.usernameNovo()).isPresent()){
            throw new UsuarioAlreadyExists("já existe um usuário com esse username!");
        }

        Usuarios usuario = usuariosRepository.findByUserName(update.username()).orElseThrow(()-> new UsuarioNotExists("username original está errado!"));

        if(!encoder.matches(update.senhaAntiga().trim(),usuario.getSenha().trim())){
            throw new UsuarioNotExists("Senha Incorreta, Verifique a senha!!");
        }

        usuario = Usuarios.builder()
                .id(usuario.getId())
                .nome(update.usernameNovo())
                .senha(encoder.encode(update.senhaNova()))
                .roles(user)
                .build();
        Usuarios up = usuariosRepository.save(usuario);

        UsuarioResponse response = new UsuarioResponse(
                up.getRoles().name(),
                jwtService.gerarToken(up)
        );
        return response;
    }



    public List<UsuariosListResponse> buscarUsuarios(String username){
        List<Usuarios> usuarios = usuariosRepository.findByUserNameLike("%"+username+"%");
        List<UsuariosListResponse> usuariosListResponse = new ArrayList<>();

        for(Usuarios usu : usuarios){
            UsuariosListResponse usuariosResponse = new UsuariosListResponse(
                    usu.getNome()
            );
            usuariosListResponse.add(usuariosResponse);
        }

        return usuariosListResponse;
    }





}

