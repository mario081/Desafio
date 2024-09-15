import { useEffect, useState, useRef } from 'react'
import './App.css'
import api from '../../services/api'
import { FaTrash, FaEdit } from 'react-icons/fa'

function App() {

  const [moto, setMoto] = useState([])
  const [editarMoto, setEditarMoto] = useState(null)

  const inputPlaca = useRef(null)
  const inputMarca = useRef(null)
  const inputAno = useRef(null)

  async function CreateMotos() {
    
    const placaValue = inputPlaca.current ? inputPlaca.current.value.trim() : ''
    const marcaValue = inputMarca.current ? inputMarca.current.value.trim() : ''
    const anoValue = inputAno.current ? inputAno.current.value.trim() : ''

    if (!marcaValue || (!editarMoto && !placaValue) || !anoValue) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    if (editarMoto) {
      await api.put(`/motos/${editarMoto}`, {
        placa: editarMoto,
        marca: marcaValue,
        ano: anoValue
      })
      setEditarMoto(null)
    } else {
      await api.post('/motos', {
        placa: placaValue,
        marca: marcaValue,
        ano: anoValue
      })
    }

    getMotos()

    if (inputPlaca.current) inputPlaca.current.value = ''
    if (inputMarca.current) inputMarca.current.value = ''
    if (inputAno.current) inputAno.current.value = ''
  }

  async function getMotos() {
    const motoApi = await api.get('/motos')
    setMoto(motoApi.data)
  }

  async function deleteMotos(placa) {
    await api.delete(`/motos/${placa}`)
    getMotos()
  }

  function editMoto(motos) {
    if (inputPlaca.current) inputPlaca.current.value = motos.placa
    if (inputMarca.current) inputMarca.current.value = motos.marca
    if (inputAno.current) inputAno.current.value = motos.ano
    setEditarMoto(motos.placa)
  }

  useEffect(() => {
    getMotos()
  }, [])

  return (
    <div className='container'>
      <form>
        <h1>{editarMoto ? 'Alterar Moto' : 'Cadastrar Moto'}</h1>
        {!editarMoto && (
          <input name='placa' type='text' placeholder='Placa' ref={inputPlaca} />
        )}
        <input name='marca' type='text' placeholder='Marca' ref={inputMarca} />
        <input name='ano' type='number' placeholder='Ano' ref={inputAno} />

        <button type='button' onClick={CreateMotos}>
          {editarMoto ? 'Alterar Cadastro' : 'Cadastrar'}
        </button>
      </form>

      {moto.map((motos) => (
        <div key={motos.placa} className='card'>
          <div>
            <p>Placa: {motos.placa}</p>
            <p>Marca: {motos.marca}</p>
            <p>Ano: {motos.ano}</p>
          </div>
          <div>
            <div>
              <button onClick={() => editMoto(motos)}>
                <FaEdit />
              </button>
            </div>
            <div>
              <button onClick={() => deleteMotos(motos.placa)}>
                <FaTrash />
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  )
}

export default App
