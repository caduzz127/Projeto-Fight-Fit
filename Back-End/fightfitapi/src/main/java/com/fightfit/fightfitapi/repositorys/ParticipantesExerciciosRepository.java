package com.fightfit.fightfitapi.repositorys;

import com.fightfit.fightfitapi.models.ParticipantesExercicios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipantesExerciciosRepository extends JpaRepository<ParticipantesExercicios, UUID> {

    @Query(value = "SELECT * FROM participantes_exercicios WHERE id_exercicio_grupo = :id ORDER BY carga DESC", nativeQuery = true)
    public List<ParticipantesExercicios> findParticipantesByExericicioOrderCarga(@Param("id") UUID id);

    @Query(value = "SELECT * FROM participantes_exercicios  WHERE id_exercicio_grupo = :id_exercicio AND id_grupo_membros = :id_grupo", nativeQuery = true)
    public Optional<ParticipantesExercicios> findParticipantesByExericicioAndMembro(@Param("id_exercicio") UUID id_exercicio, @Param("id_grupo") UUID id_grupo);

    @Query(value = "SELECT * FROM participantes_exercicios  WHERE id_exercicio_grupo = :id_exercicio ORDER BY carga DESC", nativeQuery = true)
    public List<ParticipantesExercicios> findParticipantesByExericicio(@Param("id_exercicio") UUID id_exercicio);
}
