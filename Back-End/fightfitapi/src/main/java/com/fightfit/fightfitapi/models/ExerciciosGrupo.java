package com.fightfit.fightfitapi.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "exercicio_grupo")
public class ExerciciosGrupo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_grupo")
    private Grupo grupo;

    @OneToMany(mappedBy = "exercicio_grupo")
    private List<ParticipantesExercicios> participantes;
}
