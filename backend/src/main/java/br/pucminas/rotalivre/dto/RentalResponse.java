package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

public record RentalResponse(UUID id, OwnerResponse customer, VehicleResponse vehicle, LocalDate startDate, LocalDate endDate,
        Rental.Status status, Role ownershipType, BigDecimal total, String notes, String opinion, OwnerResponse evaluator,
        OwnerResponse bank, BigDecimal creditAmount, Integer installments, UUID contractNumber, Instant contractedAt, Instant createdAt) {
        public static RentalResponse of(Rental r) { return new RentalResponse(r.id,OwnerResponse.of(r.customer),VehicleResponse.of(r.vehicle),r.startDate,r.endDate,
            r.status,r.ownershipType,r.total,r.notes,r.opinion,r.evaluator==null?null:OwnerResponse.of(r.evaluator),r.bank==null?null:OwnerResponse.of(r.bank),
            r.creditAmount,r.installments,r.contractNumber,r.contractedAt,r.createdAt); }
    }
