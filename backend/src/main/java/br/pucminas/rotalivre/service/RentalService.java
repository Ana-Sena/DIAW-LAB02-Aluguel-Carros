package br.pucminas.rotalivre.service;
import br.pucminas.rotalivre.dto.*;
import br.pucminas.rotalivre.model.*;
import br.pucminas.rotalivre.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.util.*;
import static br.pucminas.rotalivre.service.AccountService.*;

@Service @Transactional
public class RentalService {
    private final AccountService accounts;
    private final UserRepository users;
    private final VehicleRepository vehicles;
    private final RentalRepository rentals;
    public RentalService(AccountService accounts, UserRepository users, VehicleRepository vehicles, RentalRepository rentals) {
        this.accounts=accounts; this.users=users; this.vehicles=vehicles; this.rentals=rentals;
    }
    public List<Views.Car> cars() { return vehicles.findAll().stream().map(Views.Car::of).toList(); }
    public Views.Car addCar(String username, Requests.VehicleInput i) {
        requireAgent(accounts.current(username));
        User owner=users.findById(i.ownerId()).orElseThrow(() -> bad("Proprietário não encontrado."));
        Vehicle v=new Vehicle(); v.registration=i.registration().trim(); v.plate=i.plate(); v.year=i.year();
        v.brand=i.brand().trim(); v.model=i.model().trim(); v.dailyRate=i.dailyRate(); v.owner=owner;
        return Views.Car.of(vehicles.save(v));
    }
    public List<Views.Order> list(String username) {
        User u=accounts.current(username);
        return (u.role==Role.CLIENTE ? rentals.findByCustomerIdOrderByCreatedAtDesc(u.id) : rentals.findAllByOrderByCreatedAtDesc()).stream().map(Views.Order::of).toList();
    }
    private Rental visible(User u, UUID id) {
        Rental r=rentals.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Pedido não encontrado."));
        if (u.role==Role.CLIENTE && !r.customer.id.equals(u.id)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return r;
    }
    public Views.Order get(String username, UUID id) { return Views.Order.of(visible(accounts.current(username),id)); }
    private void fill(Rental r, Requests.RentalInput i) {
        if(i.endDate().isBefore(i.startDate())) throw bad("A devolução deve ser igual ou posterior à retirada.");
        Vehicle v=vehicles.findById(i.vehicleId()).orElseThrow(() -> bad("Veículo não encontrado."));
        r.vehicle=v; r.startDate=i.startDate(); r.endDate=i.endDate(); r.notes=i.notes(); r.ownershipType=i.ownershipType();
        long days=ChronoUnit.DAYS.between(r.startDate,r.endDate)+1;
        if(days>365) throw bad("O período máximo de aluguel é de 365 dias.");
        r.total=v.dailyRate.multiply(BigDecimal.valueOf(days));
        r.status=Rental.Status.EM_ANALISE; r.evaluator=null; r.opinion=null; r.bank=null; r.creditAmount=null; r.installments=null;
    }
    public Views.Order create(String username, Requests.RentalInput i) {
        User u=accounts.current(username);
        if(u.role!=Role.CLIENTE) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Somente clientes criam pedidos.");
        if(u.cpf==null || u.rg==null || u.address==null || u.profession==null) throw bad("Complete seu perfil antes de criar um pedido.");
        Rental r=new Rental(); r.customer=u; fill(r,i); return Views.Order.of(rentals.save(r));
    }
    public Views.Order update(String username, UUID id, Requests.RentalInput i) {
        Rental r=visible(accounts.current(username),id); editable(r); fill(r,i); return Views.Order.of(r);
    }
    private void editable(Rental r) {
        if(r.status==Rental.Status.CANCELADO || r.status==Rental.Status.CONTRATADO) throw conflict("Pedido encerrado não pode ser alterado.");
    }
    public Views.Order cancel(String username, UUID id) {
        User u=accounts.current(username); Rental r=visible(u,id);
        if(u.role!=Role.CLIENTE) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Somente o cliente cancela seu pedido.");
        if(r.status==Rental.Status.CANCELADO) throw conflict("Pedido já cancelado.");
        if(r.status==Rental.Status.CONTRATADO) throw conflict("Contrato executado não pode ser cancelado pelo protótipo.");
        r.status=Rental.Status.CANCELADO; return Views.Order.of(r);
    }
    public Views.Order evaluate(String username, UUID id, Requests.Evaluation e) {
        User u=accounts.current(username); requireAgent(u); Rental r=visible(u,id); editable(r);
        if(r.status!=Rental.Status.EM_ANALISE) throw conflict("Apenas pedidos em análise podem receber parecer.");
        if(e.creditAmount()!=null) {
            if(u.role!=Role.BANCO) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Somente bancos concedem crédito.");
            if(!e.approved() || e.installments()==null || e.creditAmount().compareTo(r.total)>0) throw bad("Crédito exige aprovação, parcelas e valor até o total do aluguel.");
            r.bank=u; r.creditAmount=e.creditAmount(); r.installments=e.installments();
        } else if(e.installments()!=null) throw bad("Informe o valor de crédito para definir parcelas.");
        if(e.approved() && r.ownershipType!=Role.CLIENTE && r.ownershipType!=u.role) throw bad("O tipo de proprietário exige aprovação por agente da mesma categoria.");
        r.evaluator=u; r.opinion=e.opinion().trim(); r.status=e.approved()?Rental.Status.APROVADO:Rental.Status.REPROVADO;
        return Views.Order.of(r);
    }
    public Views.Order contract(String username, UUID id) {
        User u=accounts.current(username); Rental r=visible(u,id);
        if(u.role!=Role.CLIENTE) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if(r.status!=Rental.Status.APROVADO) throw conflict("Somente pedidos aprovados podem ser contratados.");
        if(r.startDate.isBefore(LocalDate.now())) throw conflict("Atualize as datas do pedido e solicite nova análise.");
        Vehicle v=vehicles.lockById(r.vehicle.id).orElseThrow();
        if(rentals.overlaps(v.id,r.id,r.startDate,r.endDate)) throw conflict("Veículo já contratado nesse período. Altere as datas ou o veículo.");
        r.status=Rental.Status.CONTRATADO; r.contractNumber=UUID.randomUUID(); r.contractedAt=Instant.now();
        v.owner=r.ownershipType==Role.CLIENTE?r.customer:r.evaluator;
        return Views.Order.of(r);
    }
}
