package br.pucminas.rotalivre.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "credit_contracts")
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "contract_id", nullable = false, unique = true)
    public Contrato contract;

    @ManyToOne(optional = false)
    public Banco bank;

    @Column(nullable = false, precision = 12, scale = 2)
    public BigDecimal amount;

    @Column(nullable = false)
    public int installments;

    @Column(nullable = false)
    public Instant grantedAt = Instant.now();

    protected ContratoCredito() {}

    public ContratoCredito(Contrato contract, Banco bank, BigDecimal amount, int installments) {
        if (amount == null || amount.signum() <= 0 || amount.compareTo(contract.total) > 0) {
            throw new IllegalArgumentException(
                "Crédito deve ser positivo e não ultrapassar o total do contrato."
            );
        }
        if (installments < 1 || installments > 120) {
            throw new IllegalArgumentException("Crédito deve ter de 1 a 120 parcelas.");
        }
        this.contract = contract;
        this.bank = bank;
        this.amount = amount;
        this.installments = installments;
    }
}
