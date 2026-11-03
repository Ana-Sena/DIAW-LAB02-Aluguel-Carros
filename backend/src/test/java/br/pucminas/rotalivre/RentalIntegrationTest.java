package br.pucminas.rotalivre;

import br.pucminas.rotalivre.model.*;
import br.pucminas.rotalivre.repository.*;
import br.pucminas.rotalivre.service.AccountService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.UUID;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("demo") @Transactional
class RentalIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired VehicleRepository vehicles;
    @Autowired RentalRepository rentals;
    @Autowired UserRepository users;
    String body(String ownership) {
        UUID car=vehicles.findAll().getFirst().id;
        return """
            {"vehicleId":"%s","startDate":"%s","endDate":"%s","ownershipType":"%s","notes":"Viagem"}
            """.formatted(car,LocalDate.now().plusDays(1),LocalDate.now().plusDays(3),ownership);
    }
    UUID create(String owner) throws Exception {
        mvc.perform(post("/api/rentals").with(user("cliente")).with(csrf()).contentType("application/json").content(body(owner)))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("EM_ANALISE"));
        return rentals.findAllByOrderByCreatedAtDesc().getFirst().id;
    }
    void evaluate(UUID id, String login, String body) throws Exception {
        mvc.perform(post("/api/rentals/"+id+"/evaluate").with(user(login)).with(csrf()).contentType("application/json").content(body)).andExpect(status().isOk());
    }
    @Test void requiresLoginAndCsrf() throws Exception {
        mvc.perform(get("/api/vehicles")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/register").contentType("application/json").content("{}" )).andExpect(status().isForbidden());
    }
    @Test void authenticatesWithRealPassword() throws Exception {
        mvc.perform(post("/api/auth/login").with(csrf()).param("username","cliente").param("password","Demo@12345"))
            .andExpect(status().isNoContent()).andExpect(result -> assertThat(result.getRequest().getSession(false)).isNotNull());
        mvc.perform(post("/api/auth/login").with(csrf()).param("username","cliente").param("password","errada")).andExpect(status().isUnauthorized());
    }
    @Test void registersWithoutExposingPasswordAndRejectsDuplicate() throws Exception {
        String payload="{\"username\":\"novo\",\"password\":\"Senha@123\",\"name\":\"Novo Cliente\",\"role\":\"CLIENTE\"}";
        mvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json").content(payload))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.passwordHash").doesNotExist());
        assertThat(users.findByUsername("novo").orElseThrow().passwordHash).startsWith("$2");
        mvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json").content(payload)).andExpect(status().isConflict());
    }
    @Test void approvesAndExecutesContractWithBankCredit() throws Exception {
        UUID id=create("BANCO");
        evaluate(id,"banco","{\"approved\":true,\"opinion\":\"Renda compatível\",\"creditAmount\":100,\"installments\":2}");
        mvc.perform(post("/api/rentals/"+id+"/contract").with(user("cliente")).with(csrf()))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CONTRATADO"))
            .andExpect(jsonPath("$.contractNumber").isNotEmpty()).andExpect(jsonPath("$.bank.role").value("BANCO"))
            .andExpect(jsonPath("$.vehicle.owner.role").value("BANCO"));
    }
    @Test void clientCannotEvaluateAndCompanyCannotGrantCredit() throws Exception {
        UUID id=create("EMPRESA"); String payload="{\"approved\":true,\"opinion\":\"Ok\",\"creditAmount\":100,\"installments\":2}";
        for(String login:new String[]{"cliente","empresa"}) mvc.perform(post("/api/rentals/"+id+"/evaluate").with(user(login)).with(csrf()).contentType("application/json").content(payload)).andExpect(status().isForbidden());
    }
    @Test void rejectsWrongOwnerCategory() throws Exception {
        UUID id=create("BANCO");
        mvc.perform(post("/api/rentals/"+id+"/evaluate").with(user("empresa")).with(csrf()).contentType("application/json").content("{\"approved\":true,\"opinion\":\"Ok\"}")).andExpect(status().isBadRequest());
    }
    @Test void customersCannotReadOtherCustomersOrdersOrFinancialData() throws Exception {
        UUID id=create("CLIENTE");
        User other=new User(); other.username="outro"; other.name="Outro"; other.role=Role.CLIENTE; other.passwordHash="unused"; users.save(other);
        mvc.perform(get("/api/rentals/"+id).with(user("outro"))).andExpect(status().isForbidden());
        mvc.perform(get("/api/clients/"+users.findByUsername("cliente").orElseThrow().id).with(user("outro"))).andExpect(status().isForbidden());
        mvc.perform(get("/api/rentals").with(user("outro"))).andExpect(jsonPath("$.length()").value(0));
    }
    @Test void changesResetFinancialApproval() throws Exception {
        UUID id=create("EMPRESA"); evaluate(id,"empresa","{\"approved\":true,\"opinion\":\"Ok\"}");
        mvc.perform(put("/api/rentals/"+id).with(user("empresa")).with(csrf()).contentType("application/json").content(body("CLIENTE")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("EM_ANALISE")).andExpect(jsonPath("$.opinion").isEmpty());
    }
    @Test void cancellationPreservesHistoryAndPreventsEditing() throws Exception {
        UUID id=create("CLIENTE");
        mvc.perform(post("/api/rentals/"+id+"/cancel").with(user("cliente")).with(csrf())).andExpect(jsonPath("$.status").value("CANCELADO"));
        mvc.perform(put("/api/rentals/"+id).with(user("cliente")).with(csrf()).contentType("application/json").content(body("CLIENTE"))).andExpect(status().isConflict());
        mvc.perform(delete("/api/clients/me").with(user("cliente")).with(csrf())).andExpect(status().isConflict());
    }
    @Test void overlappingContractsAreRejected() throws Exception {
        UUID first=create("EMPRESA"); evaluate(first,"empresa","{\"approved\":true,\"opinion\":\"Ok\"}");
        mvc.perform(post("/api/rentals/"+first+"/contract").with(user("cliente")).with(csrf())).andExpect(status().isOk());
        UUID second=create("EMPRESA"); evaluate(second,"empresa","{\"approved\":true,\"opinion\":\"Ok\"}");
        mvc.perform(post("/api/rentals/"+second+"/contract").with(user("cliente")).with(csrf())).andExpect(status().isConflict());
    }
    @Test void validatesIncomeLimitAndCpf() throws Exception {
        assertThat(AccountService.validCpf("52998224725")).isTrue();
        assertThat(AccountService.validCpf("11111111111")).isFalse();
        String income="{\"employer\":\"Empresa\",\"amount\":1000}";
        String p="{\"name\":\"Cliente\",\"cpf\":\"52998224725\",\"rg\":\"123\",\"address\":\"Rua A\",\"profession\":\"Dev\",\"incomes\":[%s]}";
        mvc.perform(put("/api/clients/me").with(user("cliente")).with(csrf()).contentType("application/json").content(p.formatted(String.join(",",income,income,income,income)))).andExpect(status().isBadRequest());
        mvc.perform(put("/api/clients/me").with(user("cliente")).with(csrf()).contentType("application/json").content(p.formatted(income))).andExpect(status().isOk()).andExpect(jsonPath("$.incomes.length()").value(1));
    }
    @Test void customerCanDeleteUnlinkedAccount() throws Exception {
        User u=new User(); u.username="remover"; u.name="Remover"; u.role=Role.CLIENTE; u.passwordHash="unused"; users.save(u);
        mvc.perform(delete("/api/clients/me").with(user("remover")).with(csrf())).andExpect(status().isNoContent());
        assertThat(users.findByUsername("remover")).isEmpty();
    }
    @Test void agentsCanReadFinancialProfile() throws Exception {
        mvc.perform(get("/api/clients/"+users.findByUsername("cliente").orElseThrow().id).with(user("banco")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.incomes[0].amount").value(6000)).andExpect(jsonPath("$.passwordHash").doesNotExist());
    }
}
