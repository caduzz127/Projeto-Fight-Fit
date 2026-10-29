package com.fightfit.fightfitapi.repositorys;

import com.fightfit.fightfitapi.models.ExerciciosIndividuais;
import com.fightfit.fightfitapi.models.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ExerciciosIndividuaisRespository extends JpaRepository<ExerciciosIndividuais, UUID> {

    @Query(value = "SELECT * FROM exercicios_individuais where nome_exercicios_individuais ILIKE :name AND id_treinos = :id_treino", nativeQuery = true)
    public List<ExerciciosIndividuais> findByNameIlikeAndIdTreino(@Param("name") String name, @Param("id_treino") UUID idTreino);

    @Query(value = "SELECT * FROM exercicios_individuais where id_treinos = :id_treino", nativeQuery = true)
    public List<ExerciciosIndividuais> findByTreino(@Param("id_treino") UUID idTreino);
}
