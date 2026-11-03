package br.pucminas.rotalivre.dto;
import br.pucminas.rotalivre.model.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
public final class Views {
    private Views() {}
    public record Person(UUID id, String username, Role role, String name, String cpf, String rg, String address, String profession, List<Income> incomes) {
        public static Person of(User u) { return new Person(u.id,u.username,u.role,u.name,u.cpf,u.rg,u.address,u.profession,List.copyOf(u.incomes)); }
    }
    public record Owner(UUID id, String name, Role role) {
        public static Owner of(User u) { return new Owner(u.id,u.name,u.role); }
    }
    public record Car(UUID id, String registration, String plate, int year, String brand, String model, BigDecimal dailyRate, Owner owner) {
        public static Car of(Vehicle v) { return new Car(v.id,v.registration,v.plate,v.year,v.brand,v.model,v.dailyRate,Owner.of(v.owner)); }
    }
    public record Order(UUID id, Owner customer, Car vehicle, LocalDate startDate, LocalDate endDate,
        Rental.Status status, Role ownershipType, BigDecimal total, String notes, String opinion, Owner evaluator,
        Owner bank, BigDecimal creditAmount, Integer installments, UUID contractNumber, Instant contractedAt, Instant createdAt) {
        public static Order of(Rental r) { return new Order(r.id,Owner.of(r.customer),Car.of(r.vehicle),r.startDate,r.endDate,
            r.status,r.ownershipType,r.total,r.notes,r.opinion,r.evaluator==null?null:Owner.of(r.evaluator),r.bank==null?null:Owner.of(r.bank),
            r.creditAmount,r.installments,r.contractNumber,r.contractedAt,r.createdAt); }
    }
}
