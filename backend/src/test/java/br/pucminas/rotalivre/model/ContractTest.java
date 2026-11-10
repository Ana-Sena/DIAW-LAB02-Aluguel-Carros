package br.pucminas.rotalivre.model;

import static org.assertj.core.api.Assertions.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class ContractTest {

    private Rental rental(Role ownership) {
        Rental rental = new Rental();
        rental.customer = new Cliente();
        rental.total = new BigDecimal("300.00");
        rental.startDate = LocalDate.of(2027, 1, 1);
        rental.endDate = LocalDate.of(2027, 1, 3);
        rental.ownershipType = ownership;
        return rental;
    }

    @Test
    void contractKeepsApprovedTermsWhenRentalChanges() {
        Rental rental = rental(Role.EMPRESA);
        Empresa company = new Empresa();
        Contrato contract = new Contrato(rental, company);
        rental.total = new BigDecimal("999.00");
        rental.startDate = LocalDate.of(2028, 1, 1);
        assertThat(contract.total).isEqualByComparingTo("300.00");
        assertThat(contract.startDate).isEqualTo(LocalDate.of(2027, 1, 1));
        assertThat(contract.owner).isSameAs(company);
    }

    @Test
    void customerCanBeContractOwner() {
        Rental rental = rental(Role.CLIENTE);
        assertThat(new Contrato(rental, new Empresa()).owner).isSameAs(rental.customer);
    }

    @Test
    void contractCanOnlyBeExecutedOnce() {
        Contrato contract = new Contrato(rental(Role.BANCO), new Banco());
        Instant signedAt = Instant.parse("2026-11-10T12:00:00Z");
        contract.execute(signedAt);
        assertThatThrownBy(() -> contract.execute(Instant.now())).isInstanceOf(
            IllegalStateException.class
        );
        assertThat(contract.executedAt).isEqualTo(signedAt);
    }

    @ParameterizedTest
    @ValueSource(strings = { "0", "-1", "300.01" })
    void rejectsCreditOutsideContractAmount(String amount) {
        Banco bank = new Banco();
        Contrato contract = new Contrato(rental(Role.BANCO), bank);
        assertThatThrownBy(() ->
            bank.grantCredit(contract, new BigDecimal(amount), 2)
        ).isInstanceOf(IllegalArgumentException.class);
    }

    @ParameterizedTest
    @ValueSource(ints = { 0, -1, 121 })
    void rejectsInvalidInstallmentCount(int installments) {
        Banco bank = new Banco();
        Contrato contract = new Contrato(rental(Role.BANCO), bank);
        assertThatThrownBy(() ->
            bank.grantCredit(contract, BigDecimal.TEN, installments)
        ).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void creditIdentifiesTheGrantingBank() {
        Banco bank = new Banco();
        Contrato contract = new Contrato(rental(Role.BANCO), bank);
        ContratoCredito credit = bank.grantCredit(contract, contract.total, 120);
        assertThat(credit.bank).isSameAs(bank);
        assertThat(credit.contract).isSameAs(contract);
        assertThat(credit.amount).isEqualByComparingTo("300.00");
        assertThat(credit.installments).isEqualTo(120);
    }
}
