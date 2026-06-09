package com.example.starthelp.controller;

import com.example.starthelp.model.Paciente;
import com.example.starthelp.model.Medicacao;
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

    // Rota de Cadastro de Paciente
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
    // ROTAS DE MEDICAÇÕES - DIÁRIO DE SAÚDE
    // =========================================================================

    // ROTA PARA ADICIONAR UM REMÉDIO NA LISTA DO PACIENTE
    @PostMapping("/{id}/medicacoes")
    public ResponseEntity<Paciente> adicionarMedicacao(@PathVariable String id, @RequestBody Medicacao novaMedicacao) {
        return repository.findById(id).map(paciente -> {
            // Adiciona o novo remédio na lista de medicações que já existem no paciente
            paciente.getMedicacoes().add(novaMedicacao);
            Paciente atualizado = repository.save(paciente);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ROTA PARA REMOVER UM REMÉDIO DA LISTA DO PACIENTE PELO ÍNDICE (LIXEIRA)
    @DeleteMapping("/{id}/medicacoes/{index}")
    public ResponseEntity<Paciente> removerMedicacao(@PathVariable String id, @PathVariable int index) {
        return repository.findById(id).map(paciente -> {
            if (index >= 0 && index < paciente.getMedicacoes().size()) {
                paciente.getMedicacoes().remove(index);
                Paciente atualizado = repository.save(paciente);
                return ResponseEntity.ok(atualizado);
            }
            return ResponseEntity.badRequest().<Paciente>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // =========================================================================
    // ENDPOINTS COMPLEMENTARES - MVP DE IMPACTO SOCIAL
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