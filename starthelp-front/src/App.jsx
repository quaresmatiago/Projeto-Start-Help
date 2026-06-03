import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import './App.css'

function App() {
  const [tela, setTela] = useState('splash')
  const [pacientes, setPacientes] = useState([])
  
  const [listaCuidadores, setListaCuidadores] = useState(() => {
    const s = localStorage.getItem('list_cuid')
    return s ? JSON.parse(s) : [
      'Tiago (Filho)', 
      'Enfermeiro (Dia)', 
      'Enfermeiro (Noite)'
    ]
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
    if (tela === 'splash') {
      const t = setTimeout(() => {
        setTela('home')
        carregarDados()
      }, 2200)
      return () => clearTimeout(t)
    }
    if (tela === 'home' || tela === 'meus_pacientes') {
      carregarDados()
    }
  }, [tela])

  const carregarDados = () => {
    fetch('/api/pacientes')
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

  const m_plantao = (v) => {
    if (v === 'NOVO') {
      const n = prompt("Nome do enfermeiro:")
      if (n && n.trim() !== "") {
        const limpo = n.trim()
        const nova = [...listaCuidadores, limpo]
        setListaCuidadores(nova)
        setNomeCuidador(limpo)
        localStorage.setItem('list_cuid', JSON.stringify(nova))
        localStorage.setItem('c_ativ', limpo)
      }
    } else {
      setNomeCuidador(v)
      localStorage.setItem('c_ativ', v)
    }
  }

  const deletarPaciente = (id) => {
    if (!id) return Swal.fire("Erro", "ID inválido.", "error")
    
    Swal.fire({
      title: 'Deseja remover?',
      text: "Essa ação não poderá ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/pacientes/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            carregarDados()
            Swal.fire('Removido!', 'O paciente foi removido com sucesso.', 'success')
          }
        })
      }
    })
  }

  const cadastrarPaciente = (e) => {
    e.preventDefault()
    const novo = {
      nome,
      parentesco,
      medicacoes: [{ nome: remedio, dosagem, horario }]
    }

    fetch('/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    })
    .then(res => {
      if (res.ok || res.status === 201) {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Cadastro realizado com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        setNome(''); setParentesco('')
        setRemedio(''); setDosagem('')
        setHorario('')
        carregarDados()
        setTela('home')
      }
    })
    .catch(err => Swal.fire("Erro", err.message, "error"))
  }

  return (
    <div className="flex-centro-container">
      <div className="celular">
        
        {tela === 'splash' && (
          <div className="tela-splash">
            <h1>START ❤️ HELP</h1>
          </div>
        )}

        {tela === 'home' && (
          <div className="tela-scroll">
            <div className="home-header">
              <div className="logo-texto">❤️ START+HELP</div>
              <select className="seletor-cuidador" value={nomeCuidador} onChange={e => m_plantao(e.target.value)}>
                {listaCuidadores.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
                <option value="NOVO">➕ Outro...</option>
              </select>
            </div>

            <div className="saudacao-bloco">
              <h2>Olá, <span className="destaque-vermelho">{nomeCuidador}!</span></h2>
              <p>Como podemos te ajudar?</p>
            </div>
            
            <div className="card-grade">
              <div className="card-figma" onClick={() => setTela('meus_pacientes')}>
                <div className="icone-card bg-vermelho-claro">👥</div>
                <div className="texto-card-bold">Pacientes</div>
                <span className="seta">➔</span>
              </div>

              <div className="card-desativado">
                <div className="icone-card bg-cinza-claro">💊</div>
                <div className="texto-card-bold">Medicação</div>
                <span className="seta">➔</span>
              </div>

              <div className="card-sos-vermelho" onClick={() => setTela('sos')}>
                <div className="tamanho-sirene">🚨</div>
                <div className="texto-card-bold">SOS</div>
              </div>

              <div className="card-figma" onClick={() => setTela('cadastro')}>
                <div className="icone-card bg-verde-claro">➕</div>
                <div className="texto-card-bold">Conteúdo</div>
                <span className="seta">➔</span>
              </div>
            </div>

            <div className="alerta-header">
              <span>🔔</span>
              <span className="alerta-titulo">Lembretes de hoje</span>
            </div>
            
            <div className="lista-lembretes">
              {pacientes.map((p, i) => 
                p?.medicacoes?.map((m, j) => (
                  <div key={`${i}-${j}`} className="card-paciente">
                    <div className="paciente-info-bloco">
                      <div className="avatar-idoso">👴🏽</div>
                      <div>
                        <div className="nome-idoso-titulo">
                          {p.parentesco} <span className="nome-sub-decorado">({p.nome})</span>
                        </div>
                        <div className="medicamento-sub-decorado">
                          {m.nome} - {m.dosagem}
                        </div>
                      </div>
                    </div>
                    <div className="remedio-tag">{m.horario}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tela === 'sos' && (
          <div className="tela-scroll">
            <div className="flex-espalhado">
              <b className="destaque-vermelho">❤️ START+HELP</b>
              <button className="btn-cinza" onClick={() => setTela('home')}>Voltar</button>
            </div>
            <h2 className="destaque-vermelho margem-cima-20">Ajuda imediata.</h2>
            <div className="sos-container">
              <button className="botao-sos-gigante" onClick={() => Swal.fire("SOS", "SOS enviado via Java!", "info")}>
                <div>SOS</div>
                <span className="info-toque-sos">TOQUE PARA ACIONAR</span>
              </button>
            </div>
          </div>
        )}

        {tela === 'cadastro' && (
          <div className="tela-scroll">
            <h2 className="cor-seta-verde">Novo Paciente</h2>
            <p className="subtitulo-cadastro">Adicione as informações do idoso</p>
            <form onSubmit={cadastrarPaciente} className="form-cadastro">
              <input type="text" placeholder="Nome do idoso" value={nome} className="caixa-texto" onChange={e => setNome(e.target.value)} required />
              <input type="text" placeholder="Parentesco" value={parentesco} className="caixa-texto" onChange={e => setParentesco(e.target.value)} required />
              <input type="text" placeholder="Remédio" value={remedio} className="caixa-texto" onChange={e => setRemedio(e.target.value)} required />
              <input type="text" placeholder="Dosagem" value={dosagem} className="caixa-texto" onChange={e => setDosagem(e.target.value)} required />
              <input type="text" placeholder="Horário" value={horario} className="caixa-texto" onChange={e => setHorario(e.target.value)} required />
              <button type="submit" className="btn-verde margem-top-10">Salvar Cadastro</button>
            </form>
            <button className="btn-cinza margem-top-10" onClick={() => setTela('home')}>Cancelar</button>
          </div>
        )}

        {tela === 'meus_pacientes' && (
          <div className="tela-scroll">
            <div className="gerenciar-header">
              <h2 className="destaque-vermelho">Gerenciar</h2>
              <button className="btn-cinza" onClick={() => setTela('home')}>Voltar</button>
            </div>
            <div className="lista-lembretes">
              {pacientes.length === 0 ? (
                <p className="alinhado-centro-cinza">Nenhum paciente cadastrado.</p>
              ) : (
                pacientes.map((p, i) => (
                  <div key={i} className="card-paciente">
                    <div>
                      <b className="cor-cinza-escuro">{p.parentesco}</b>
                      <div className="sub-texto-gerenciar">{p.nome}</div>
                    </div>
                    <button className="btn-lixeira-transparente" onClick={() => deletarPaciente(p.id || p._id)}>🗑️</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App