package br.pucminas.rotalivre.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "companies")
@DiscriminatorValue("EMPRESA")
public class Empresa extends Agente {

    public Empresa() {
        role = Role.EMPRESA;
    }
}
