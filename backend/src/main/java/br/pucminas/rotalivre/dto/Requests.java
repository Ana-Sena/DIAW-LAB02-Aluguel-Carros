package br.pucminas.rotalivre.dto;
import br.pucminas.rotalivre.model.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
public final class Requests {
    private Requests() {}
    public record Registration(@NotBlank @Pattern(regexp="[a-zA-Z0-9_.-]{3,80}") String username,
        @NotBlank @Size(min=8,max=72) String password, @NotBlank @Size(max=200) String name, @NotNull Role role) {}
    public record Employment(@NotBlank @Size(max=200) String employer, @NotNull @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal amount) {}
    public record Profile(@NotBlank @Size(max=200) String name, @NotBlank @Pattern(regexp="[0-9]{11}") String cpf,
        @NotBlank @Size(max=30) String rg, @NotBlank @Size(max=255) String address,
        @NotBlank @Size(max=100) String profession, @NotNull @Size(max=3) List<@Valid Employment> incomes) {}
    public record VehicleInput(@NotBlank @Size(max=80) String registration,
        @NotBlank @Pattern(regexp="[A-Z]{3}[0-9][A-Z0-9][0-9]{2}") String plate,
        @Min(1900) @Max(2100) int year, @NotBlank @Size(max=80) String brand,
        @NotBlank @Size(max=100) String model, @NotNull @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal dailyRate,
        @NotNull UUID ownerId) {}
    public record RentalInput(@NotNull UUID vehicleId, @NotNull @FutureOrPresent LocalDate startDate,
        @NotNull @FutureOrPresent LocalDate endDate, @NotNull Role ownershipType, @Size(max=1000) String notes) {}
    public record Evaluation(boolean approved, @NotBlank @Size(max=1000) String opinion,
        @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal creditAmount, @Min(1) @Max(120) Integer installments) {}
}
