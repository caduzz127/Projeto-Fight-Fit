package com.fightfit.fightfitapi.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Table(name = "exercicios_individuais")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExerciciosIndividuais {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "nome_exercicios_individuais", nullable = false)
    private String nome;

    @Column(name = "carga_exercicios_individuais", nullable = false)
    private Double carga;

    @Column(name = "repeticoes_exercicios_individuais", nullable = false)
    private Integer repeticoes;

    @Column(name = "serie_exercicios_individuais", nullable = false)
    private Integer series;

    @ManyToOne()
    @JoinColumn(name = "id_treinos")
    private Treino treinos;

}
