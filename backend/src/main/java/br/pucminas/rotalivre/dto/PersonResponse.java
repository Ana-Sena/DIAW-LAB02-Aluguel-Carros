package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

public record PersonResponse(UUID id, String username, Role role, String name, String cpf, String rg, String address, String profession, List<Income> incomes) {
        public static PersonResponse of(User u) { return new PersonResponse(u.id,u.username,u.role,u.name,u.cpf,u.rg,u.address,u.profession,List.copyOf(u.incomes)); }
    }
