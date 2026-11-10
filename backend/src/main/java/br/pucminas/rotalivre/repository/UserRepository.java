package br.pucminas.rotalivre.repository;

import br.pucminas.rotalivre.model.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    @org.springframework.data.jpa.repository.Query(
        "select count(c) > 0 from Cliente c where c.cpf = :cpf and c.id <> :id"
    )
    boolean existsByCpfAndIdNot(String cpf, UUID id);

    List<User> findByRole(Role role);
}
