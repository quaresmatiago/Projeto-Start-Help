import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import './App.css'

// CONSTANTES DE ESTILO PARA OS MODAIS INDIVIDUAIS
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

const cardSosEstilo = {
  fontSize: '12px',
  color: '#fff',
  opacity: '0.9',
  textAlign: 'center',
  fontWeight: '500'
}

function App() {
  const [tela, setTela] = useState('home')
  const [pacientes, setPacientes] = useState([])
  const [abaAtiva, setAbaAtiva] = useState('remedios')
  const [abaGerenciar, setAbaGerenciar] = useState('pacientes')
  
  const [alarmeAtivo, setAlarmeAtivo] = useState(false)
  const [remedioAlarme, setRemedioAlarme] = useState('')

  const [addModo, setAddModo] = useState(false)
  const [novoRemedioNome, setNovoRemedioNome] = useState('')
  const [novoRemedioDose, setNovoRemedioDose] = useState('')
  const [novoRemedioHora, setNovoRemedioHora] = useState('')

  const [addCuidadorModo, setAddCuidadorModo] = useState(false)
  const [novoCuidadorNome, setNovoCuidadorNome] = useState('')

  const [historicoPressao, setHistoricoPressao] = useState(() => {
    const h = localStorage.getItem('hist_pressao')
    return h ? JSON.parse(h) : []
  })

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
  const [parentesco, setParentesco] = useState('')
  const [remedio, setRemedio] = useState('')
  const [dosagem, setDosagem] = useState('')
  const [horario, setHorario] = useState('')

  useEffect(() => {
    if (tela === 'home' || tela === 'meus_pacientes' || tela === 'diario_saude') {
      carregarDados()
    }
  }, [tela])

  const carregarDados = () => {
    fetch('http://localhost:8080/api/pacientes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPacientes(data)
        } else if (data && typeof data === 'object') {
          setPacientes([data])
        } else {
          setPacientes([])
        }
      })
      .catch(() => setPacientes([]))
  }

  const handleRenovarReceita = (id) => {
    fetch(`http://localhost:8080/api/pacientes/${id}/renovar-receita`, { method: 'PUT' })
      .then(res => {
        if (res.ok) {
          Swal.fire("Pedido Enviado!", "Sua solicitação de renovação já está na mesa do médico da UBS. Evite filas!", "success")
          carregarDados()
        }
      })
  }

  const handleConfirmarDiario = (id) => {
    fetch(`http://localhost:8080/api/pacientes/${id}/confirmar-diario`, { method: 'PUT' })
      .then(res => {
        if (res.ok) {
          Swal.fire("Que ótimo!", "A rede de apoio foi avisada que o paciente está bem hoje.", "success")
          carregarDados()
        }
      })
  }

  const handleTrocarCuidador = () => {
    const opcoesSelect = {}
    listaCuidadores.forEach(cuid => {
      opcoesSelect[cuid] = cuid
    })

    Swal.fire({
      title: 'Troca de Turno',
      text: 'Selecione quem está assumindo o plantão:',
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

  const cadastrarCuidadorDireto = (e) => {
    e.preventDefault()
    const n = novoCuidadorNome.trim()
    if (!n) return
    if (listaCuidadores.includes(n)) {
      Swal.fire("Aviso", "Este profissional já está cadastrado.", "warning")
      return
    }
    const nLista = [...listaCuidadores, n]
    setListaCuidadores(nLista)
    localStorage.setItem('list_cuid', JSON.stringify(nLista))
    setNovoCuidadorNome('')
    setAddCuidadorModo(false)
    Swal.fire("Sucesso!", "Novo enfermeiro/cuidador adicionado.", "success")
  }

  const deletarCuidador = (nomeParaDeletar) => {
    if (nomeParaDeletar === nomeCuidador) {
      return Swal.fire("Ação Bloqueada", "Este profissional está ativo no monitoramento agora.", "warning")
    }
    Swal.fire({
      title: `Remover ${nomeParaDeletar}?`,
      text: "O perfil sairá definitivamente da lista do sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53935',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        const nLista = listaCuidadores.filter(c => c !== nomeParaDeletar)
        setListaCuidadores(nLista)
        localStorage.setItem('list_cuid', JSON.stringify(nLista))
        Swal.fire("Excluído!", "Perfil removido com sucesso.", "success")
      }
    })
  }

  const deletarPaciente = (id) => {
    if (!id) return
    Swal.fire({
      title: 'Remover o cadastro?',
      text: "Todos os dados associados serão perdidos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53935',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/pacientes/${id}`, { method: 'DELETE' })
          .then(() => {
            Swal.fire("Removido!", "Cadastro excluído.", "success")
            carregarDados()
          })
      }
    })
  }

  const cadastrarPacienteGeral = (e) => {
    e.preventDefault()
    const novo = {
      nome: nome.trim(),
      parentesco: parentesco.trim(),
      statusReceita: "Vencendo",
      statusConfirmacaoDiaria: "Pendente",
      medicacoes: remedio ? [{ nome: remedio.trim(), dosagem: dosagem.trim(), horario: horario.trim() }] : []
    }

    fetch('http://localhost:8080/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    }).then(() => {
      setNome(''); setParentesco(''); setRemedio(''); setDosagem(''); setHorario('')
      setTela('home')
      carregarDados()
    })
  }

  const adicionarRemedioAba = (e) => {
    e.preventDefault()
    if (!pacientes || pacientes.length === 0) return
    const id = pacientes[0].id || pacientes[0]._id
    const med = { nome: novoRemedioNome.trim(), dosagem: novoRemedioDose.trim(), horario: novoRemedioHora.trim() }

    fetch(`http://localhost:8080/api/pacientes/${id}/medicacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(med)
    }).then(() => {
      setNovoRemedioNome(''); setNovoRemedioDose(''); setNovoRemedioHora('')
      setAddModo(false)
      carregarDados()
    })
  }

  const removerRemedioAba = (idx) => {
    const id = pacientes[0].id || pacientes[0]._id
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

  const renderNomePacienteHome = () => {
    if (!pacientes || pacientes.length === 0 || !pacientes[0]) return 'Nenhum paciente'
    const p = pacientes[0]
    return p.nome
  }

  return (
    <div className="flex-centro-container">
      <div className="celular">
        
        {alarmeAtivo && (
          <div style={modalAlarmeEstilo}>
            <div style={{ fontSize: '70px' }}>🔔</div>
            <h2>HORA DO REMÉDIO!</h2>
            <p style={{ textAlign: 'center' }}>
              O paciente precisa tomar:<br/>
              <strong style={{ display: 'inline-block', marginTop: '10px', background: '#fff', color: '#E53935', padding: '5px 15px', borderRadius: '10px' }}>{remedioAlarme}</strong>
            </p>
            <button onClick={() => setAlarmeAtivo(false)} style={{ background: '#fff', color: '#E53935', border: 'none', padding: '15px 40px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
              Confirmar Ingestão
            </button>
          </div>
        )}

        {tela === 'home' && (
          <div className="tela-scroll">
            <div className="home-header">
              <div className="logo-texto">❤️ START+HELP</div>
              <button onClick={handleTrocarCuidador} className="seletor-cuidador">👤 Alternar Turno</button>
            </div>

            {pacientes?.[0]?.alertaUBS && (
              <div style={{ background: '#fffae6', border: '2px solid #ffcc00', borderRadius: '15px', padding: '12px', color: '#8a6d3b', fontWeight: 'bold', textAlign: 'left', fontSize: '14px' }}>
                ⚠️ <b>AVISO DO POSTINHO DE SAÚDE:</b><br/>
                <span style={{ fontWeight: '500', display: 'block', marginTop: '4px' }}>{pacientes[0].alertaUBS}</span>
              </div>
            )}

            <div className="saudacao-bloco">
              <p>Monitor local ativo: <b>{nomeCuidador}</b></p>
              <h2>Olá! Acompanhando: <span className="destaque-vermelho" style={{ textTransform: 'capitalize' }}>{renderNomePacienteHome()}</span></h2>
            </div>

            {pacientes?.[0] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pacientes[0].statusReceita === 'Vencendo' ? (
                  <div style={{ background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '15px', padding: '15px', textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', color: '#0d47a1', fontSize: '14px' }}>📄 Receita do Postinho vencendo em 15 dias!</div>
                    <p style={{ fontSize: '12px', color: '#1565c0', margin: '4px 0 10px 0' }}>Deseja solicitar a renovação automática sem pegar fila?</p>
                    <button onClick={() => handleRenovarReceita(pacientes[0].id || pacientes[0]._id)} style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>Solicitar Renovação</button>
                  </div>
                ) : pacientes[0].statusReceita === 'Aguardando Assinatura' ? (
                  <div style={{ background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '15px', padding: '12px', textAlign: 'left', fontSize: '13px', color: '#e65100', fontWeight: 'bold' }}>
                    ⏳ Aguardando assinatura do médico da UBS. Não vá ao posto ainda!
                  </div>
                ) : null}

                {pacientes[0].statusConfirmacaoDiaria === 'Pendente' ? (
                  <button onClick={() => handleConfirmarDiario(pacientes[0].id || pacientes[0]._id)} style={{ background: '#2E7D32', color: '#fff', border: 'none', width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                    🌅 BOM DIA! Clique aqui para avisar que está tudo bem
                  </button>
                ) : (
                  <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '15px', padding: '12px', textAlign: 'center', color: '#1b5e20', fontWeight: 'bold', fontSize: '13px' }}>
                    ✓ Status do dia confirmado. Monitoramento tranquilo!
                  </div>
                )}
              </div>
            )}
            
            {/* GRADE DE RECURSOS CORRIGIDA EM 2X2 COM OS TERMOS CORRETOS */}
            <div className="card-grade">
              <div className="card-figma" onClick={() => { setTela('meus_pacientes'); setAbaGerenciar('pacientes'); setAddCuidadorModo(false); }}>
                <div className="icone-card bg-vermelho-claro">👥</div>
                <div className="texto-card-bold">Pacientes</div>
                <div style={cardTextoEstilo}>Gerenciar pessoas assistidas.</div>
              </div>

              <div className="card-figma" onClick={() => setTela('diario_saude')}>
                <div className="icone-card bg-cinza-claro">💊</div>
                <div className="texto-card-bold">Diário de Saúde</div>
                <div style={cardTextoEstilo}>Remédios e Pressão.</div>
              </div>

              <div className="card-sos-vermelho" onClick={() => setTela('sos')}>
                <div className="icone-card">🚨</div>
                <div className="texto-card-bold">SOS</div>
                <div style={cardSosEstilo}>Emergências rápidas.</div>
              </div>

              <div className="card-figma" onClick={() => Swal.fire("Guia de Saúde", "Orientações e cuidados assistenciais.", "info")}>
                <div className="icone-card bg-verde-claro">📋</div>
                <div className="texto-card-bold">Guia de Saúde</div>
                <div style={cardTextoEstilo}>Orientações e cuidados.</div>
              </div>
            </div>

            <div className="alerta-header">
              <span className="alerta-titulo">🔔 Próximos Remédios Agendados</span>
            </div>
            
            <div className="lista-lembretes">
              {pacientes?.[0]?.medicacoes?.map((m, idx) => (
                <div key={idx} className="card-paciente" onClick={() => { setRemedioAlarme(m.nome); setAlarmeAtivo(true); }} style={{ cursor: 'pointer' }}>
                  <div className="paciente-info-bloco">
                    <div className="avatar-idoso">💊</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{m.nome}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{m.dosagem}</div>
                    </div>
                  </div>
                  <div className="remedio-tag">{m.horario}</div>
                </div>
              ))}
              {(!pacientes?.[0]?.medicacoes || pacientes[0].medicacoes.length === 0) && (
                <div style={{ color: '#94a3b8', padding: '10px', textAlign: 'center' }}>Nenhum remédio agendado.</div>
              )}
            </div>
          </div>
        )}

        {/* DIÁRIO DE SAÚDE */}
        {tela === 'diario_saude' && (
          <div className="tela-scroll">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Diário de Saúde</h2>
              <button className="btn-cinza" onClick={() => { setTela('home'); setAddModo(false); }}>Voltar</button>
            </div>

            <div style={{ display: 'flex', background: '#eee', borderRadius: '10px', padding: '4px' }}>
              <button onClick={() => setAbaAtiva('remedios')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaAtiva === 'remedios' ? '#fff' : 'transparent', fontWeight: 'bold' }}>💊 Remédios</button>
              <button onClick={() => setAbaAtiva('pressao')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaAtiva === 'pressao' ? '#fff' : 'transparent', fontWeight: 'bold' }}>📊 Pressão</button>
            </div>

            {abaAtiva === 'remedios' && (
              <div>
                <div className="lista-lembretes">
                  {pacientes?.[0]?.medicacoes?.map((m, idx) => (
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
                  <button onClick={() => setAddModo(true)} style={{ background: '#E53935', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }}>+ Adicionar Remédio</button>
                ) : (
                  <form onSubmit={adicionarRemedioAba} className="form-cadastro" style={{ background: '#F5F5F5', padding: '15px', borderRadius: '12px', marginTop: '15px' }}>
                    <input type="text" placeholder="Nome do remédio" value={novoRemedioNome} onChange={e => setNovoRemedioNome(e.target.value)} className="caixa-texto" required />
                    <input type="text" placeholder="Dosagem" value={novoRemedioDose} onChange={e => setNovoRemedioDose(e.target.value)} className="caixa-texto" required />
                    <input type="text" placeholder="Horário (Ex: 08:00)" value={novoRemedioHora} onChange={e => setNovoRemedioHora(e.target.value)} className="caixa-texto" required />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-verde" style={{ flex: 1 }}>Salvar</button>
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
                    <input type="number" placeholder="Sis (Ex: 12)" value={pressaoSis} onChange={e => setPressaoSis(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                    <input type="number" placeholder="Dia (Ex: 8)" value={pressaoDia} onChange={e => setPressaoDia(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
                  </div>
                  <button type="submit" style={{ width: '100%', background: '#E53935', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar no Diário</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {historicoPressao.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 15px', borderRadius: '10px', borderLeft: h.sistolica > 13 ? '4px solid #E53935' : '4px solid #2E7D32', border: '1px solid #F5F5F5' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '11px', color: '#999' }}>{h.data} - {h.hora}</span>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{h.sistolica} x {h.diastolica}</div>
                      </div>
                      <button 
                        onClick={() => {
                          const novoHist = historicoPressao.filter((_, i) => i !== idx);
                          setHistoricoPressao(novoHist);
                          localStorage.setItem('hist_pressao', JSON.stringify(novoHist));
                        }} 
                        style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  {historicoPressao.length === 0 && (
                    <div style={{ color: '#94a3b8', padding: '10px', textAlign: 'center', fontSize: '14px' }}>Nenhuma medição registrada.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TELA SOS */}
        {tela === 'sos' && (
          <div className="tela-scroll">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>❤️ START+HELP</b><button className="btn-cinza" onClick={() => setTela('home')}>Voltar</button></div>
            <div className="sos-container">
              <button className="botao-sos-gigante" onClick={() => Swal.fire("🚨 ALERTA SOS EMITIDO!", "Os profissionais de plantão receberam os dados de emergência. O socorro está a caminho!", "error")}>
                <div>SOS</div>
              </button>
            </div>
          </div>
        )}

        {/* CADASTRO */}
        {tela === 'cadastro' && (
          <div className="tela-scroll">
            <h2>Novo Cadastro</h2>
            <form onSubmit={cadastrarPacienteGeral} className="form-cadastro">
              <input type="text" placeholder="Nome do paciente" value={nome} className="caixa-texto" onChange={e => setNome(e.target.value)} required />
              <input type="text" placeholder="Vínculo / Descrição" value={parentesco} className="caixa-texto" onChange={e => setParentesco(e.target.value)} required />
              <input type="text" placeholder="Remédio (Opcional)" value={remedio} className="caixa-texto" onChange={e => setRemedio(e.target.value)} />
              <input type="text" placeholder="Dosagem" value={dosagem} className="caixa-texto" onChange={e => setDosagem(e.target.value)} />
              <input type="text" placeholder="Horário" value={horario} className="caixa-texto" onChange={e => setHorario(e.target.value)} />
              <button type="submit" className="btn-verde">Salvar Cadastro</button>
            </form>
            <button className="btn-cinza" style={{ width: '100%', marginTop: '10px' }} onClick={() => setTela('home')}>Cancelar</button>
          </div>
        )}

        {/* COMPONENTE DE GERENCIAMENTO DE PACIENTES E CUIDADORES */}
        {tela === 'meus_pacientes' && (
          <div className="tela-scroll">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#E53935' }}>Gerenciamento</h2>
              <button className="btn-cinza" onClick={() => setTela('home')}>Voltar</button>
            </div>

            {/* ABAS COM NOMES CORRIGIDOS */}
            <div style={{ display: 'flex', background: '#eee', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
              <button onClick={() => { setAbaGerenciar('pacientes'); setAddCuidadorModo(false); }} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaGerenciar === 'pacientes' ? '#fff' : 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>👥 Pacientes</button>
              <button onClick={() => setAbaGerenciar('cuidadores')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: abaGerenciar === 'cuidadores' ? '#fff' : 'transparent', fontWeight: 'bold' }}>👤 Cuidadores / Enfermeiros</button>
            </div>

            {abaGerenciar === 'pacientes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pacientes.map((p, i) => (
                  <div key={i} className="card-paciente">
                    <div style={{ textAlign: 'left' }}>
                      <b style={{ textTransform: 'capitalize', color: '#E53935' }}>Paciente</b>
                      <div style={{ fontSize: '13px' }}>{p.nome}</div>
                    </div>
                    <button onClick={() => deletarPaciente(p.id || p._id)} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>🗑️</button>
                  </div>
                ))}
                <button onClick={() => setTela('cadastro')} style={{ background: '#2E7D32', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>+ Cadastrar Novo Paciente</button>
              </div>
            )}

            {abaGerenciar === 'cuidadores' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {listaCuidadores.map((c, i) => (
                  <div key={i} className="card-paciente">
                    <div style={{ textAlign: 'left' }}>
                      <b>{c}</b>
                      <div style={{ fontSize: '11px', color: c === nomeCuidador ? '#2E7D32' : '#777' }}>
                        {c === nomeCuidador ? '● Ativo no Monitoramento' : 'Disponível'}
                      </div>
                    </div>
                    {c !== nomeCuidador && (
                      <button onClick={() => deletarCuidador(c)} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>🗑️</button>
                    )}
                  </div>
                ))}

                {!addCuidadorModo ? (
                  <button onClick={() => setAddCuidadorModo(true)} style={{ background: '#1976d2', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>+ Incluir Novo Enfermeiro/Cuidador</button>
                ) : (
                  <form onSubmit={cadastrarCuidadorDireto} style={{ background: '#F5F5F5', padding: '15px', borderRadius: '12px', marginTop: '15px', textAlign: 'left' }}>
                    <input type="text" placeholder="Nome do profissional" value={novoCuidadorNome} onChange={e => setNovoCuidadorNome(e.target.value)} className="caixa-texto" required />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" className="btn-verde" style={{ flex: 1 }}>Salvar</button>
                      <button type="button" onClick={() => setAddCuidadorModo(false)} className="btn-cinza" style={{ flex: 1 }}>Cancelar</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default App