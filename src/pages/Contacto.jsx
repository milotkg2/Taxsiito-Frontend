import { useState } from 'react'
import { Link } from 'react-router-dom'
import appStore from '../assets/img/app.png'
import googlePlay from '../assets/img/play.png'
import '../styles/pages/Contacto.css'

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.nombre.trim()) {
      setError('Por favor ingresa tu nombre')
      return
    }
    
    if (!formData.email.trim()) {
      setError('Por favor ingresa tu correo electronico')
      return
    }
    
    if (!validarEmail(formData.email)) {
      setError('Por favor ingresa un correo electronico valido')
      return
    }
    
    if (!formData.mensaje.trim()) {
      setError('Por favor escribe un mensaje')
      return
    }

    // Simular envio
    setEnviado(true)
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
    
    setTimeout(() => setEnviado(false), 5000)
  }

  return (
    <main className="contacto-main">
      <section className="contacto-hero">
        <div className="contacto-content">
          <h1 className="contacto-title">Sigamos en contacto!</h1>
          <p className="contacto-subtitle">
            Quieres simplificar la gestion tributaria de tu pyme? Dejanos tus datos 
            y te contaremos. 
            <h1>Como nuestra app puede ayudarte a ahorrar tiempo.</h1>
          </p>

          <form className="contacto-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Correo electronico"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="telefono"
                className="form-input"
                placeholder="Telefono (opcional)"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <textarea
                name="mensaje"
                className="form-input form-textarea"
                placeholder="Escribe tu mensaje (max. 500 caracteres)"
                value={formData.mensaje}
                onChange={handleChange}
                maxLength={500}
                rows={4}
              />
            </div>

            {error && <div className="form-error">{error}</div>}
            {enviado && <div className="form-success">Mensaje enviado correctamente!</div>}

            <button type="submit" className="form-button">
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>

      {/* Download Section */}
      <section className="download-section">
        <div className="download-container">
          <div className="download-content">
            <h2 className="download-title">
              Descarga la app
              <span className="download-highlight"> GRATIS</span>
            </h2>
            <p className="download-subtitle">Disponible para iOS y Android</p>
            <div className="download-buttons">
              <Link to="/mantenimiento" className="store-button">
                <div className="store-text">
                <img src={appStore} alt="Download on the App Store" className="app-img" />
                </div>
              </Link>
              <Link to="/mantenimiento" className="store-button">
                <div className="store-text">
                <img src={googlePlay} alt="Get it on Google Play" className="app-img" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contacto

