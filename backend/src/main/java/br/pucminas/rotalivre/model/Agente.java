package br.pucminas.rotalivre.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "agents")
public abstract class Agente extends User {

    public boolean canOwnVehicleAs(Role ownershipType) {
        return role == ownershipType;
    }
}
