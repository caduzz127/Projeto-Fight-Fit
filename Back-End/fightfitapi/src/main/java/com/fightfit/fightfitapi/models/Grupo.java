package com.fightfit.fightfitapi.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "grupos")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public UUID id;

    @Column(name = "nome_grupo")
    public String nome;

    @Column(name = "senha_grupo")
    public String senha;

    @OneToMany(mappedBy = "grupo")
    private List<GrupoMembros> grupoMembros;

    @OneToMany(mappedBy = "grupo")
    private List<ExerciciosGrupo> exerciciosGrupos;
}
