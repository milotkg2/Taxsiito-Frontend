import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/img/LOGO2.png'
import '../styles/components/Header.css'

function Header() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Cargar usuario del localStorage
    const cargarUsuario = () => {
      const usuarioStorage = localStorage.getItem('usuario')
      if (usuarioStorage) {
        try {
          setUsuario(JSON.parse(usuarioStorage))
        } catch (err) {
          console.error('Error al cargar usuario:', err)
        }
      } else {
        setUsuario(null)
      }
    }

    cargarUsuario()

    // Escuchar cambios en localStorage (por si se actualiza desde otra pestaña)
    const handleStorageChange = () => {
      cargarUsuario()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Verificar periódicamente (por si se actualiza en la misma pestaña)
    const interval = setInterval(cargarUsuario, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    if (!showMenu) return

    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMenu])

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    setUsuario(null)
    setShowMenu(false)
    navigate('/')
    // Forzar recarga para actualizar el header
    window.location.reload()
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <img className="logo" src={logo} alt="TaxSIIto Logo" />
          </Link>
        </div>
        
        <nav className="nav">
          <Link className="nav-link" to="/planes">Planes</Link>
          <Link className="nav-link" to="/tienda">Tienda</Link>
          <Link className="nav-link" to="/contacto">Contacto</Link>
          <Link className="nav-link" to="/nosotros">Nosotros</Link>
          <Link className="nav-link" to="/blogs">Blogs</Link>
          
          {usuario ? (
            <div className="user-menu-container">
              <button 
                className={`user-menu-button ${showMenu ? 'active' : ''}`}
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Menú de usuario"
              >
                <span className="material-icons">account_circle</span>
                <span className="user-name">{usuario.nombres} {usuario.apellidos}</span>
                <span className="material-icons">arrow_drop_down</span>
              </button>
              
              {showMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-info">
                    <p className="user-menu-email">{usuario.correo}</p>
                    <p className="user-menu-rol">{usuario.rol}</p>
                  </div>
                  {usuario.rol === 'ADMIN' || usuario.rol === 'VENDEDOR' ? (
                    <Link 
                      to="/admin" 
                      className="user-menu-item"
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="material-icons">dashboard</span>
                      Panel de Administración
                    </Link>
                  ) : null}
                  <button 
                    className="user-menu-item logout"
                    onClick={handleLogout}
                  >
                    <span className="material-icons">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="nav-link nav-login" to="/login">Iniciar sesion</Link>
              <Link className="nav-link nav-register" to="/registro">Registrarse</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
