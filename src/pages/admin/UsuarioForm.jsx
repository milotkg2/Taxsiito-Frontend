import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { obtenerRegiones, obtenerComunasPorRegion } from '../../services/ubicacionService'
import '../../styles/pages/admin/UsuarioForm.css'

function UsuarioForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [usuario, setUsuario] = useState(null)
  const [regiones, setRegiones] = useState([])
  const [comunas, setComunas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    run: '',
    correo: '',
    nombres: '',
    apellidos: '',
    rol: '',
    direccion: '',
    regionId: '',
    comunaId: '',
    telefono: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    verificarAutenticacion()
    cargarRegiones()
  }, [])

  useEffect(() => {
    if (id && usuario) {
      cargarUsuario()
    } else if (usuario) {
      setLoading(false)
    }
  }, [id, usuario])

  useEffect(() => {
    if (formData.regionId) {
      cargarComunas(formData.regionId)
    } else {
      setComunas([])
    }
  }, [formData.regionId])

  const verificarAutenticacion = () => {
    const usuarioStorage = localStorage.getItem('usuario')
    if (!usuarioStorage) {
      navigate('/login')
      return
    }

    try {
      const usuarioData = JSON.parse(usuarioStorage)
      setUsuario(usuarioData)
      
      // Solo ADMIN puede gestionar usuarios
      if (usuarioData.rol !== 'ADMIN') {
        navigate('/admin')
        return
      }
    } catch (err) {
      navigate('/login')
    }
  }

  const cargarRegiones = async () => {
    try {
      const data = await obtenerRegiones()
      setRegiones(data)
    } catch (err) {
      console.error('Error cargando regiones:', err)
    }
  }

  const cargarComunas = async (regionId) => {
    try {
      const data = await obtenerComunasPorRegion(regionId)
      setComunas(data)
    } catch (err) {
      console.error('Error cargando comunas:', err)
      setComunas([])
    }
  }

  const cargarUsuario = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}`)
      if (!response.ok) {
        throw new Error('Usuario no encontrado')
      }
      const data = await response.json()
      
      setFormData({
        run: data.run || '',
        correo: data.correo || '',
        nombres: data.nombres || '',
        apellidos: data.apellidos || '',
        rol: data.rol || '',
        direccion: data.direccion || '',
        regionId: data.regionId || '',
        comunaId: data.comunaId || '',
        telefono: data.telefono || ''
      })

      // Cargar comunas si hay región
      if (data.regionId) {
        await cargarComunas(data.regionId)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Validación RUN (módulo 11)
  const cleanRut = (v) => (v || '').toUpperCase().replace(/[.\-]/g, '').trim()

  const isValidRut = (r) => {
    r = cleanRut(r)
    if (!/^\d{7,8}[0-9K]$/.test(r)) return false
    const body = r.slice(0, -1)
    const dv = r.slice(-1)
    let sum = 0
    let mul = 2
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * mul
      mul = mul === 7 ? 2 : mul + 1
    }
    const res = 11 - (sum % 11)
    const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res)
    return dvCalc === dv
  }

  // Validación de correo
  const ALLOWED_DOMAINS = ['duocuc.cl', 'duoc.cl','profesor.duoc.cl', 'gmail.com', 'hotmail.com']
  const isAllowedEmail = (v) => {
    const at = v.lastIndexOf('@')
    if (at < 0) return false
    const domain = v.slice(at + 1).toLowerCase()
    return ALLOWED_DOMAINS.includes(domain)
  }

  const validate = () => {
    const newErrors = {}

    // RUN
    if (!formData.run.trim()) {
      newErrors.run = 'El RUN es requerido'
    } else {
      const r = cleanRut(formData.run)
      if (!/^\d{7,8}[0-9K]$/.test(r)) {
        newErrors.run = 'RUN inválido: sin puntos/guion, 8-9 caracteres totales'
      } else if (!isValidRut(r)) {
        newErrors.run = 'RUN inválido: dígito verificador no coincide'
      }
    }

    // Nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos'
    } else if (formData.nombres.length > 50) {
      newErrors.nombres = 'Nombres no puede superar 50 caracteres'
    }

    // Apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos'
    } else if (formData.apellidos.length > 50) {
      newErrors.apellidos = 'Apellidos no puede superar 50 caracteres'
    }

    // Correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido'
    } else if (formData.correo.length > 100) {
      newErrors.correo = 'Correo no puede superar 100 caracteres'
    } else if (!isAllowedEmail(formData.correo)) {
      newErrors.correo = 'Solo se permite @duoc.cl, @duocuc.cl, @profesor.duoc.cl, @hotmail.com o @gmail.com'
    }

    // Rol
    if (!['ADMIN', 'VENDEDOR', 'CLIENTE'].includes(formData.rol)) {
      newErrors.rol = 'Selecciona un tipo de usuario válido'
    }

    // Dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida'
    } else if (formData.direccion.length > 200) {
      newErrors.direccion = 'La dirección no puede superar 200 caracteres'
    }

    // Región
    if (!formData.regionId) {
      newErrors.regionId = 'Selecciona una región'
    }

    // Comuna
    if (!formData.comunaId) {
      newErrors.comunaId = 'Selecciona una comuna'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validate()) {
      return
    }

    setSaving(true)
    try {
      const payload = {
        run: cleanRut(formData.run),
        correo: formData.correo.trim(),
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        rol: formData.rol,
        direccion: formData.direccion.trim(),
        regionId: parseInt(formData.regionId),
        comunaId: parseInt(formData.comunaId),
        telefono: formData.telefono.trim() || null,
        password: formData.password || '1234' // Password por defecto si es nuevo
      }

      const url = id 
        ? `http://localhost:8080/api/usuarios/${id}`
        : 'http://localhost:8080/api/usuarios'
      
      const method = id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar usuario')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/usuarios')
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!usuario) {
    return null // Redirigiendo...
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/admin/productos" className="nav-item">
                <span className="material-icons">inventory_2</span>
                <span>Productos</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/ordenes" className="nav-item">
                <span className="material-icons">receipt_long</span>
                <span>Ordenes</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/usuarios" className="nav-item active">
                <span className="material-icons">people</span>
                <span>Usuarios</span>
              </Link>
            </li>
            <li>
              <Link to="/admin" className="nav-item">
                <span className="material-icons">dashboard</span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-divider"></li>
            <li>
              <button onClick={() => { localStorage.removeItem('usuario'); navigate('/login') }} className="nav-item nav-logout">
                <span className="material-icons">logout</span>
                <span>Salir</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="header-title">{id ? 'Editar usuario' : 'Nuevo usuario'}</h1>
            <span className="header-rol">Administración de usuarios</span>
          </div>
          <div className="header-user">
            <span className="material-icons">account_circle</span>
            <span>{usuario.nombres} {usuario.apellidos}</span>
          </div>
        </header>

        <main className="admin-content">
          <div className="form-card">
            {error && (
              <div className="message-box error">
                <span className="material-icons">error_outline</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="message-box success">
                <span className="material-icons">check_circle</span>
                <span>Usuario guardado correctamente</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="usuario-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="run">RUN (sin puntos ni guion, con DV)</label>
                  <input
                    id="run"
                    name="run"
                    type="text"
                    maxLength={10}
                    placeholder="19011022K"
                    value={formData.run}
                    onChange={handleChange}
                    className={errors.run ? 'error' : ''}
                  />
                  {errors.run && <span className="field-error">{errors.run}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="correo">Correo (dominios permitidos)</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    maxLength={100}
                    placeholder="usuario@duoc.cl"
                    value={formData.correo}
                    onChange={handleChange}
                    className={errors.correo ? 'error' : ''}
                  />
                  {errors.correo && <span className="field-error">{errors.correo}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombres">Nombres</label>
                  <input
                    id="nombres"
                    name="nombres"
                    type="text"
                    maxLength={50}
                    value={formData.nombres}
                    onChange={handleChange}
                    className={errors.nombres ? 'error' : ''}
                  />
                  {errors.nombres && <span className="field-error">{errors.nombres}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    maxLength={50}
                    value={formData.apellidos}
                    onChange={handleChange}
                    className={errors.apellidos ? 'error' : ''}
                  />
                  {errors.apellidos && <span className="field-error">{errors.apellidos}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rol">Tipo de usuario</label>
                  <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className={errors.rol ? 'error' : ''}
                  >
                    <option value="">Selecciona...</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="CLIENTE">CLIENTE</option>
                  </select>
                  {errors.rol && <span className="field-error">{errors.rol}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono (opcional)</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    maxLength={20}
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  maxLength={200}
                  value={formData.direccion}
                  onChange={handleChange}
                  className={errors.direccion ? 'error' : ''}
                />
                {errors.direccion && <span className="field-error">{errors.direccion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="regionId">Región</label>
                  <select
                    id="regionId"
                    name="regionId"
                    value={formData.regionId}
                    onChange={handleChange}
                    className={errors.regionId ? 'error' : ''}
                  >
                    <option value="">Selecciona...</option>
                    {regiones.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.regionId && <span className="field-error">{errors.regionId}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="comunaId">Comuna</label>
                  <select
                    id="comunaId"
                    name="comunaId"
                    value={formData.comunaId}
                    onChange={handleChange}
                    disabled={!formData.regionId}
                    className={errors.comunaId ? 'error' : ''}
                  >
                    <option value="">Selecciona...</option>
                    {comunas.map(comuna => (
                      <option key={comuna.id} value={comuna.id}>
                        {comuna.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.comunaId && <span className="field-error">{errors.comunaId}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <Link to="/admin/usuarios" className="btn-cancel">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default UsuarioForm

