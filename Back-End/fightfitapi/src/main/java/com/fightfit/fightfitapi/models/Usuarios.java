package com.fightfit.fightfitapi.models;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuarios {


    @Id()
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "nome_usuario", unique = true, nullable = false)
    private String nome;

    @Column(name = "senha_usuario", nullable = false)
    private String senha;

    @Column(name = "cargo_usuario", nullable = false)
    @Enumerated(EnumType.STRING)
    private Roles roles;

    @Column(name = "token_version", nullable = false)
    private Integer token_version;

    @OneToMany(mappedBy = "usuario")
    private List<Treino> treinos;

    @OneToMany(mappedBy = "usuario")
    private List<GrupoMembros> grupoMembros;
}
