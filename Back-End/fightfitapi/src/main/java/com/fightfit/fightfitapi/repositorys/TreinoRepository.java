package com.fightfit.fightfitapi.repositorys;

import com.fightfit.fightfitapi.models.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TreinoRepository extends JpaRepository<Treino, UUID> {

    @Query(value = "SELECT * FROM treinos where nome_treinos ILIKE :name AND id_usuarios = :id", nativeQuery = true)
    public List<Treino> findByNameIlike(@Param("name") String name, @Param("id") UUID id);


    @Query(value = "SELECT * FROM treinos where id_usuarios = :id", nativeQuery = true)
    public List<Treino> findByUsuario(@Param("id") UUID id);
}
