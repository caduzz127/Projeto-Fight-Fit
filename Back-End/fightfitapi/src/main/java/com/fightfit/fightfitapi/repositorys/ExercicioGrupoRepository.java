package com.fightfit.fightfitapi.repositorys;

import com.fightfit.fightfitapi.models.ExerciciosGrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ExercicioGrupoRepository extends JpaRepository<ExerciciosGrupo, UUID> {

    @Query(value = "SELECT * FROM exercicio_grupo WHERE nome ILIKE :nome AND id_grupo = :id", nativeQuery = true)
    public List<ExerciciosGrupo> findByNameAndGroup(@Param("nome") String nome, @Param("id") UUID id);
}
