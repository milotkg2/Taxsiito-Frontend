import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/pages/admin/Ordenes.css'

function Ordenes() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [ordenes, setOrdenes] = useState([])
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([])
  const [ordenExpandida, setOrdenExpandida] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    verificarAutenticacion()
  }, [])

  useEffect(() => {
    if (usuario) {
      cargarOrdenes()
    }
  }, [usuario])

  useEffect(() => {
    filtrarOrdenes()
  }, [busqueda, ordenes])

  const verificarAutenticacion = () => {
    const usuarioStorage = localStorage.getItem('usuario')
    if (!usuarioStorage) {
      navigate('/login')
      return
    }

    try {
      const usuarioData = JSON.parse(usuarioStorage)
      setUsuario(usuarioData)
      
      // Solo ADMIN y VENDEDOR pueden ver órdenes
      if (usuarioData.rol !== 'ADMIN' && usuarioData.rol !== 'VENDEDOR') {
        navigate('/admin')
        return
      }
    } catch (err) {
      navigate('/login')
    }
  }

  const cargarOrdenes = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8080/api/ordenes')
      if (!response.ok) {
        throw new Error('Error al cargar órdenes')
      }
      const data = await response.json()
      // Ordenar por fecha más reciente primero
      const ordenadas = data.sort((a, b) => {
        const fechaA = new Date(a.fechaCreacion)
        const fechaB = new Date(b.fechaCreacion)
        return fechaB - fechaA
      })
      setOrdenes(ordenadas)
      setOrdenesFiltradas(ordenadas)
    } catch (err) {
      setError(err.message)
      console.error('Error cargando órdenes:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtrarOrdenes = () => {
    if (!busqueda.trim()) {
      setOrdenesFiltradas(ordenes)
      return
    }

    const query = busqueda.toLowerCase()
    const filtradas = ordenes.filter(o => {
      return (
        (o.numeroOrden || '').toLowerCase().includes(query) ||
        (o.usuarioCorreo || '').toLowerCase().includes(query) ||
        (o.usuarioNombre || '').toLowerCase().includes(query)
      )
    })
    setOrdenesFiltradas(filtradas)
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(precio || 0)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return '-'
    const date = new Date(fecha)
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const contarItems = (items) => {
    if (!items || !Array.isArray(items)) return 0
    return items.reduce((total, item) => total + (item.cantidad || 0), 0)
  }

  const calcularEnvio = (orden) => {
    // Simular costo de envío (puede venir del backend)
    return 5000
  }

  const toggleDetalles = (ordenId) => {
    setOrdenExpandida(ordenExpandida === ordenId ? null : ordenId)
  }

  const exportarCSV = () => {
    const headers = [
      'Folio',
      'Fecha',
      'Cliente',
      'Correo',
      'Dirección',
      'Región',
      'Comuna',
      'Items',
      'Subtotal',
      'Envío',
      'Total',
      'Estado'
    ]

    const rows = ordenes.map(orden => {
      const itemsTxt = (orden.items || [])
        .map(item => `${item.productoNombre} x ${item.cantidad} @ ${item.precioUnitario}`)
        .join(' | ')
      
      return [
        orden.numeroOrden || '',
        formatearFecha(orden.fechaCreacion),
        orden.usuarioNombre || '',
        orden.usuarioCorreo || '',
        orden.direccionEnvio || '',
        orden.regionEnvio || '',
        orden.comunaEnvio || '',
        itemsTxt,
        orden.subtotal || 0,
        calcularEnvio(orden),
        orden.total || 0,
        orden.estado || ''
      ]
    })

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const fecha = new Date()
    const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
    a.href = url
    a.download = `ordenes_${fechaStr}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'badge-pendiente'
      case 'PAGADA':
        return 'badge-pagada'
      case 'EN_PREPARACION':
        return 'badge-preparacion'
      case 'ENVIADA':
        return 'badge-enviada'
      case 'ENTREGADA':
        return 'badge-entregada'
      case 'CANCELADA':
        return 'badge-cancelada'
      default:
        return 'badge-default'
    }
  }

  const getEstadoLabel = (estado) => {
    const labels = {
      'PENDIENTE': 'Pendiente',
      'PAGADA': 'Pagada',
      'EN_PREPARACION': 'En Preparación',
      'ENVIADA': 'Enviada',
      'ENTREGADA': 'Entregada',
      'CANCELADA': 'Cancelada'
    }
    return labels[estado] || estado
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
              <Link to="/admin/ordenes" className="nav-item active">
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
            <h1 className="header-title">Ordenes</h1>
            <span className="header-rol">Administración de ordenes</span>
          </div>
          <div className="header-user">
            <span className="material-icons">account_circle</span>
            <span>{usuario.nombres} {usuario.apellidos}</span>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          <div className="ordenes-card">
            <div className="ordenes-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <span className="material-icons">search</span>
                  <input
                    type="search"
                    placeholder="Buscar por folio, correo o nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                  />
                </div>
                <span className="ordenes-count">
                  {ordenesFiltradas.length} orden{ordenesFiltradas.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="toolbar-actions">
                <button onClick={cargarOrdenes} className="btn-secondary">
                  <span className="material-icons">refresh</span>
                  Recargar
                </button>
                <button onClick={exportarCSV} className="btn-secondary">
                  <span className="material-icons">download</span>
                  Exportar CSV
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando ordenes...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <span className="material-icons">error_outline</span>
                <p>{error}</p>
                <button onClick={cargarOrdenes} className="btn-reload">
                  Reintentar
                </button>
              </div>
            ) : ordenesFiltradas.length === 0 ? (
              <div className="empty-container">
                <span className="material-icons">receipt_long</span>
                <p>No se encontraron ordenes</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="ordenes-table">
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Items</th>
                      <th>Subtotal</th>
                      <th>Envio</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenesFiltradas.map((orden) => (
                      <>
                        <tr key={orden.id}>
                          <td>{orden.numeroOrden || '-'}</td>
                          <td>{formatearFecha(orden.fechaCreacion)}</td>
                          <td>
                            <div className="cliente-info">
                              <div className="cliente-nombre">{orden.usuarioNombre || '-'}</div>
                              <div className="cliente-correo">{orden.usuarioCorreo || '-'}</div>
                            </div>
                          </td>
                          <td>{contarItems(orden.items)}</td>
                          <td>{formatearPrecio(orden.subtotal)}</td>
                          <td>{formatearPrecio(calcularEnvio(orden))}</td>
                          <td><strong>{formatearPrecio(orden.total)}</strong></td>
                          <td>
                            <span className={`estado-badge ${getEstadoBadgeClass(orden.estado)}`}>
                              {getEstadoLabel(orden.estado)}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => toggleDetalles(orden.id)}
                              className="btn-view"
                              title="Ver detalles"
                            >
                              <span className="material-icons">
                                {ordenExpandida === orden.id ? 'expand_less' : 'expand_more'}
                              </span>
                            </button>
                          </td>
                        </tr>
                        {ordenExpandida === orden.id && (
                          <tr className="detalles-row">
                            <td colSpan="9">
                              <div className="detalles-content">
                                <div className="detalle-section">
                                  <h4>Información del Cliente</h4>
                                  <p><strong>Nombre:</strong> {orden.usuarioNombre || '-'}</p>
                                  <p><strong>Correo:</strong> {orden.usuarioCorreo || '-'}</p>
                                  <p><strong>Dirección:</strong> {orden.direccionEnvio || '-'}</p>
                                  <p><strong>Región:</strong> {orden.regionEnvio || '-'}</p>
                                  <p><strong>Comuna:</strong> {orden.comunaEnvio || '-'}</p>
                                </div>
                                <div className="detalle-section">
                                  <h4>Items de la Orden</h4>
                                  <ul className="items-list">
                                    {(orden.items || []).map((item, idx) => (
                                      <li key={idx}>
                                        <span className="item-nombre">{item.productoNombre || '-'}</span>
                                        <span className="item-cantidad">× {item.cantidad || 0}</span>
                                        <span className="item-precio">{formatearPrecio(item.precioUnitario)}</span>
                                        <span className="item-subtotal">{formatearPrecio(item.subtotal)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {orden.notas && (
                                  <div className="detalle-section">
                                    <h4>Notas</h4>
                                    <p>{orden.notas}</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
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

export default Ordenes

