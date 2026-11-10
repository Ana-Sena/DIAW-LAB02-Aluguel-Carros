package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public record EmploymentRequest(@NotBlank @Size(max=200) String employer, @NotNull @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal amount) {}
