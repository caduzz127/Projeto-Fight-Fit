package com.fightfit.fightfitapi.security.service;

import com.fightfit.fightfitapi.exceptions.usuarios.UsuarioNotExists;
import com.fightfit.fightfitapi.models.Usuarios;
import com.fightfit.fightfitapi.repositorys.UsuariosRepository;
import com.fightfit.fightfitapi.security.model.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuariosRepository repository;



    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuarios usuario = repository.findByUserName(username).orElseThrow(()-> new UsuarioNotExists("usuario não foi encontrado"));
        CustomUserDetails user = CustomUserDetails.builder()
                .id(usuario.getId())
                .username(usuario.getNome())
                .password(usuario.getSenha())
                .role(usuario.getRoles().name())
                .build();

        return user;
    }

}