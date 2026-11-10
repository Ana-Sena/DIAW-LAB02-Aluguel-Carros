package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public record RegistrationRequest(@NotBlank @Pattern(regexp="[a-zA-Z0-9_.-]{3,80}") String username,
        @NotBlank @Size(min=8,max=72) String password, @NotBlank @Size(max=200) String name, @NotNull Role role) {}
