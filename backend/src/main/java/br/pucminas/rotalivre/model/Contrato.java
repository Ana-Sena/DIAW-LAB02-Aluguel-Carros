package br.pucminas.rotalivre.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "contracts")
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "rental_id", nullable = false, unique = true)
    public Rental rental;

    @ManyToOne(optional = false)
    public User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Role ownershipType;

    @Column(nullable = false, precision = 12, scale = 2)
    public BigDecimal total;

    @Column(nullable = false)
    public LocalDate startDate;

    @Column(nullable = false)
    public LocalDate endDate;

    public Instant executedAt;

    @OneToOne(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    public ContratoCredito credit;

    protected Contrato() {}

    public Contrato(Rental rental, Agente evaluator) {
        this.rental = rental;
        this.owner = rental.ownershipType == Role.CLIENTE ? rental.customer : evaluator;
        this.ownershipType = rental.ownershipType;
        this.total = rental.total;
        this.startDate = rental.startDate;
        this.endDate = rental.endDate;
    }

    public void execute(Instant when) {
        if (executedAt != null) {
            throw new IllegalStateException("Contrato já executado.");
        }
        executedAt = when;
    }
}
