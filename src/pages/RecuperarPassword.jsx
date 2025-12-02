import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages/RecuperarPassword.css'

function RecuperarPassword() {
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const ALLOWED_DOMAINS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']
  const MAX_EMAIL = 100

  const isAllowedEmail = (v) => {
    const at = v.lastIndexOf('@')
    if (at < 0) return false
    const domain = v.slice(at + 1).toLowerCase()
    return ALLOWED_DOMAINS.includes(domain)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }))
    }
    setSuccess(false)
  }

  const validate = () => {
    const newErrors = {}

    // Validar correo
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido'
    } else if (formData.email.length > MAX_EMAIL) {
      newErrors.email = `El correo no puede superar ${MAX_EMAIL} caracteres`
    } else if (!isAllowedEmail(formData.email)) {
      newErrors.email = 'Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com'
    }

    // Validar confirmación de correo
    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = 'La confirmación de correo es requerida'
    } else if (formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Los correos no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    setErrors({})

    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      // TODO: Conectar con backend cuando esté implementado
      // Por ahora simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setFormData({ email: '', confirmEmail: '' })
    } catch (err) {
      setErrors({ general: 'Error al procesar la solicitud. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="recuperar-main">
      <div className="recuperar-container">
        <div className="recuperar-card">
          <h1 className="recuperar-title">¡Recupera tu contraseña!</h1>
          <p className="recuperar-subtitle">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña
          </p>

          {success && (
            <div className="message-box success">
              <span className="material-icons">check_circle</span>
              <div>
                <strong>Solicitud válida</strong>
                <p>Revisa tu correo electrónico para continuar con la recuperación de contraseña.</p>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="message-box error">
              <span className="material-icons">error_outline</span>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="recuperar-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <span className="material-icons input-icon">email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmEmail">Confirmar correo electrónico</label>
              <div className="input-wrapper">
                <span className="material-icons input-icon">email</span>
                <input
                  id="confirmEmail"
                  name="confirmEmail"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className={errors.confirmEmail ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {errors.confirmEmail && <span className="field-error">{errors.confirmEmail}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-icons spin">refresh</span>
                  Enviando...
                </>
              ) : (
                <>
                  <span className="material-icons">send</span>
                  Recuperar contraseña
                </>
              )}
            </button>

            <div className="form-footer">
              <p>
                ¿Recordaste tu contraseña?{' '}
                <Link to="/login" className="link">
                  Iniciar sesión
                </Link>
              </p>
              <p>
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="link">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default RecuperarPassword

