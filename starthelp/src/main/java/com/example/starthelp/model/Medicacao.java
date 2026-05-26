package com.example.starthelp.model;

public class Medicacao {
    private String nome;
    private String dosagem;
    private String horario;

    public Medicacao() {}
    public Medicacao(String nome, String dosagem, String horario) {
        this.nome = nome;
        this.dosagem = dosagem;
        this.horario = horario;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDosagem() { return dosagem; }
    public void setDosagem(String dosagem) { this.dosagem = dosagem; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
}