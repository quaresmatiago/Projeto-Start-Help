package com.example.starthelp.controller;

import com.example.starthelp.model.Paciente;
import com.example.starthelp.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:5173") // Libera o React para acessar o Java
public class PacienteController {

    @Autowired
    private PacienteRepository repository;

    // Rota para Listar os pacientes (Limpa para evitar duplicações na Home)
    @GetMapping
    public List<Paciente> listar() {
        return repository.findAll();
    }

    // Rota de Cadastro corrigida para aceitar o método POST
    @PostMapping
    public Paciente cadastrar(@RequestBody Paciente paciente) {
        return repository.save(paciente);
    }

    // Rota para deletar um paciente usando o ID
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable String id) {
        repository.deleteById(id);
    }

    // =========================================================================
    // NOVOS ENDPOINTS - MVP DE IMPACTO SOCIAL (APRESENTAÇÃO DIA 09)
    // =========================================================================

    // TELA 1: Mudar o status da receita para "Aguardando Assinatura" ao clicar em renovar
    @PutMapping("/{id}/renovar-receita")
    public ResponseEntity<Paciente> renovarReceita(@PathVariable String id) {
        return repository.findById(id).map(paciente -> {
            paciente.setStatusReceita("Aguardando Assinatura");
            Paciente atualizado = repository.save(paciente);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // TELA 2: Confirmar o status diário ("Confirmado") quando o idoso clica em "Estou Bem"
    @PutMapping("/{id}/confirmar-diario")
    public ResponseEntity<Paciente> confirmarDiario(@PathVariable String id) {
        return repository.findById(id).map(paciente -> {
            paciente.setStatusConfirmacaoDiaria("Confirmado");
            Paciente atualizado = repository.save(paciente);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // TELA 3: Simular um aviso vindo da UBS (Ex: Médico Ausente) para piscar o alerta no React
    @PutMapping("/{id}/alerta-ubs")
    public ResponseEntity<Paciente> emitirAlertaUBS(@PathVariable String id, @RequestParam String mensagem) {
        return repository.findById(id).map(paciente -> {
            paciente.setAlertaUBS(mensagem);
            Paciente atualizado = repository.save(paciente);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }
}