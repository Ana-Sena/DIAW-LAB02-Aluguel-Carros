package br.pucminas.rotalivre.controller;
import org.springframework.dao.*;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(ResponseStatusException.class) ResponseEntity<?> status(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason()==null?"Operação não permitida.":e.getReason()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e) {
        return ResponseEntity.badRequest().body(Map.of("message","Verifique os campos informados.","fields",e.getBindingResult().getFieldErrors().stream().map(f -> f.getField()+": "+f.getDefaultMessage()).toList()));
    }
    @ExceptionHandler({DataIntegrityViolationException.class, OptimisticLockingFailureException.class}) ResponseEntity<?> conflict(Exception e) {
        return ResponseEntity.status(409).body(Map.of("message","Registro duplicado, vinculado ou alterado por outro usuário. Atualize a página e confira os dados."));
    }
    @ExceptionHandler({org.springframework.http.converter.HttpMessageNotReadableException.class, org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class})
    ResponseEntity<?> malformed(Exception e) { return ResponseEntity.badRequest().body(Map.of("message","Formato de dados inválido.")); }
}
