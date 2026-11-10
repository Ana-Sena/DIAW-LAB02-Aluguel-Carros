package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public record RentalRequest(@NotNull UUID vehicleId, @NotNull @FutureOrPresent LocalDate startDate,
        @NotNull @FutureOrPresent LocalDate endDate, @NotNull Role ownershipType, @Size(max=1000) String notes) {}
