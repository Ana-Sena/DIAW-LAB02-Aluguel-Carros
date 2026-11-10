package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public record ClientProfileRequest(@NotBlank @Size(max=200) String name, @NotBlank @Pattern(regexp="[0-9]{11}") String cpf,
        @NotBlank @Size(max=30) String rg, @NotBlank @Size(max=255) String address,
        @NotBlank @Size(max=100) String profession, @NotNull @Size(max=3) List<@Valid EmploymentRequest> incomes) {}
