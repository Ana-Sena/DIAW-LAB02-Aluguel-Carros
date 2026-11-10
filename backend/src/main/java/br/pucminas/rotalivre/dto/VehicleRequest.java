package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public record VehicleRequest(@NotBlank @Size(max=80) String registration,
        @NotBlank @Pattern(regexp="[A-Z]{3}[0-9][A-Z0-9][0-9]{2}") String plate,
        @Min(1900) @Max(2100) int year, @NotBlank @Size(max=80) String brand,
        @NotBlank @Size(max=100) String model, @NotNull @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal dailyRate,
        @NotNull UUID ownerId) {}
