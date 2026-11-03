package br.pucminas.rotalivre.service;
import br.pucminas.rotalivre.dto.*;
import br.pucminas.rotalivre.model.*;
import br.pucminas.rotalivre.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Service @Transactional
public class AccountService {
    private final UserRepository users;
    private final RentalRepository rentals;
    private final VehicleRepository vehicles;
    private final PasswordEncoder encoder;
    public AccountService(UserRepository users, RentalRepository rentals, VehicleRepository vehicles, PasswordEncoder encoder) {
        this.users=users; this.rentals=rentals; this.vehicles=vehicles; this.encoder=encoder;
    }
    public Views.Owner register(Requests.Registration input) {
        String username=input.username().toLowerCase(Locale.ROOT);
        if (users.existsByUsername(username)) throw conflict("Nome de usuário já cadastrado.");
        User u=new User(); u.username=username; u.passwordHash=encoder.encode(input.password()); u.role=input.role(); u.name=input.name().trim();
        return Views.Owner.of(users.save(u));
    }
    public User current(String username) {
        return users.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
    public Views.Person profile(String username) { return Views.Person.of(current(username)); }
    public Views.Person customer(String username, UUID id) {
        requireAgent(current(username));
        User u=users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Cliente não encontrado."));
        if(u.role!=Role.CLIENTE) throw bad("Usuário não é cliente.");
        return Views.Person.of(u);
    }
    public Views.Person update(String username, Requests.Profile p) {
        User u=current(username);
        if (u.role!=Role.CLIENTE) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Perfil exclusivo de cliente.");
        if (!validCpf(p.cpf())) throw bad("CPF inválido.");
        if (users.existsByCpfAndIdNot(p.cpf(),u.id)) throw conflict("CPF já cadastrado.");
        u.name=p.name().trim(); u.cpf=p.cpf(); u.rg=p.rg().trim(); u.address=p.address().trim(); u.profession=p.profession().trim();
        u.incomes.clear(); p.incomes().forEach(i -> u.incomes.add(new Income(i.employer().trim(),i.amount())));
        return Views.Person.of(u);
    }
    public void delete(String username) {
        User u=current(username);
        if (u.role!=Role.CLIENTE) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (rentals.existsByCustomerId(u.id) || vehicles.existsByOwnerId(u.id)) throw conflict("Conta possui pedidos ou veículos vinculados e não pode ser excluída.");
        users.delete(u);
    }
    public List<Views.Owner> owners(String username) { requireAgent(current(username)); return users.findAll().stream().map(Views.Owner::of).toList(); }
    public static void requireAgent(User u) { if (u.role==Role.CLIENTE) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Acesso exclusivo de agentes."); }
    public static ResponseStatusException bad(String m) { return new ResponseStatusException(HttpStatus.BAD_REQUEST,m); }
    public static ResponseStatusException conflict(String m) { return new ResponseStatusException(HttpStatus.CONFLICT,m); }
    public static boolean validCpf(String cpf) {
        if (cpf==null || !cpf.matches("[0-9]{11}") || cpf.chars().distinct().count()==1) return false;
        for (int n=9;n<=10;n++) {
            int sum=0; for(int i=0;i<n;i++) sum+=(cpf.charAt(i)-'0')*(n+1-i);
            int digit=(sum*10)%11; if(digit==10) digit=0;
            if (digit!=cpf.charAt(n)-'0') return false;
        }
        return true;
    }
}
