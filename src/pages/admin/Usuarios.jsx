import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/pages/admin/Usuarios.css'

function Usuarios() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    verificarAutenticacion()
  }, [])

  useEffect(() => {
    if (usuario) {
      cargarUsuarios()
    }
  }, [usuario])

  useEffect(() => {
    filtrarUsuarios()
  }, [busqueda, usuarios])

  const verificarAutenticacion = () => {
    const usuarioStorage = localStorage.getItem('usuario')
    if (!usuarioStorage) {
      navigate('/login')
      return
    }

    try {
      const usuarioData = JSON.parse(usuarioStorage)
      setUsuario(usuarioData)
      
      // Solo ADMIN puede ver usuarios
      if (usuarioData.rol !== 'ADMIN') {
        navigate('/admin')
        return
      }
    } catch (err) {
      navigate('/login')
    }
  }

  const cargarUsuarios = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8080/api/usuarios')
      if (!response.ok) {
        throw new Error('Error al cargar usuarios')
      }
      const data = await response.json()
      setUsuarios(data)
      setUsuariosFiltrados(data)
    } catch (err) {
      setError(err.message)
      console.error('Error cargando usuarios:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtrarUsuarios = () => {
    if (!busqueda.trim()) {
      setUsuariosFiltrados(usuarios)
      return
    }

    const query = busqueda.toLowerCase()
    const filtrados = usuarios.filter(u => {
      const nombreCompleto = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase()
      return (
        (u.run || '').toLowerCase().includes(query) ||
        nombreCompleto.includes(query) ||
        (u.correo || '').toLowerCase().includes(query)
      )
    })
    setUsuariosFiltrados(filtrados)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar usuario')
      }

      // Recargar lista
      cargarUsuarios()
    } catch (err) {
      alert('Error al eliminar usuario: ' + err.message)
      console.error('Error eliminando usuario:', err)
    }
  }

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'badge-admin'
      case 'VENDEDOR':
        return 'badge-vendedor'
      case 'CLIENTE':
        return 'badge-cliente'
      default:
        return 'badge-default'
    }
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
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="header-title">Usuarios</h1>
            <span className="header-rol">Administración de usuarios</span>
          </div>
          <div className="header-user">
            <span className="material-icons">account_circle</span>
            <span>{usuario.nombres} {usuario.apellidos}</span>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          <div className="usuarios-card">
            <div className="usuarios-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <span className="material-icons">search</span>
                  <input
                    type="search"
                    placeholder="Buscar por RUN, nombre o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                  />
                </div>
                <span className="usuarios-count">
                  {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Link to="/admin/usuarios/nuevo" className="btn-primary">
                <span className="material-icons">add</span>
                Nuevo usuario
              </Link>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando usuarios...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <span className="material-icons">error_outline</span>
                <p>{error}</p>
                <button onClick={cargarUsuarios} className="btn-reload">
                  Reintentar
                </button>
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <div className="empty-container">
                <span className="material-icons">people_outline</span>
                <p>No se encontraron usuarios</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="usuarios-table">
                  <thead>
                    <tr>
                      <th>RUN</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Tipo</th>
                      <th>Región</th>
                      <th>Comuna</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id}>
                        <td>{u.run || '-'}</td>
                        <td>{`${u.nombres || ''} ${u.apellidos || ''}`.trim() || '-'}</td>
                        <td>{u.correo || '-'}</td>
                        <td>
                          <span className={`rol-badge ${getRolBadgeClass(u.rol)}`}>
                            {u.rol || '-'}
                          </span>
                        </td>
                        <td>{u.regionNombre || '-'}</td>
                        <td>{u.comunaNombre || '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/admin/usuarios/${u.id}`}
                              className="btn-edit"
                              title="Editar"
                            >
                              <span className="material-icons">edit</span>
                            </Link>
                            <button
                              onClick={() => handleEliminar(u.id)}
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

export default Usuarios

