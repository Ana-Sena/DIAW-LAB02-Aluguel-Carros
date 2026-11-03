package br.pucminas.rotalivre.repository;
import br.pucminas.rotalivre.model.Rental;
import org.springframework.data.jpa.repository.*;
import java.time.LocalDate;
import java.util.*;
public interface RentalRepository extends JpaRepository<Rental, UUID> {
    List<Rental> findByCustomerIdOrderByCreatedAtDesc(UUID id);
    List<Rental> findAllByOrderByCreatedAtDesc();
    boolean existsByCustomerId(UUID id);
    @Query("select count(r) > 0 from Rental r where r.vehicle.id = :vehicle and r.status = br.pucminas.rotalivre.model.Rental.Status.CONTRATADO and r.id <> :excluded and r.startDate <= :end and r.endDate >= :start")
    boolean overlaps(UUID vehicle, UUID excluded, LocalDate start, LocalDate end);
}
