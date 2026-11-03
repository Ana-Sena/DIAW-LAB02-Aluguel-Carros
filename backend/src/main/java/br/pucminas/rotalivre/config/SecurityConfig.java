package br.pucminas.rotalivre.config;

import br.pucminas.rotalivre.repository.UserRepository;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.*;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean UserDetailsService userDetailsService(UserRepository users) {
        return username -> users.findByUsername(username).map(u -> User.withUsername(u.username)
            .password(u.passwordHash).roles(u.role.name()).build())
            .orElseThrow(() -> new UsernameNotFoundException("Usuário ou senha inválidos."));
    }
    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(a -> a.requestMatchers("/api/auth/csrf", "/api/auth/register", "/api/auth/login").permitAll()
                .anyRequest().authenticated())
            .csrf(c -> c.csrfTokenRepository(new HttpSessionCsrfTokenRepository()))
            .formLogin(f -> f.loginProcessingUrl("/api/auth/login")
                .successHandler((req,res,auth) -> { res.setStatus(204); })
                .failureHandler((req,res,ex) -> { res.setStatus(401); res.setContentType("application/json;charset=UTF-8"); res.getWriter().write("{\"message\":\"Usuário ou senha inválidos.\"}"); }))
            .logout(l -> l.logoutUrl("/api/auth/logout").logoutSuccessHandler((req,res,auth) -> res.setStatus(204)))
            .exceptionHandling(e -> e.authenticationEntryPoint((req,res,ex) -> res.sendError(401))
                .accessDeniedHandler((req,res,ex) -> res.sendError(403)))
            .build();
    }
}
