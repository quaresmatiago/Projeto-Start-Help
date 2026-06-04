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

    // --- NOVOS CAMPOS PARA O MVP DE IMPACTO SOCIAL ---
    // Controla a Tela 1 (Fila da Receita): "Vencendo", "Aguardando Assinatura" ou "Renovada"
    private String statusReceita; 
    
    // Controla a Tela 2 (Botão Estou Bem): "Pendente" ou "Confirmado"
    private String statusConfirmacaoDiaria; 
    
    // Controla a Tela 3 (Aviso do Postinho): Mensagem da UBS (ex: "Médico Ausente") ou null se estiver normal
    private String alertaUBS; 
    
    // Lista de contatos da vizinhança/comunidade para emergências
    private List<ContatoComunitario> contatosComunitarios = new ArrayList<>();
    // -------------------------------------------------

    public Paciente() {}
    
    public Paciente(String nome, String parentesco) {
        this.nome = nome;
        this.parentesco = parentesco;
    }

    // Getters e Setters Originais
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }
    public List<Medicacao> getMedicacoes() { return medicacoes; }
    public void setMedicacoes(List<Medicacao> medicacoes) { this.medicacoes = medicacoes; }

    // --- GETTERS E SETTERS DOS NOVOS CAMPOS ---
    public String getStatusReceita() { return statusReceita; }
    public void setStatusReceita(String statusReceita) { this.statusReceita = statusReceita; }

    public String getStatusConfirmacaoDiaria() { return statusConfirmacaoDiaria; }
    public void setStatusConfirmacaoDiaria(String statusConfirmacaoDiaria) { this.statusConfirmacaoDiaria = statusConfirmacaoDiaria; }

    public String getAlertaUBS() { return alertaUBS; }
    public void setAlertaUBS(String alertaUBS) { this.alertaUBS = alertaUBS; }

    public List<ContatoComunitario> getContatosComunitarios() { return contatosComunitarios; }
    public void setContatosComunitarios(List<ContatoComunitario> contatosComunitarios) { this.contatosComunitarios = contatosComunitarios; }
}