import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/Mantenimiento.css'

function Mantenimiento() {
  const navigate = useNavigate()

  useEffect(() => {
    // Opcional: redirigir automáticamente después de 5 segundos
    // const timer = setTimeout(() => {
    //   navigate('/')
    // }, 5000)
    // return () => clearTimeout(timer)
  }, [navigate])

  return (
    <main className="mantenimiento-main">
      <div className="mantenimiento-container">
        <div className="mantenimiento-content">
          <div className="mantenimiento-icon">
            <span className="material-icons">construction</span>
          </div>
          
          <h1 className="mantenimiento-title">Página en Construcción</h1>
          
          <p className="mantenimiento-message">
            Estamos trabajando para mejorar esta sección.
            <br />
            Pronto estará disponible.
          </p>

          <div className="mantenimiento-animation">
            <div className="construction-bar bar-1"></div>
            <div className="construction-bar bar-2"></div>
            <div className="construction-bar bar-3"></div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="btn-home"
          >
            <span className="material-icons">home</span>
            Volver al inicio
          </button>
        </div>
      </div>
    </main>
  )
}

export default Mantenimiento

