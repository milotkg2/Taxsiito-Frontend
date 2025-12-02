import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/pages/admin/Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [stats, setStats] = useState({
    productos: 0,
    usuarios: 0,
    ordenes: 0
  })
  const [loading, setLoading] = useState(true)

  // Verificar autenticacion y cargar datos
  useEffect(() => {
    verificarAutenticacion()
  }, [])

  // Cargar estadisticas cuando el usuario esté disponible
  useEffect(() => {
    if (usuario) {
      cargarEstadisticas()
    }
  }, [usuario])

  const verificarAutenticacion = () => {
    const usuarioStorage = localStorage.getItem('usuario')
    if (!usuarioStorage) {
      navigate('/login')
      return
    }

    try {
      const usuarioData = JSON.parse(usuarioStorage)
      setUsuario(usuarioData)
      
      // Verificar que tenga rol de admin o vendedor
      if (usuarioData.rol !== 'ADMIN' && usuarioData.rol !== 'VENDEDOR') {
        navigate('/')
        return
      }
    } catch (err) {
      navigate('/login')
    }
  }

  const cargarEstadisticas = async () => {
    setLoading(true)
    try {
      // Cargar estadisticas en paralelo
      const [productosRes, ordenesRes] = await Promise.all([
        fetch('http://localhost:8080/api/productos'),
        fetch('http://localhost:8080/api/ordenes')
      ])

      const productos = productosRes.ok ? await productosRes.json() : []
      const ordenes = ordenesRes.ok ? await ordenesRes.json() : []

      // Solo cargar usuarios si es ADMIN
      let usuarios = []
      if (usuario?.rol === 'ADMIN') {
        try {
          const usuariosRes = await fetch('http://localhost:8080/api/usuarios')
          usuarios = usuariosRes.ok ? await usuariosRes.json() : []
        } catch (err) {
          console.error('Error cargando usuarios:', err)
        }
      }

      setStats({
        productos: productos.length || 0,
        usuarios: usuarios.length || 0,
        ordenes: ordenes.length || 0
      })
    } catch (err) {
      console.error('Error cargando estadisticas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const puedeVerUsuarios = usuario?.rol === 'ADMIN'

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
            {puedeVerUsuarios && (
              <li>
                <Link to="/admin/usuarios" className="nav-item">
                  <span className="material-icons">people</span>
                  <span>Usuarios</span>
                </Link>
              </li>
            )}
            <li className="nav-divider"></li>
            <li>
              <button onClick={handleLogout} className="nav-item nav-logout">
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
            <h1 className="header-title">Panel de Administracion</h1>
            <span className="header-rol">
              {usuario.rol === 'ADMIN' ? 'Administrador' : 'Vendedor'}
            </span>
          </div>
          <div className="header-user">
            <span className="material-icons">account_circle</span>
            <span>{usuario.nombres} {usuario.apellidos}</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="admin-content">
          <div className="dashboard-card">
            <h2 className="dashboard-title">Resumen</h2>
            
            {loading ? (
              <div className="loading-stats">
                <div className="loading-spinner"></div>
                <p>Cargando estadisticas...</p>
              </div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon productos">
                    <span className="material-icons">inventory_2</span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">Productos</h3>
                    <p className="stat-value">{stats.productos}</p>
                    <Link to="/admin/productos" className="stat-link">
                      Ver productos →
                    </Link>
                  </div>
                </div>

                {puedeVerUsuarios && (
                  <div className="stat-card">
                    <div className="stat-icon usuarios">
                      <span className="material-icons">people</span>
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-label">Usuarios</h3>
                      <p className="stat-value">{stats.usuarios}</p>
                      <Link to="/admin/usuarios" className="stat-link">
                        Ver usuarios →
                      </Link>
                    </div>
                  </div>
                )}

                <div className="stat-card">
                  <div className="stat-icon ordenes">
                    <span className="material-icons">receipt_long</span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">Ordenes</h3>
                    <p className="stat-value">{stats.ordenes}</p>
                    <Link to="/admin/ordenes" className="stat-link">
                      Ver ordenes →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

