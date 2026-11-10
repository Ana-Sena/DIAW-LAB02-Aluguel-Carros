package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Contrato;
import br.pucminas.rotalivre.model.ContratoCredito;
import br.pucminas.rotalivre.model.Rental;
import br.pucminas.rotalivre.model.Role;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record RentalResponse(
    UUID id,
    OwnerResponse customer,
    VehicleResponse vehicle,
    LocalDate startDate,
    LocalDate endDate,
    Rental.Status status,
    Role ownershipType,
    BigDecimal total,
    String notes,
    String opinion,
    OwnerResponse evaluator,
    OwnerResponse bank,
    BigDecimal creditAmount,
    Integer installments,
    UUID contractNumber,
    Instant contractedAt,
    Instant createdAt
) {
    public static RentalResponse of(Rental rental) {
        Contrato contract = rental.contract;
        ContratoCredito credit = contract == null ? null : contract.credit;
        return new RentalResponse(
            rental.id,
            OwnerResponse.of(rental.customer),
            VehicleResponse.of(rental.vehicle),
            rental.startDate,
            rental.endDate,
            rental.status,
            rental.ownershipType,
            rental.total,
            rental.notes,
            rental.opinion,
            rental.evaluator == null ? null : OwnerResponse.of(rental.evaluator),
            credit == null ? null : OwnerResponse.of(credit.bank),
            credit == null ? null : credit.amount,
            credit == null ? null : credit.installments,
            contract == null || contract.executedAt == null ? null : contract.id,
            contract == null ? null : contract.executedAt,
            rental.createdAt
        );
    }
}
