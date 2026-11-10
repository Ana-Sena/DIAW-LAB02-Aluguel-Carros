package br.pucminas.rotalivre.repository;

import br.pucminas.rotalivre.model.ContratoCredito;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditContractRepository extends JpaRepository<ContratoCredito, UUID> {}
