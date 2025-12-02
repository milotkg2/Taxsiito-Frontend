import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerRegiones, obtenerComunasPorRegion } from '../services/ubicacionService'
import '../styles/pages/Registro.css'

function Registro() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    run: '',
    correo: '',
    password: '',
    confirmPassword: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    regionId: '',
    comunaId: '',
    telefono: ''
  })
  const [regiones, setRegiones] = useState([])
  const [comunas, setComunas] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingRegiones, setLoadingRegiones] = useState(true)

  // Cargar regiones al montar el componente
  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        const data = await obtenerRegiones()
        setRegiones(data)
      } catch (err) {
        console.error('Error cargando regiones:', err)
      } finally {
        setLoadingRegiones(false)
      }
    }
    cargarRegiones()
  }, [])

  // Actualizar comunas cuando cambia la region
  useEffect(() => {
    const cargarComunas = async () => {
      if (formData.regionId) {
        try {
          const data = await obtenerComunasPorRegion(formData.regionId)
          setComunas(data)
          setFormData(prev => ({ ...prev, comunaId: '' }))
        } catch (err) {
          console.error('Error cargando comunas:', err)
          setComunas([])
        }
      } else {
        setComunas([])
      }
    }
    cargarComunas()
  }, [formData.regionId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validarRun = (run) => {
    const runLimpio = run.replace(/[.-]/g, '').toUpperCase()
    if (runLimpio.length < 8 || runLimpio.length > 9) return false
    return /^[0-9]+[0-9K]$/.test(runLimpio)
  }

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.run.trim()) {
      setError('Por favor ingresa tu RUN')
      return
    }

    if (!validarRun(formData.run)) {
      setError('El RUN ingresado no es valido')
      return
    }
    
    if (!formData.correo.trim()) {
      setError('Por favor ingresa tu correo electronico')
      return
    }
    
    if (!validarEmail(formData.correo)) {
      setError('Por favor ingresa un correo electronico valido')
      return
    }
    
    if (!formData.password.trim()) {
      setError('Por favor ingresa una contrasena')
      return
    }

    if (formData.password.length < 4 || formData.password.length > 10) {
      setError('La contrasena debe tener entre 4 y 10 caracteres')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    if (!formData.nombres.trim()) {
      setError('Por favor ingresa tus nombres')
      return
    }

    if (!formData.apellidos.trim()) {
      setError('Por favor ingresa tus apellidos')
      return
    }

    if (!formData.direccion.trim()) {
      setError('Por favor ingresa tu direccion')
      return
    }

    if (!formData.regionId) {
      setError('Por favor selecciona tu region')
      return
    }

    if (!formData.comunaId) {
      setError('Por favor selecciona tu comuna')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          run: formData.run.replace(/[.-]/g, ''),
          correo: formData.correo,
          password: formData.password,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          direccion: formData.direccion,
          regionId: parseInt(formData.regionId),
          comunaId: parseInt(formData.comunaId),
          telefono: formData.telefono
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar usuario en localStorage para iniciar sesión automáticamente
        if (data.usuario) {
          localStorage.setItem('usuario', JSON.stringify(data.usuario))
          // Redirigir según el rol
          if (data.usuario.rol === 'ADMIN' || data.usuario.rol === 'VENDEDOR') {
            navigate('/admin')
          } else {
            navigate('/')
          }
          // Forzar recarga para actualizar el header
          window.location.reload()
        } else {
          // Si no viene el usuario en la respuesta, redirigir al login
          navigate('/login', { state: { registered: true } })
        }
      } else {
        setError(data.error || 'Error al crear la cuenta')
      }
    } catch (err) {
      setError('Error de conexion. Verifica que el servidor este activo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="registro-main">
      <section className="registro-container">
        <div className="registro-card">
          {/* Decoracion */}
          <div className="registro-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>

          <div className="registro-content">
            <h1 className="registro-title">Crea tu cuenta!</h1>
            <p className="registro-subtitle">Completa tus datos para registrarte</p>

            <form className="registro-form" onSubmit={handleSubmit} noValidate>
              {/* RUN y Correo */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">RUN</label>
                  <input
                    type="text"
                    name="run"
                    className="form-input"
                    placeholder="12345678K"
                    value={formData.run}
                    onChange={handleChange}
                    maxLength={10}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo electronico</label>
                  <input
                    type="email"
                    name="correo"
                    className="form-input"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Contrasenas */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contrasena</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="4-10 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar contrasena</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Repetir contrasena"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Nombres y Apellidos */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    className="form-input"
                    placeholder="Tus nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    maxLength={50}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    className="form-input"
                    placeholder="Tus apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Direccion */}
              <div className="form-group full-width">
                <label className="form-label">Direccion</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  placeholder="Tu direccion completa"
                  value={formData.direccion}
                  onChange={handleChange}
                  maxLength={300}
                />
              </div>

              {/* Region y Comuna */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Region</label>
                  <select
                    name="regionId"
                    className="form-input form-select"
                    value={formData.regionId}
                    onChange={handleChange}
                    disabled={loadingRegiones}
                  >
                    <option value="">
                      {loadingRegiones ? 'Cargando...' : 'Selecciona region'}
                    </option>
                    {regiones.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Comuna</label>
                  <select
                    name="comunaId"
                    className="form-input form-select"
                    value={formData.comunaId}
                    onChange={handleChange}
                    disabled={!formData.regionId || comunas.length === 0}
                  >
                    <option value="">Selecciona comuna</option>
                    {comunas.map((comuna) => (
                      <option key={comuna.id} value={comuna.id}>
                        {comuna.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Telefono */}
              <div className="form-group full-width">
                <label className="form-label">Telefono (opcional)</label>
                <input
                  type="tel"
                  name="telefono"
                  className="form-input"
                  placeholder="+56 9 1234 5678"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <button 
                type="submit" 
                className="registro-button"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="login-prompt">
              Ya tienes una cuenta?{' '}
              <Link to="/login" className="login-link">Inicia sesion</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Registro
