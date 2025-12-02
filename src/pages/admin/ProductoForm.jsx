import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { obtenerCategorias } from '../../services/categoriaService'
import '../../styles/pages/admin/ProductoForm.css'

function ProductoForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [usuario, setUsuario] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockCritico: '5',
    categoriaId: '',
    imagen: '',
    activo: true
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    verificarAutenticacion()
    cargarCategorias()
  }, [])

  useEffect(() => {
    if (id && usuario) {
      cargarProducto()
    } else if (usuario) {
      setLoading(false)
    }
  }, [id, usuario])

  const verificarAutenticacion = () => {
    const usuarioStorage = localStorage.getItem('usuario')
    if (!usuarioStorage) {
      navigate('/login')
      return
    }

    try {
      const usuarioData = JSON.parse(usuarioStorage)
      setUsuario(usuarioData)
      
      // Solo ADMIN y VENDEDOR pueden gestionar productos
      if (usuarioData.rol !== 'ADMIN' && usuarioData.rol !== 'VENDEDOR') {
        navigate('/admin')
        return
      }
    } catch (err) {
      navigate('/login')
    }
  }

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias()
      setCategorias(data)
    } catch (err) {
      console.error('Error cargando categorias:', err)
    }
  }

  const cargarProducto = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/productos/${id}`)
      if (!response.ok) {
        throw new Error('Producto no encontrado')
      }
      const data = await response.json()
      
      setFormData({
        codigo: data.codigo || '',
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        precio: data.precio ? data.precio.toString() : '',
        stock: data.stock ? data.stock.toString() : '',
        stockCritico: data.stockCritico ? data.stockCritico.toString() : '',
        categoriaId: data.categoriaId || '',
        imagen: data.imagen || '',
        activo: data.activo !== undefined ? data.activo : true
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const newErrors = {}

    // Código
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido'
    } else if (formData.codigo.length < 3) {
      newErrors.codigo = 'El código debe tener al menos 3 caracteres'
    } else if (formData.codigo.length > 20) {
      newErrors.codigo = 'El código no puede superar 20 caracteres'
    }

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede superar 100 caracteres'
    }

    // Descripción
    if (formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede superar 500 caracteres'
    }

    // Precio
    const precio = parseFloat(formData.precio)
    if (isNaN(precio) || precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    // Stock
    const stock = parseInt(formData.stock)
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      newErrors.stock = 'El stock debe ser un entero ≥ 0'
    }

    // Stock crítico
    const stockCritico = parseInt(formData.stockCritico)
    if (isNaN(stockCritico) || stockCritico < 0 || !Number.isInteger(stockCritico)) {
      newErrors.stockCritico = 'El stock crítico debe ser un entero ≥ 0'
    }

    // Categoría
    if (!formData.categoriaId) {
      newErrors.categoriaId = 'Selecciona una categoría'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        stockCritico: parseInt(formData.stockCritico),
        categoriaId: parseInt(formData.categoriaId),
        imagen: formData.imagen.trim() || null,
        activo: formData.activo
      }

      const url = id 
        ? `http://localhost:8080/api/productos/${id}`
        : 'http://localhost:8080/api/productos'
      
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
        throw new Error(data.error || 'Error al guardar producto')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/productos')
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
              <Link to="/admin/productos" className="nav-item active">
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
            {usuario.rol === 'ADMIN' && (
              <li>
                <Link to="/admin/usuarios" className="nav-item">
                  <span className="material-icons">people</span>
                  <span>Usuarios</span>
                </Link>
              </li>
            )}
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
            <h1 className="header-title">{id ? 'Editar producto' : 'Nuevo producto'}</h1>
            <span className="header-rol">Administración de productos</span>
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
                <span>Producto guardado correctamente</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="producto-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigo">Código</label>
                  <input
                    id="codigo"
                    name="codigo"
                    type="text"
                    maxLength={20}
                    placeholder="P-0001"
                    value={formData.codigo}
                    onChange={handleChange}
                    className={errors.codigo ? 'error' : ''}
                    disabled={!!id}
                  />
                  {errors.codigo && <span className="field-error">{errors.codigo}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    maxLength={100}
                    placeholder="Nombre del producto"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={errors.nombre ? 'error' : ''}
                  />
                  {errors.nombre && <span className="field-error">{errors.nombre}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  maxLength={500}
                  placeholder="Descripción breve (máx. 500 caracteres)"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={errors.descripcion ? 'error' : ''}
                  rows={4}
                />
                {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="precio">Precio (CLP)</label>
                  <input
                    id="precio"
                    name="precio"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={formData.precio}
                    onChange={handleChange}
                    className={errors.precio ? 'error' : ''}
                  />
                  {errors.precio && <span className="field-error">{errors.precio}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className={errors.stock ? 'error' : ''}
                  />
                  {errors.stock && <span className="field-error">{errors.stock}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="stockCritico">Stock crítico</label>
                  <input
                    id="stockCritico"
                    name="stockCritico"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={formData.stockCritico}
                    onChange={handleChange}
                    className={errors.stockCritico ? 'error' : ''}
                  />
                  {errors.stockCritico && <span className="field-error">{errors.stockCritico}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categoriaId">Categoría</label>
                  <select
                    id="categoriaId"
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleChange}
                    className={errors.categoriaId ? 'error' : ''}
                  >
                    <option value="">Selecciona...</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.categoriaId && <span className="field-error">{errors.categoriaId}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="activo" className="checkbox-label">
                    <input
                      id="activo"
                      name="activo"
                      type="checkbox"
                      checked={formData.activo}
                      onChange={handleChange}
                    />
                    <span>Producto activo</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imagen">URL de imagen (opcional)</label>
                <input
                  id="imagen"
                  name="imagen"
                  type="text"
                  placeholder="img/mi-producto.png o https://..."
                  value={formData.imagen}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <Link to="/admin/productos" className="btn-cancel">
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

export default ProductoForm

