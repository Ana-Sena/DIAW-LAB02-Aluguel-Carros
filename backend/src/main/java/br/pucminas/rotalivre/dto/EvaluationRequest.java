package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public record EvaluationRequest(boolean approved, @NotBlank @Size(max=1000) String opinion,
        @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal creditAmount, @Min(1) @Max(120) Integer installments) {}
