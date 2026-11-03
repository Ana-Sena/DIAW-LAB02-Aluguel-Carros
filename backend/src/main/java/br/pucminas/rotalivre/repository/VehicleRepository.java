package br.pucminas.rotalivre.repository;
import br.pucminas.rotalivre.model.Vehicle;
import org.springframework.data.jpa.repository.*;
import jakarta.persistence.LockModeType;
import java.util.*;
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    boolean existsByOwnerId(UUID id);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select v from Vehicle v where v.id = :id")
    Optional<Vehicle> lockById(UUID id);
}
