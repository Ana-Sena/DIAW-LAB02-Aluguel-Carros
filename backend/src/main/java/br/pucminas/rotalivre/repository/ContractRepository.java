package br.pucminas.rotalivre.repository;

import br.pucminas.rotalivre.model.Contrato;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contrato, UUID> {
    Optional<Contrato> findByRentalId(UUID rentalId);
}
