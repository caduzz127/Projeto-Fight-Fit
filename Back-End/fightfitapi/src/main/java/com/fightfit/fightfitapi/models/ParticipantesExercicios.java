package com.fightfit.fightfitapi.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "participantes_exercicios")
public class ParticipantesExercicios {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "carga")
    private double carga;

    @Column(name = "repeticoes")
    private Integer repeticoes;

    @Column(name = "serie")
    private Integer series;

    @ManyToOne
    @JoinColumn(name = "id_exercicio_grupo")
    private ExerciciosGrupo exercicio_grupo;

    @ManyToOne
    @JoinColumn(name = "id_grupo_membros")
    private GrupoMembros grupo_membros;
}
