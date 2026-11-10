package br.pucminas.rotalivre.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ClientProfileRequest(
    @NotBlank @Size(max = 200) String name,
    @NotBlank @Pattern(regexp = "[0-9]{11}") String cpf,
    @NotBlank @Size(max = 30) String rg,
    @NotBlank @Size(max = 255) String address,
    @NotBlank @Size(max = 100) String profession,
    @NotNull @Size(max = 3) List<@Valid EmploymentRequest> incomes
) {}
