package br.pucminas.rotalivre.model;
import jakarta.persistence.*;
import java.util.*;
@Entity @Table(name="app_users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
    @Column(nullable=false, unique=true, length=80) public String username;
    @Column(nullable=false) public String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Role role;
    @Column(nullable=false) public String name;
    @Column(unique=true, length=11) public String cpf;
    public String rg;
    public String address;
    public String profession;
    @ElementCollection @CollectionTable(name="incomes", joinColumns=@JoinColumn(name="user_id"))
    @OrderColumn(name="position") public List<Income> incomes = new ArrayList<>();
}
