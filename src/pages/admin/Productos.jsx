import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/pages/admin/Productos.css'

function Productos() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    verificarAutenticacion()
  }, [])

  useEffect(() => {
    if (usuario) {
      cargarProductos()
    }
  }, [usuario])

  useEffect(() => {
    filtrarProductos()
  }, [busqueda, productos])

  const verificarAutenticacion = () => {
    const usuarioStorage = localStorage.getItem('usuario')
    if (!usuarioStorage) {
      navigate('/login')
      return
    }

    try {
      const usuarioData = JSON.parse(usuarioStorage)
      setUsuario(usuarioData)
      
      // Solo ADMIN y VENDEDOR pueden ver productos
      if (usuarioData.rol !== 'ADMIN' && usuarioData.rol !== 'VENDEDOR') {
        navigate('/admin')
        return
      }
    } catch (err) {
      navigate('/login')
    }
  }

  const cargarProductos = async () => {
    setLoading(true)
    setError(null)
    try {
      // Cargar todos los productos (incluye inactivos)
      const response = await fetch('http://localhost:8080/api/productos/todos')
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }
      const data = await response.json()
      setProductos(data)
      setProductosFiltrados(data)
    } catch (err) {
      setError(err.message)
      console.error('Error cargando productos:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtrarProductos = () => {
    if (!busqueda.trim()) {
      setProductosFiltrados(productos)
      return
    }

    const query = busqueda.toLowerCase()
    const filtrados = productos.filter(p => {
      return (
        (p.codigo || '').toLowerCase().includes(query) ||
        (p.nombre || '').toLowerCase().includes(query)
      )
    })
    setProductosFiltrados(filtrados)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar producto')
      }

      // Recargar lista
      cargarProductos()
    } catch (err) {
      alert('Error al eliminar producto: ' + err.message)
      console.error('Error eliminando producto:', err)
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(precio || 0)
  }

  if (!usuario) {
    return null // Redirigiendo...
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
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="header-title">Productos</h1>
            <span className="header-rol">Administración de productos</span>
          </div>
          <div className="header-user">
            <span className="material-icons">account_circle</span>
            <span>{usuario.nombres} {usuario.apellidos}</span>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          <div className="productos-card">
            <div className="productos-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <span className="material-icons">search</span>
                  <input
                    type="search"
                    placeholder="Buscar por código o nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                  />
                </div>
                <span className="productos-count">
                  {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Link to="/admin/productos/nuevo" className="btn-primary">
                <span className="material-icons">add</span>
                Nuevo producto
              </Link>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <span className="material-icons">error_outline</span>
                <p>{error}</p>
                <button onClick={cargarProductos} className="btn-reload">
                  Reintentar
                </button>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="empty-container">
                <span className="material-icons">inventory_2</span>
                <p>No se encontraron productos</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="productos-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Crítico</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((p) => (
                      <tr key={p.id}>
                        <td>{p.codigo || '-'}</td>
                        <td>{p.nombre || '-'}</td>
                        <td>{formatearPrecio(p.precio)}</td>
                        <td>
                          <span className={p.stock <= (p.stockCritico || 0) ? 'stock-bajo' : ''}>
                            {p.stock || 0}
                          </span>
                        </td>
                        <td>
                          <span className="stock-critico-badge">
                            {p.stockCritico || 0}
                          </span>
                        </td>
                        <td>{p.categoriaNombre || '-'}</td>
                        <td>
                          {p.activo ? (
                            <span className="estado-badge activo">Activo</span>
                          ) : (
                            <span className="estado-badge inactivo">Inactivo</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/admin/productos/${p.id}`}
                              className="btn-edit"
                              title="Editar"
                            >
                              <span className="material-icons">edit</span>
                            </Link>
                            <button
                              onClick={() => handleEliminar(p.id)}
                              className="btn-delete"
                              title="Eliminar"
                            >
                              <span className="material-icons">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Productos

