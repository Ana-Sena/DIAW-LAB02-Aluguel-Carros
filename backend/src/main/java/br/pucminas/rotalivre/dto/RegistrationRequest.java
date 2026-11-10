package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
    @NotBlank @Pattern(regexp = "[a-zA-Z0-9_.-]{3,80}") String username,
    @NotBlank @Size(min = 8, max = 72) String password,
    @NotBlank @Size(max = 200) String name,
    @NotNull Role role
) {}
