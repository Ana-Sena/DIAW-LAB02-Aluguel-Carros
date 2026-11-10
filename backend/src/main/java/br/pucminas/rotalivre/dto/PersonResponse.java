package br.pucminas.rotalivre.dto;

import br.pucminas.rotalivre.model.Cliente;
import br.pucminas.rotalivre.model.Income;
import br.pucminas.rotalivre.model.Role;
import br.pucminas.rotalivre.model.User;
import java.util.List;
import java.util.UUID;

public record PersonResponse(
    UUID id,
    String username,
    Role role,
    String name,
    String cpf,
    String rg,
    String address,
    String profession,
    List<Income> incomes
) {
    public static PersonResponse of(User user) {
        if (user instanceof Cliente client) {
            return new PersonResponse(
                client.id,
                client.username,
                client.role,
                client.name,
                client.cpf,
                client.rg,
                client.address,
                client.profession,
                List.copyOf(client.incomes)
            );
        }
        return new PersonResponse(
            user.id,
            user.username,
            user.role,
            user.name,
            null,
            null,
            null,
            null,
            List.of()
        );
    }
}
