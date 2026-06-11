import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import './App.css'


const modalAlarmeEstilo = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  background: '#E53935',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  padding: '20px'
}

const cardTextoEstilo = {
  fontSize: '12px',
  color: '#666',
  textAlign: 'center',
  fontWeight: '500'
}

function App() {
 const [tela, setTela] = useState('home')
  const [paciente, setPaciente] = useState(null) 
  const [abaAtiva, setAbaAtiva] = useState('remedios')
  const [abaPaciente, setAbaPaciente] = useState('visualizar_perfil')
  
  const [alarmeAtivo, setAlarmeAtivo] = useState(false)
  const [remedioAlarme, setRemedioAlarme] = useState('')

  const [addModo, setAddModo] = useState(false)
  const [novoRemedioNome, setNovoRemedioNome] = useState('')
  const [novoRemedioDose, setNovoRemedioDose] = useState('')
  const [novoRemedioHora, setNovoRemedioHora] = useState('')

  const [addCuidadorModo, setAddCuidadorModo] = useState(false)
  const [novoCuidadorNome, setNovoCuidadorNome] = useState('')

  // Estados corrigidos e separados
  const [historicoPressao, setHistoricoPressao] = useState(() => {
    const h = localStorage.getItem('hist_pressao')
    return h ? JSON.parse(h) : []
  })

  const [enfermeiros, setEnfermeiros] = useState([]);
  const [novoEnfNome, setNovoEnfNome] = useState('');
  const [novoEnfTel, setNovoEnfTel] = useState('');

  const [pressaoSis, setPressaoSis] = useState('')
  const [pressaoDia, setPressaoDia] = useState('')

  const [listaCuidadores, setListaCuidadores] = useState(() => {
    const s = localStorage.getItem('list_cuid')
    return s ? JSON.parse(s) : ['Tiago (Filho)', 'Enfermeiro (Dia)', 'Enfermeiro (Noite)']
  })

  const [nomeCuidador, setNomeCuidador] = useState(() => {
    return localStorage.getItem('c_ativ') || 'Tiago (Filho)'
  })

  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [parentesco, setParentesco] = useState('')
  const [remedio, setRemedio] = useState('')
  const [dosagem, setDosagem] = useState('')
  const [horario, setHorario] = useState('')
  const [peso, setPeso] = useState('')
  const [tipoSanguineo, setTipoSanguineo] = useState('')
  const [temHipertensao, setTemHipertensao] = useState(false)
  const [doencasCronicas, setDoencasCronicas] = useState('')
  const [alergias, setAlergias] = useState('')
  const [relatorioPlantao, setRelatorioPlantao] = useState('')

  // Estado local para a caixa de texto do livro de plantão
  const [novaOcorrencia, setNovaOcorrencia] = useState('')

  const articlesGuia = [
    {
      id: 1,
      titulo: "Prevenção de Quedas",
      categoria: "Idosos",
      descricao: "Remova tapetes soltos, melhore a iluminação dos corredores e instale barras de apoio no banheiro.",
      icone: "🦽"
    },
    {
      id: 2,
      titulo: "Manobra de Heimlich",
      categoria: "Primeiros Socorros",
      descricao: "Em caso de engasgo: posicione-se por trás, envolva a cintura com os braços e pressione o abdômen para cima.",
      icone: "𫁦"
    },
    {
      id: 3,
      titulo: "Sinais de Desidratação",
      categoria: "Cuidados Diários",
      descricao: "Monitore sempre: boca seca, apatia, choro sem lágrimas e urina em tonalidade muito escura.",
      icone: "💧"
    }
  ]

  useEffect(() => {
    carregarDados()
  }, [tela])

  const carregarDados = () => {
    fetch('http://localhost:8080/api/pacientes')
      .then(res => {
        if (res.status === 204) {
          setPaciente(null)
          return null
        }
        return res.json()
      })
      .then(data => {
        const dadosPaciente = Array.isArray(data) ? data[0] : data;
        
        if (dadosPaciente) {
          setPaciente(dadosPaciente)
          setNome(dadosPaciente.nome || '')
          
          if (dadosPaciente.idade) {
            setIdade(String(dadosPaciente.idade).replace(/[^0-9]/g, ''))
          } else {
            setIdade('')
          }

          setParentesco(dadosPaciente.vinculo || dadosPaciente.parentesco || '')
          
          if (dadosPaciente.peso) {
            setPeso(String(dadosPaciente.peso).replace(/[^0-9.]/g, ''))
          } else {
            setPeso('')
          }

          setTipoSanguineo(dadosPaciente.tipoSanguineo || '')
          setTemHipertensao(dadosPaciente.temHipertensao || false)
          setDoencasCronicas(dadosPaciente.doencasCronicas || '')
          setAlergias(dadosPaciente.alergias || '')
          setRelatorioPlantao(dadosPaciente.relatorioPlantao || '')
        } else {
          setPaciente(null)
        }
      })
      .catch(() => setPaciente(null))
  }

  const handleTrocarCuidador = () => {
    const opcoesSelect = {}
    listaCuidadores.forEach(cuid => { opcoesSelect[cuid] = cuid })

    Swal.fire({
      title: 'Troca de Turno',
      text: 'Selecione o profissional que está assumindo o plantão:',
      input: 'select',
      inputOptions: opcoesSelect,
      inputPlaceholder: 'Selecione...',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#2E7D32',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        setNomeCuidador(res.value)
        localStorage.setItem('c_ativ', res.value)
      }
    })
  }

  const resetarAplicativo = (id) => {
    if (!id) return
    Swal.fire({
      title: 'Remover registro?',
      text: "Todos os dados salvos deste paciente serão apagados permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53935',
      confirmButtonText: 'Sim, excluir'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/pacientes/${id}`, { method: 'DELETE' })
          .then(() => {
            setPaciente(null)
            setNome(''); setIdade(''); setParentesco(''); setPeso(''); setTipoSanguineo(''); setTemHipertensao(false); setDoencasCronicas(''); setAlergias(''); setRelatorioPlantao('')
            setTela('home')
            Swal.fire("Excluído", "O prontuário foi removido do sistema.", "success")
          })
      }
    })
  }

  const cadastrarPacienteGeral = (e) => {
    e.preventDefault()

    let idForm = idade.trim()
    if (idForm && !isNaN(idForm)) {
      idForm = `${idForm} anos`
    }

    let pesoForm = peso.trim()
    if (pesoForm && !isNaN(pesoForm.replace(',', '.'))) {
      pesoForm = `${pesoForm} kg`
    }

    const novo = {
      id: paciente?.id || paciente?._id || null,
      nome: nome.trim(),
      vinculo: parentesco.trim(),
      idade: idForm,
      peso: pesoForm,
      tipoSanguineo: tipoSanguineo,
      temHipertensao: temHipertensao === true || temHipertensao === 'true',
      doencasCronicas: doencasCronicas.trim(),
      alergias: alergias.trim(),
      relatorioPlantao: relatorioPlantao.trim(),
      statusReceita: paciente?.statusReceita || "Vencendo",
      statusConfirmacaoDiaria: paciente?.statusConfirmacaoDiaria || "Pendente",
      medicacoes: paciente?.medicacoes ? paciente.medicacoes : (remedio ? [{ nome: remedio.trim(), dosagem: dosagem.trim(), horario: horario.trim() }] : [])
    }

    fetch('http://localhost:8080/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro na resposta')
      return res.json()
    })
    .then((dadosSalvos) => {
      setPaciente(dadosSalvos) 
      setRemedio(''); setDosagem(''); setHorario('')
      setAbaPaciente('visualizar_perfil') 
      setTela('visualizar_historico')
      Swal.fire("Pronto!", "Os dados foram atualizados com sucesso.", "success")
    })
    .catch(() => {
      Swal.fire("Erro", "Não foi possível processar a requisição no servidor.", "error")
    })
  }

  
  const salvarNotaPlantao = (e) => {
    e.preventDefault()
    if (!novaOcorrencia.trim() || !paciente) return

    const id = paciente.id || paciente._id
    
    
    const relatorioAtualizado = relatorioPlantao 
      ? `${relatorioPlantao}\n• ${novaOcorrencia.trim()}` 
      : `• ${novaOcorrencia.trim()}`

    const payload = {
      ...paciente,
      relatorioPlantao: relatorioAtualizado
    }

    fetch('http://localhost:8080/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error()
      return res.json()
    })
    .then((dadosSalvos) => {
      setPaciente(dadosSalvos)
      setRelatorioPlantao(dadosSalvos.relatorioPlantao || '')
      setNovaOcorrencia('') // Limpa o textarea após salvar
      Swal.fire("Registrado!", "A ocorrência foi adicionada ao livro de plantão.", "success")
    })
    .catch(() => {
      Swal.fire("Erro", "Não foi possível salvar o relato.", "error")
    })
  }

  const adicionarRemedioAba = (e) => {
    e.preventDefault()
    if (!paciente) return

    const id = paciente.id || paciente._id
    const med = { 
      nome: novoRemedioNome.trim(), 
      dosagem: novoRemedioDose.trim(), 
      horario: novoRemedioHora.trim() 
    }

    fetch(`http://localhost:8080/api/pacientes/${id}/medicacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(med)
    }).then(res => {
      if (res.ok) {
        setNovoRemedioNome(''); setNovoRemedioDose(''); setNovoRemedioHora('');
        setAddModo(false);
        carregarDados();
        Swal.fire("Sucesso", "Medicamento adicionado à grade horária.", "success");
      }
    });
  }

  const removerRemedioAba = (idx) => {
    if (!paciente) return
    const id = paciente.id || paciente._id
    fetch(`http://localhost:8080/api/pacientes/${id}/medicacoes/${idx}`, { method: 'DELETE' })
      .then(() => carregarDados())
  }

  const cadastrarPressao = (e) => {
    e.preventDefault()
    const reg = {
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sistolica: pressaoSis,
      diastolica: pressaoDia
    }
    const h = [reg, ...historicoPressao]
    setHistoricoPressao(h)
    localStorage.setItem('hist_pressao', JSON.stringify(h))
    setPressaoSis(''); setPressaoDia('')
  }

  return (
    <div className="flex-centro-container">
      <div className="celular">
        
        {alarmeAtivo && (
          <div style={modalAlarmeEstilo}>
            <div style={{ fontSize: '70px' }}>🔔</div>
            <h2>Alerta de medicação</h2>
            <p style={{ textAlign: 'center' }}>
              Horário do medicamento:<br/>
              <strong style={{ display: 'inline-block', marginTop: '10px', background: '#fff', color: '#E53935', padding: '5px 15px', borderRadius: '10px' }}>{remedioAlarme}</strong>
            </p>
            <button onClick={() => setAlarmeAtivo(false)} style={{ background: '#fff', color: '#E53935', border: 'none', padding: '15px 40px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
              Confirmar
            </button>
          </div>
        )}

        {tela === 'home' && (
          <div className="tela-scroll">
            <div className="home-header">
              <div className="logo-texto">❤️ START+HELP</div>
              <div className="header-botoes-grupo">
                <button onClick={handleTrocarCuidador} className="seletor-cuidador">👤 Turno</button>
              </div>
            </div>

            <div 
              className="saudacao-bloco" 
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => {
                if (paciente) {
                  setAbaPaciente('visualizar_perfil'); 
                  setTela('visualizar_historico');
                } else {
                  setTela('tela_paciente_unificado'); 
                }
              }}
            >
              <p>Monitor local ativo: <b>{nomeCuidador}</b></p>
              <h2 style={{ fontSize: '22px', margin: '5px 0' }}>
                Paciente: <span className="destaque-vermelho" style={{ textTransform: 'capitalize' }}>{paciente?.nome ? paciente.nome : 'Não cadastrado (Clique para iniciar)'}</span>
              </h2>
              {paciente && (
                <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
                  <span><b>Idade:</b> {paciente.idade ? (String(paciente.idade).includes('anos') ? paciente.idade : `${paciente.idade} anos`) : 'Não informada'}</span>
                  <span style={{ margin: '0 8px' }}>|</span>
                  <span><b>Vínculo:</b> {paciente.vinculo || 'Nenhum'}</span>
                </div>
              )}
            </div>
            
           <div className="card-grade" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '15px' }}>
  
  
  <div className="card-figma" onClick={() => { setAbaPaciente('visualizar_perfil'); setTela('visualizar_historico'); }}>
    <div className="icone-card bg-vermelho-claro">👥</div>
    <div className="texto-card-bold">Prontuário Médico</div>
  </div>

  
  <div className="card-figma" onClick={() => setTela('diario_saude')}>
    <div className="icone-card bg-cinza-claro">💊</div>
    <div className="texto-card-bold">Diário de Saúde</div>
  </div>

  
  <div className="card-figma" onClick={() => setTela('guia_saude')}>
    <div className="icone-card bg-verde-claro">📋</div>
    <div className="texto-card-bold">Guia de Saúde</div>
  </div>

  
  <div className="card-figma" onClick={() => setTela('cadastro_profissional')}>
    <div className="icone-card bg-azul-claro">👨‍⚕️</div>
    <div className="texto-card-bold">Profissionais</div>
  </div>

</div>

             

        
        {tela === 'cadastro_profissional' && (
          <div className="tela-scroll" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: '#2E7D32' }}>👨‍⚕️ Cadastrar Profissional</h2>
              <button className="btn-cinza" onClick={() => setTela('home')}>Voltar</button>
            </div>
            
            <input 
              placeholder="Nome do profissional" 
              value={novoEnfNome} 
              onChange={e => setNovoEnfNome(e.target.value)} 
              className="caixa-texto" 
              style={{ marginBottom: '10px', display: 'block', width: '100%' }} 
            />
            <input 
              placeholder="Telefone" 
              value={novoEnfTel} 
              onChange={e => setNovoEnfTel(e.target.value)} 
              className="caixa-texto" 
              style={{ marginBottom: '10px', display: 'block', width: '100%' }} 
            />
            <button 
              className="btn-verde" 
              onClick={() => { 
                setEnfermeiros([...enfermeiros, { nome: novoEnfNome, tel: novoEnfTel }]); 
                setTela('home'); 
              }}
              style={{ width: '100%', padding: '12px' }}
            >
              Salvar Profissional
            </button>

            <div style={{ marginTop: '20px' }}>
              <h3>Profissionais Cadastrados:</h3>
              {enfermeiros.map((enf, index) => (
                <div key={index} style={{ background: '#f0f0f0', padding: '10px', borderRadius: '8px', marginBottom: '5px' }}>
                  <b>{enf.nome}</b> - Tel: {enf.tel}
                </div>
              ))}
            </div>
          </div>
        )}

            <div className="alerta-header" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '15px' }}>
              <span className="alerta-titulo">🔔 Próximas Medicações Agendadas</span>
            </div>
            
            <div className="grid-lembretes-ajuste" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: '10px' }}>
              {paciente?.medicacoes?.map((m, idx) => (
                <div key={idx} className="card-paciente" onClick={() => { setRemedioAlarme(m.nome); setAlarmeAtivo(true); }} style={{ cursor: 'pointer' }}>
                  <div className="paciente-info-bloco">
                    <div className="avatar-idoso">💊</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{m.nome}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Dosagem: {m.dosagem}</div>
                    </div>
                  </div>
                  <div className="remedio-tag">{`Horário: ${m.horario}`}</div>
                </div>
              ))}
              {(!paciente?.medicacoes || paciente.medicacoes.length === 0) && (
                <div style={{ color: '#94a3b8', padding: '10px', textAlign: 'center' }}>Nenhum registro encontrado.</div>
              )}
            </div>
          </div>
        )}

        {tela === 'visualizar_historico' && (
          <div className="tela-scroll" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#E53935' }}>🧬 Prontuário Médico</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                
                {paciente && abaPaciente === 'visualizar_perfil' && (
                  <button 
                    className="btn-verde" 
                    style={{ padding: '8px 16px', background: '#2E7D32', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }} 
                    onClick={() => setTela('tela_paciente_unificado')} 
                  >
                    📝 Editar
                  </button>
                )}
                <button className="btn-cinza" onClick={() => setTela('home')}>Voltar</button>
              </div>
            </div>

            {paciente ? (
              <>
                <div style={{ display: 'flex', background: '#eee', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
                  <button onClick={() => setAbaPaciente('visualizar_perfil')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaPaciente === 'visualizar_perfil' ? '#fff' : 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>📝 Perfil</button>
                  <button onClick={() => setAbaPaciente('relatorio_plantao')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaPaciente === 'relatorio_plantao' ? '#fff' : 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>📋 Livro de Plantão</button>
                </div>

                {abaPaciente === 'relatorio_plantao' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    
                    <form onSubmit={salvarNotaPlantao} style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#1e293b' }}>📝 Registrar Nova Ocorrência</h3>
                      <textarea 
                        className="caixa-texto" 
                        rows="3" 
                        placeholder="Digite aqui o que aconteceu no turno (ex: Dormiu bem, tomou os remédios da tarde, etc.)..."
                        value={novaOcorrencia}
                        onChange={(e) => setNovaOcorrencia(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        required
                      />
                      <button type="submit" className="btn-verde" style={{ marginTop: '10px', width: '100%', padding: '10px', fontSize: '13px' }}>
                        Adicionar ao Livro
                      </button>
                    </form>

                    
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Livro de Ocorrências do Turno</h3>
                      <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#0369a1', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {relatorioPlantao || 'Sem registros no relatório de observações recentes.'}
                      </div>
                    </div>

                  </div>
                ) : (
                  <>
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Identificação</h3>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}><b>Nome do Paciente:</b> {paciente.nome}</p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}><b>Idade:</b> {paciente.idade || 'Não informada'}</p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}><b>Vínculo ou Grau de Dependência:</b> {paciente.vinculo || 'Não informado'}</p>
                    </div>

                    <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Informações de Saúde</h3>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}><b>Peso Corporal:</b> {paciente.peso || 'Não informado'}</p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}><b>Tipo Sanguíneo:</b> {paciente.tipoSanguineo || 'Não informado'}</p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}><b>Histórico de Hipertensão:</b> {paciente.temHipertensao ? '⚠️ Sim (Diagnosticado)' : 'Não possui restrições'}</p>
                      
                      <p style={{ margin: '12px 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>Possui alguma doença ou condição de saúde?</p>
                      <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '13px', color: '#334155', borderLeft: '3px solid #cbd5e1' }}>
                        {paciente.doencasCronicas || 'Nenhuma registrada.'}
                      </div>

                      <p style={{ margin: '12px 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>Restrições / Alergias:</p>
                      <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '6px', fontSize: '13px', color: '#991b1b', borderLeft: '3px solid #f87171', fontWeight: '500' }}>
                        {paciente.alergias || 'Nenhuma restrição alimentar ou medicamentosa cadastrada.'}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '15px', border: '1px dashed #ccc', marginTop: '20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>📋</div>
                <h3 style={{ color: '#64748b', fontWeight: '600', margin: '0 0 20px 0', fontSize: '16px' }}>
                  Ainda não há dados clínicos para mostrar
                </h3>
                <button 
                  onClick={() => setTela('tela_paciente_unificado')}
                  style={{ background: '#2E7D32', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  📝 Cadastrar Novo Paciente
                </button>
              </div>
            )}
          </div>
        )}

        {tela === 'tela_paciente_unificado' && (
          <div className="tela-scroll">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#E53935' }}>Ficha Cadastral</h2>
              <button className="btn-cinza" onClick={() => { setAbaPaciente('visualizar_perfil'); setTela(paciente ? 'visualizar_historico' : 'home'); }}>Voltar</button>
            </div>

            <div style={{ textAlign: 'left' }}>
              <form onSubmit={cadastrarPacienteGeral} className="form-cadastro">
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Nome:</label>
                <input type="text" placeholder="Nome do paciente" value={nome} className="caixa-texto" onChange={e => setNome(e.target.value)} required />
                
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Idade:</label>
                <input type="text" placeholder="Ex: 60" value={idade} className="caixa-texto" onChange={e => setIdade(e.target.value)} />
                
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Vínculo ou Grau de Dependência:</label>
                <input type="text" placeholder="Ex: Idoso dependente, acamado, etc." value={parentesco} className="caixa-texto" onChange={e => setParentesco(e.target.value)} required />
                
                <div style={{ marginTop: '20px', marginBottom: '10px', fontWeight: 'bold', color: '#334155', fontSize: '14px' }}>
                  🩺 Informações de Saúde
                </div>

                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Peso Corporal:</label>
                <input type="text" placeholder="Ex: 81" value={peso} className="caixa-texto" onChange={e => setPeso(e.target.value)} />

                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Tipo Sanguíneo:</label>
                <select value={tipoSanguineo} className="caixa-texto" onChange={e => setTipoSanguineo(e.target.value)} style={{ backgroundColor: '#fff' }}>
                  <option value="">Selecione...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Histórico de Hipertensão:</label>
                <select value={temHipertensao} className="caixa-texto" onChange={e => setTemHipertensao(e.target.value === 'true')} style={{ backgroundColor: '#fff' }}>
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
                </select>

                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Possui alguma doença ou condição de saúde?</label>
                <input type="text" placeholder="Ex: Diabetes, labirintite, nenhuma, etc." value={doencasCronicas} className="caixa-texto" onChange={e => setDoencasCronicas(e.target.value)} />
                
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Restrições / Alergias:</label>
                <input type="text" placeholder="Medicamentos, alimentos, etc." value={alergias} className="caixa-texto" onChange={e => setAlergias(e.target.value)} />

                <button type="submit" className="btn-verde" style={{ marginTop: '15px', width: '100%' }}>
                  Salvar Registro
                </button>
              </form>

              {paciente && (
                <button onClick={() => resetarAplicativo(paciente.id || paciente._id)} style={{ background: '#fef2f2', color: '#E53935', border: '1px solid #fca5a5', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}>
                  🗑️ Excluir Prontuário do Sistema
                </button>
              )}
            </div>
          </div>
        )}

        {tela === 'diario_saude' && (
          <div className="tela-scroll">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Diário de Saúde</h2>
              <button className="btn-cinza" onClick={() => { setTela('home'); setAddModo(false); }}>Voltar</button>
            </div>

            <div style={{ display: 'flex', background: '#eee', borderRadius: '10px', padding: '4px', marginBottom: '15px' }}>
              <button onClick={() => setAbaAtiva('remedios')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaAtiva === 'remedios' ? '#fff' : 'transparent', fontWeight: 'bold' }}>💊 Remédios</button>
              <button onClick={() => setAbaAtiva('pressao')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaAtiva === 'pressao' ? '#fff' : 'transparent', fontWeight: 'bold' }}>📊 Pressão</button>
            </div>

            {abaAtiva === 'remedios' && (
              <div>
                <div className="lista-lembretes">
                  {paciente?.medicacoes?.map((m, idx) => (
                    <div key={idx} className="card-paciente" style={{ borderLeft: '5px solid #E53935' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold' }}>{m.nome}</div>
                        <div style={{ fontSize: '12px', color: '#777' }}>{m.dosagem} - <span style={{ color: '#E53935', fontWeight: 'bold' }}>{m.horario}</span></div>
                      </div>
                      <button onClick={() => removerRemedioAba(idx)} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  ))}
                </div>

                {!addModo ? (
                  <button onClick={() => setAddModo(true)} style={{ background: '#E53935', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }}>+ Novo Medicamento</button>
                ) : (
                  <form onSubmit={adicionarRemedioAba} className="form-cadastro" style={{ background: '#F5F5F5', padding: '15px', borderRadius: '12px', marginTop: '15px' }}>
                    <input type="text" placeholder="Nome do medicamento" value={novoRemedioNome} onChange={e => setNovoRemedioNome(e.target.value)} className="caixa-texto" required />
                    <input type="text" placeholder="Dosagem" value={novoRemedioDose} onChange={e => setNovoRemedioDose(e.target.value)} className="caixa-texto" required />
                    <input type="text" placeholder="Frequência / Horário" value={novoRemedioHora} onChange={e => setNovoRemedioHora(e.target.value)} className="caixa-texto" required />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-verde" style={{ flex: 1 }}>Adicionar</button>
                      <button type="button" onClick={() => setAddModo(false)} className="btn-cinza" style={{ flex: 1 }}>Cancelar</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {abaAtiva === 'pressao' && (
              <div>
                <form onSubmit={cadastrarPressao} style={{ background: '#F5F5F5', padding: '15px', borderRadius: '15px', marginBottom: '20px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="number" placeholder="Sistólica (Ex: 12)" value={pressaoSis} onChange={e => setPressaoSis(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                    <input type="number" placeholder="Diastólica (Ex: 8)" value={pressaoDia} onChange={e => setPressaoDia(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                  </div>
                  <button type="submit" style={{ width: '100%', background: '#E53935', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Registrar Medição</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {historicoPressao.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 15px', borderRadius: '10px', borderLeft: h.sistolica > 13 ? '4px solid #E53935' : '4px solid #2E7D32', border: '1px solid #F5F5F5' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '11px', color: '#999' }}>{h.data} - {h.hora}</span>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{h.sistolica} x {h.diastolica}</div>
                      </div>
                      <button onClick={() => {
                        const novoHist = historicoPressao.filter((_, i) => i !== idx);
                        setHistoricoPressao(novoHist);
                        localStorage.setItem('hist_pressao', JSON.stringify(novoHist)); 
                      }} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tela === 'guia_saude' && (
          <div className="tela-scroll" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#2E7D32', fontWeight: 'bold' }}>📋 Guia de Saúde</h2>
              <button className="btn-cinza" onClick={() => setTela('home')}>Voltar</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {articlesGuia.map((artigo) => (
                <div key={artigo.id} className="card-paciente" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '18px', gap: '8px' }} onClick={() => Swal.fire(artigo.titulo, article.descricao, "info")}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2E7D32' }}>{artigo.categoria}</span>
                    <span style={{ fontSize: '26px' }}>{artigo.icone}</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{artigo.titulo}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>{artigo.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App;