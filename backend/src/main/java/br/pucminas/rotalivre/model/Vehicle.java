package br.pucminas.rotalivre.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @Column(nullable = false, unique = true)
    public String registration;

    @Column(nullable = false, unique = true, length = 7)
    public String plate;

    @Column(name = "manufacture_year", nullable = false)
    public int year;

    @Column(nullable = false)
    public String brand;

    @Column(nullable = false)
    public String model;

    @Column(nullable = false, precision = 12, scale = 2)
    public BigDecimal dailyRate;

    @ManyToOne(optional = false)
    public User owner;

    @Version
    public long version;
}
