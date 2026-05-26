package com.example.starthelp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "pacientes")
public class Paciente {
    @Id
    private String id;
    private String nome;
    private String parentesco;
    private List<Medicacao> medicacoes = new ArrayList<>();

    public Paciente() {}
    public Paciente(String nome, String parentesco) {
        this.nome = nome;
        this.parentesco = parentesco;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }
    public List<Medicacao> getMedicacoes() { return medicacoes; }
    public void setMedicacoes(List<Medicacao> medicacoes) { this.medicacoes = medicacoes; }
}