package br.pucminas.rotalivre.controller;

import br.pucminas.rotalivre.dto.*;
import br.pucminas.rotalivre.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AccountService accounts;

    public AuthController(AccountService accounts) {
        this.accounts = accounts;
    }

    @GetMapping("/auth/csrf")
    public Map<String, String> csrf(CsrfToken token) {
        return Map.of("token", token.getToken(), "headerName", token.getHeaderName());
    }

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public OwnerResponse register(@Valid @RequestBody RegistrationRequest r) {
        return accounts.register(r);
    }

    @GetMapping("/auth/me")
    public PersonResponse me(Principal p) {
        return accounts.profile(p.getName());
    }

    @GetMapping("/clients/{id}")
    public PersonResponse customer(Principal p, @PathVariable java.util.UUID id) {
        return accounts.customer(p.getName(), id);
    }

    @PutMapping("/clients/me")
    public PersonResponse update(Principal p, @Valid @RequestBody ClientProfileRequest r) {
        return accounts.update(p.getName(), r);
    }

    @DeleteMapping("/clients/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Principal p, HttpServletRequest request) {
        accounts.delete(p.getName());
        request.getSession().invalidate();
    }

    @GetMapping("/owners")
    public java.util.List<OwnerResponse> owners(Principal p) {
        return accounts.owners(p.getName());
    }
}
