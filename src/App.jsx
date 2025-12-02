import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import Home from './pages/Home'
import Planes from './pages/Planes'
import Contacto from './pages/Contacto'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import Login from './pages/Login'
import Registro from './pages/Registro'
import RecuperarPassword from './pages/RecuperarPassword'
import Tienda from './pages/Tienda'
import Chatbot from './pages/Chatbot'
import Mantenimiento from './pages/Mantenimiento'
import Dashboard from './pages/admin/Dashboard'
import Usuarios from './pages/admin/Usuarios'
import UsuarioForm from './pages/admin/UsuarioForm'
import Productos from './pages/admin/Productos'
import ProductoForm from './pages/admin/ProductoForm'
import Ordenes from './pages/admin/Ordenes'
import './styles/App.css'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="app">
      {!isAdminRoute && <ParticleBackground />}
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/chatsiito" element={<Chatbot />} />
        <Route path="/mantenimiento" element={<Mantenimiento />} />
        <Route path="/mantencion" element={<Mantenimiento />} />
        <Route path="/planes" element={<Mantenimiento />} />
        <Route path="/play-store" element={<Mantenimiento />} />
        <Route path="/app-store" element={<Mantenimiento />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/usuarios" element={<Usuarios />} />
        <Route path="/admin/usuarios/nuevo" element={<UsuarioForm />} />
        <Route path="/admin/usuarios/:id" element={<UsuarioForm />} />
        <Route path="/admin/productos" element={<Productos />} />
        <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
        <Route path="/admin/productos/:id" element={<ProductoForm />} />
        <Route path="/admin/ordenes" element={<Ordenes />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App
