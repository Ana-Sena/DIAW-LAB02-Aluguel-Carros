package br.pucminas.rotalivre.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record EvaluationRequest(
    boolean approved,
    @NotBlank @Size(max = 1000) String opinion,
    @DecimalMin("0.01") @Digits(integer = 10, fraction = 2) BigDecimal creditAmount,
    @Min(1) @Max(120) Integer installments
) {}
