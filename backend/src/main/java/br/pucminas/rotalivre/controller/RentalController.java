package br.pucminas.rotalivre.controller;

import br.pucminas.rotalivre.dto.*;
import br.pucminas.rotalivre.service.RentalService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RentalController {

    private final RentalService service;

    public RentalController(RentalService service) {
        this.service = service;
    }

    @GetMapping("/vehicles")
    public List<VehicleResponse> cars() {
        return service.cars();
    }

    @PostMapping("/vehicles")
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse add(Principal p, @Valid @RequestBody VehicleRequest i) {
        return service.addCar(p.getName(), i);
    }

    @GetMapping("/rentals")
    public List<RentalResponse> list(Principal p) {
        return service.list(p.getName());
    }

    @GetMapping("/rentals/{id}")
    public RentalResponse get(Principal p, @PathVariable UUID id) {
        return service.get(p.getName(), id);
    }

    @PostMapping("/rentals")
    @ResponseStatus(HttpStatus.CREATED)
    public RentalResponse create(Principal p, @Valid @RequestBody RentalRequest i) {
        return service.create(p.getName(), i);
    }

    @PutMapping("/rentals/{id}")
    public RentalResponse update(
        Principal p,
        @PathVariable UUID id,
        @Valid @RequestBody RentalRequest i
    ) {
        return service.update(p.getName(), id, i);
    }

    @PostMapping("/rentals/{id}/cancel")
    public RentalResponse cancel(Principal p, @PathVariable UUID id) {
        return service.cancel(p.getName(), id);
    }

    @PostMapping("/rentals/{id}/evaluate")
    public RentalResponse evaluate(
        Principal p,
        @PathVariable UUID id,
        @Valid @RequestBody EvaluationRequest i
    ) {
        return service.evaluate(p.getName(), id, i);
    }

    @PostMapping("/rentals/{id}/contract")
    public RentalResponse contract(Principal p, @PathVariable UUID id) {
        return service.contract(p.getName(), id);
    }
}
