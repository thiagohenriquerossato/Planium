import { FormEvent, useState } from 'react'
import { api } from './services/api';
import styles from './styles.module.scss'


interface ICadastro{
  nome: string;
  idade: number;
}

interface IBeneficiarioResponse {
  nome: string;
  idade: number;
  valor: number;
}

interface IResponse {
  beneficiarios: IBeneficiarioResponse[]
  valorTotal: number
}

function App() {
  const [nome, setNome] = useState('')
  const [age, setAge] = useState('')
  const [reg, setReg] = useState('')
  const [beneficiarios, setBeneficiarios] = useState<IBeneficiarioResponse[]>()
  const [valorTotal, setValorTotal] = useState<number>()
  const [cadastros, setCadastros] = useState<ICadastro[]>([{nome, idade: Number(age)}])


  const addInput = (e: FormEvent) =>{
    e.preventDefault()
    if(nome==='' || age ==='')
      return
    setCadastros([...cadastros,{nome, idade: Number(age)}])  
    setAge('')
    setNome('')
  }

  const submitHandler = async (e: FormEvent)=>{
    e.preventDefault()
    if(reg==='' || cadastros.length<=1)
      return
    const aux = cadastros.filter(cadastro =>{if(cadastro.nome!=='') return cadastro})

    await api.post<IResponse>('/plans', {registro: reg, beneficiarios: aux}).then(response =>{
      const {data} = response
      setBeneficiarios(data.beneficiarios)
      setValorTotal(data.valorTotal)
    }).catch((err)=>{
      alert(err.response.data.errorMessage)
    })
    setCadastros([{nome, idade: Number(age)}]) 
    setReg('')
    
  }

  return (
    <div className={styles.appContainer}>
      <h1>Planium</h1>
      <div className={styles.contentWrapper}>
        <div className={styles.formContainer}>
          <form onSubmit={submitHandler}> 
            <div className={styles.registro}>
              <label>Registro de plano</label>
              <input type='text'
                name="rex"
                placeholder='Insira o registro do plano'
                value={reg}
                onChange={e=>{setReg(e.target.value)}}
              />
            <button type='submit'>gerar proposta</button>

            </div>
            <div className={styles.container}>
              <div className={styles.inputContainer}>
                <label>Nome:</label>
                <input type='text'
                  className={styles.name}
                  name="nome"
                  placeholder='Insira o nome'
                  value={nome}
                  onChange={e=>{setNome(e.target.value)}}
                />
                <label>Idade:</label>
                <input type='number'
                  className={styles.age}
                  name="idade"
                  placeholder='Insira a idade'
                  value={age}
                  onChange={e=>{setAge(e.target.value)}}
                /> 
                <button onClick={addInput}>+</button> 
              </div>
              <div className={styles.cadastros}>
                { cadastros.length>1 ?
                  cadastros.map((cadastro, index) =>{
                    if(cadastro.nome!=='')
                    return (
                      <div key={index}>
                        <span>{cadastro.nome}</span>
                        <span>{cadastro.idade}</span>
                      </div>
                    )
                  }) : ''
                }
              </div>
            </div>
        </form>
        </div>
        <div className={styles.return}>
          <div className={styles.proposta}>
            <h2>Proposta</h2>
          </div>
          
          <div >
            {
              valorTotal ? <><span>Valor total do plano: <strong>{valorTotal},00</strong></span><br></br><br></br></> :''
            }
            {
              beneficiarios ? beneficiarios.map((beneficiario, index)=>{
                return(
                  <div key={index} className={styles.responseContent}>
                    <span>Nome: <strong>{beneficiario.nome}</strong></span><br></br>
                    <span>Idade: <strong>{beneficiario.idade}</strong></span><br></br>
                    <span>Valor do plano: <strong>{beneficiario.valor},00</strong></span><br></br>
                  </div>
                )
              }): ''
            }
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default App
