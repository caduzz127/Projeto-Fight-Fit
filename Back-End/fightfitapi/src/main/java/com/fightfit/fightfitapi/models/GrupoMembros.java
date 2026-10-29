package com.fightfit.fightfitapi.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "grupo_membros")
public class GrupoMembros {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne()
    @JoinColumn(name = "id_usuario")
    private Usuarios usuario;

    @ManyToOne()
    @JoinColumn(name = "id_grupo")
    private Grupo grupo;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo")
    private Roles cargos;

    @OneToMany(mappedBy = "grupo_membros")
    private List<ParticipantesExercicios> exercicios;

}
