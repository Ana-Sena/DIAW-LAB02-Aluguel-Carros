package br.pucminas.rotalivre.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@DiscriminatorValue("CLIENTE")
public class Cliente extends User {

    @Column(unique = true, length = 11)
    public String cpf;

    public String rg;
    public String address;
    public String profession;

    @ElementCollection
    @CollectionTable(name = "incomes", joinColumns = @JoinColumn(name = "user_id"))
    @OrderColumn(name = "position")
    public List<Income> incomes = new ArrayList<>();

    public Cliente() {
        role = Role.CLIENTE;
    }

    public boolean hasCompleteProfile() {
        return cpf != null && rg != null && address != null && profession != null;
    }
}
