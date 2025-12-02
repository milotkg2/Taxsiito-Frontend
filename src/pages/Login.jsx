import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/pages/Login.css'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.email.trim()) {
      setError('Por favor ingresa tu correo electronico')
      return
    }
    
    if (!validarEmail(formData.email)) {
      setError('Por favor ingresa un correo electronico valido')
      return
    }
    
    if (!formData.password.trim()) {
      setError('Por favor ingresa tu contrasena')
      return
    }

    setLoading(true)

    try {
      // TODO: Conectar con backend
      // Por ahora simulamos un login exitoso
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        // Redirigir según el rol
        if (data.usuario.rol === 'ADMIN' || data.usuario.rol === 'VENDEDOR') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        // Manejar diferentes tipos de errores
        if (response.status === 400) {
          // Error de validación
          const errorMsg = data.error || data.message || 'Datos inválidos. Verifica tu correo y contraseña.'
          setError(errorMsg)
        } else if (response.status === 401) {
          // No autorizado
          setError(data.error || 'Usuario o contraseña incorrectos')
        } else {
          setError(data.error || 'Error al iniciar sesión')
        }
      }
    } catch (err) {
      // Si el backend no está disponible, mostrar error
      setError('Error de conexion. Verifica que el servidor este activo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-main">
      <section className="login-container">
        <div className="login-card">
          {/* Decoracion */}
          <div className="login-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
          </div>

          <div className="login-content">
            <h1 className="login-title">Bienvenido!</h1>
            <p className="login-subtitle">Inicia sesion en tu cuenta</p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Correo electronico</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contrasena</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
              </button>
            </form>

            <Link to="/recuperar-password" className="forgot-password">
              Olvidaste tu contrasena?
            </Link>

            <div className="login-divider">
              <span>o</span>
            </div>

            <p className="register-prompt">
              Todavia no tienes una cuenta?{' '}
              <Link to="/registro" className="register-link">Registrate</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login

