package br.pucminas.rotalivre.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;
@Entity @Table(name="rentals")
public class Rental {
    public enum Status { EM_ANALISE, APROVADO, REPROVADO, CONTRATADO, CANCELADO }
    @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
    @ManyToOne(optional=false) public User customer;
    @ManyToOne(optional=false) public Vehicle vehicle;
    @Column(nullable=false) public LocalDate startDate;
    @Column(nullable=false) public LocalDate endDate;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Status status = Status.EM_ANALISE;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Role ownershipType;
    @Column(nullable=false, precision=12, scale=2) public BigDecimal total;
    @Column(length=1000) public String notes;
    @Column(length=1000) public String opinion;
    @ManyToOne public User evaluator;
    @ManyToOne public User bank;
    @Column(precision=12, scale=2) public BigDecimal creditAmount;
    public Integer installments;
    public UUID contractNumber;
    public Instant contractedAt;
    @Column(nullable=false) public Instant createdAt = Instant.now();
    @Version public long version;
}
