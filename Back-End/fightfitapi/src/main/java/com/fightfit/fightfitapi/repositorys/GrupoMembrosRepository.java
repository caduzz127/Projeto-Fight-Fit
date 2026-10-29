package com.fightfit.fightfitapi.repositorys;

import com.fightfit.fightfitapi.models.GrupoMembros;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface GrupoMembrosRepository extends JpaRepository<GrupoMembros, UUID> {

    @Query(value = "select * from grupo_membros where id_usuario = :id_usuario and id_grupo = :id_grupo", nativeQuery = true)
    public Optional<GrupoMembros> findGrupoMembrosByUsuarioAndGrupo(@Param("id_usuario") UUID id_usuario, @Param("id_grupo") UUID id_grupo);

    @Modifying
    @Transactional
    @Query(value = "delete from grupo_membros where id_usuario = :id_usuario and id_grupo = :id_grupo", nativeQuery = true)
    public void deleteGrupoMembrosByUsuarioAndGrupo(@Param("id_usuario") UUID id_usuario, @Param("id_grupo") UUID id_grupo);
}
