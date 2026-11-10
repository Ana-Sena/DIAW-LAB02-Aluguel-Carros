package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Role;
import br.pucminas.rotalivre.model.User;
import java.util.UUID;

public record OwnerResponse(UUID id, String name, Role role) {
    public static OwnerResponse of(User u) {
        return new OwnerResponse(u.id, u.name, u.role);
    }
}
