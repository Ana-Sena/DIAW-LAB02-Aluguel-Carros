package br.pucminas.rotalivre.repository;
import br.pucminas.rotalivre.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByCpfAndIdNot(String cpf, UUID id);
    List<User> findByRole(Role role);
}
