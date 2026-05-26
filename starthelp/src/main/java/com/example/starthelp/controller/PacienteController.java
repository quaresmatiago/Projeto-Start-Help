package com.example.starthelp.controller;

import com.example.starthelp.model.Paciente;
import com.example.starthelp.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
}