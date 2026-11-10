package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Vehicle;
import java.math.BigDecimal;
import java.util.UUID;

public record VehicleResponse(
    UUID id,
    String registration,
    String plate,
    int year,
    String brand,
    String model,
    BigDecimal dailyRate,
    OwnerResponse owner
) {
    public static VehicleResponse of(Vehicle v) {
        return new VehicleResponse(
            v.id,
            v.registration,
            v.plate,
            v.year,
            v.brand,
            v.model,
            v.dailyRate,
            OwnerResponse.of(v.owner)
        );
    }
}
