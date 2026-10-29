package com.fightfit.fightfitapi.repositorys;

import com.fightfit.fightfitapi.models.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GrupoRepository  extends JpaRepository<Grupo, UUID> {

    @Query(value = "SELECT * FROM grupos WHERE nome_grupo = :nome", nativeQuery = true)
    public Optional<Grupo> findByName(@Param("nome") String nome);


    @Query(value = "SELECT * FROM grupos WHERE nome_grupo ILIKE :nome", nativeQuery = true)
    public List<Grupo> findByNameLike(@Param("nome") String nome);

}
