package br.pucminas.rotalivre.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Embeddable
public class Income {

    @Column(nullable = false)
    public String employer;

    @Column(nullable = false, precision = 12, scale = 2)
    public BigDecimal amount;

    public Income() {}

    public Income(String employer, BigDecimal amount) {
        this.employer = employer;
        this.amount = amount;
    }
}
