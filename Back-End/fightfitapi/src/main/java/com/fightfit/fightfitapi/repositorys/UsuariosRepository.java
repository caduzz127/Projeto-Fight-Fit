package com.fightfit.fightfitapi.repositorys;

import com.fightfit.fightfitapi.models.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuariosRepository extends JpaRepository<Usuarios, UUID> {

    @Query(value = "SELECT * FROM usuarios where nome_usuario = :name", nativeQuery = true)
    public Optional<Usuarios> findByUserName(@Param("name") String username);



    @Query(value = "SELECT * FROM usuarios where nome_usuario ILIKE  :name", nativeQuery = true)
    public List<Usuarios> findByUserNameLike(@Param("name") String username);


}
