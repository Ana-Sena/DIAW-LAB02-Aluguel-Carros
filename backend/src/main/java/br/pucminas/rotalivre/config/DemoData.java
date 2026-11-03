package br.pucminas.rotalivre.config;
import br.pucminas.rotalivre.model.*;
import br.pucminas.rotalivre.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Configuration @Profile("demo")
public class DemoData {
    @Bean CommandLineRunner seed(UserRepository users, VehicleRepository cars, PasswordEncoder encoder) {
        return args -> {
            if(users.count()>0) return;
            User client=person("cliente","Cliente Demonstração",Role.CLIENTE,encoder);
            client.cpf="52998224725"; client.rg="MG123456"; client.address="Belo Horizonte, MG"; client.profession="Engenheiro de software";
            client.incomes.add(new Income("Empresa Exemplo",new BigDecimal("6000.00"))); users.save(client);
            User company=users.save(person("empresa","Mobilidade Minas",Role.EMPRESA,encoder));
            users.save(person("banco","Banco Horizonte",Role.BANCO,encoder));
            String[][] catalog={{"Fiat","Argo","ABC1D23","129.90"},{"Volkswagen","Polo","DEF4G56","159.90"},{"Chevrolet","Tracker","HIJ7K89","239.90"}};
            for(int n=0;n<catalog.length;n++) {
                String[] c=catalog[n]; Vehicle v=new Vehicle(); v.brand=c[0]; v.model=c[1]; v.plate=c[2]; v.registration="DEMO-00"+(n+1);
                v.year=2025; v.owner=company; v.dailyRate=new BigDecimal(c[3]); cars.save(v);
            }
        };
    }
    private User person(String login,String name,Role role,PasswordEncoder encoder) {
        User u=new User(); u.username=login; u.name=name; u.role=role; u.passwordHash=encoder.encode("Demo@12345"); return u;
    }
}
