package br.pucminas.rotalivre.controller;
import br.pucminas.rotalivre.dto.*;
import br.pucminas.rotalivre.service.RentalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.*;
@RestController @RequestMapping("/api")
public class RentalController {
    private final RentalService service;
    public RentalController(RentalService service) { this.service=service; }
    @GetMapping("/vehicles") public Object cars() { return service.cars(); }
    @PostMapping("/vehicles") @ResponseStatus(HttpStatus.CREATED)
    public Object add(Principal p,@Valid @RequestBody Requests.VehicleInput i) { return service.addCar(p.getName(),i); }
    @GetMapping("/rentals") public Object list(Principal p) { return service.list(p.getName()); }
    @GetMapping("/rentals/{id}") public Object get(Principal p,@PathVariable UUID id) { return service.get(p.getName(),id); }
    @PostMapping("/rentals") @ResponseStatus(HttpStatus.CREATED)
    public Object create(Principal p,@Valid @RequestBody Requests.RentalInput i) { return service.create(p.getName(),i); }
    @PutMapping("/rentals/{id}") public Object update(Principal p,@PathVariable UUID id,@Valid @RequestBody Requests.RentalInput i) { return service.update(p.getName(),id,i); }
    @PostMapping("/rentals/{id}/cancel") public Object cancel(Principal p,@PathVariable UUID id) { return service.cancel(p.getName(),id); }
    @PostMapping("/rentals/{id}/evaluate") public Object evaluate(Principal p,@PathVariable UUID id,@Valid @RequestBody Requests.Evaluation i) { return service.evaluate(p.getName(),id,i); }
    @PostMapping("/rentals/{id}/contract") public Object contract(Principal p,@PathVariable UUID id) { return service.contract(p.getName(),id); }
}
