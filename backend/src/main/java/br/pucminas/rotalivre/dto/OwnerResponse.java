package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

public record OwnerResponse(UUID id, String name, Role role) {
        public static OwnerResponse of(User u) { return new OwnerResponse(u.id,u.name,u.role); }
    }
