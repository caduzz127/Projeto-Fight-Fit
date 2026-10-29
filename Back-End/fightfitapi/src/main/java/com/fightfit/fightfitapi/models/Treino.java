package com.fightfit.fightfitapi.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "treinos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Treino {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "nome_treinos", nullable = false)
    private String nome;

    @ManyToOne()
    @JoinColumn(name = "id_usuarios")
    private Usuarios usuario;

    @OneToMany(mappedBy = "treinos")
    private List<ExerciciosIndividuais> exerciciosIndividuais;

}
