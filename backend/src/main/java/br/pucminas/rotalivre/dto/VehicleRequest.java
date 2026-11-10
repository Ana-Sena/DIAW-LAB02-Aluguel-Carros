package br.pucminas.rotalivre.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

public record VehicleRequest(
    @NotBlank @Size(max = 80) String registration,
    @NotBlank @Pattern(regexp = "[A-Z]{3}[0-9][A-Z0-9][0-9]{2}") String plate,
    @Min(1900) @Max(2100) int year,
    @NotBlank @Size(max = 80) String brand,
    @NotBlank @Size(max = 100) String model,
    @NotNull @DecimalMin("0.01") @Digits(integer = 10, fraction = 2) BigDecimal dailyRate,
    @NotNull UUID ownerId
) {}
