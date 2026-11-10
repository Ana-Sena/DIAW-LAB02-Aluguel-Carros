package br.pucminas.rotalivre.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "banks")
@DiscriminatorValue("BANCO")
public class Banco extends Agente {

    public Banco() {
        role = Role.BANCO;
    }

    public ContratoCredito grantCredit(
        Contrato contract,
        java.math.BigDecimal amount,
        int installments
    ) {
        return new ContratoCredito(contract, this, amount, installments);
    }
}
