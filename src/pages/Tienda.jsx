import { useState, useEffect } from 'react'
import { obtenerProductos } from '../services/productoService'
import { obtenerCategorias } from '../services/categoriaService'
import '../styles/pages/Tienda.css'

// Cargar todas las imágenes de assets/img usando import.meta.glob
const imagenesMap = import.meta.glob('../assets/img/*.{png,jpg,jpeg,svg}', { 
  eager: true,
  import: 'default'
})

// Crear un mapa de nombres de archivo a URLs
const imagenes = {}
Object.keys(imagenesMap).forEach((path) => {
  const nombre = path.split('/').pop()
  imagenes[nombre] = imagenesMap[path]
})

function Tienda() {
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar productos al montar
  useEffect(() => {
    cargarProductos()
  }, [])

  // Cargar categorias desde el backend
  useEffect(() => {
    cargarCategorias()
  }, [])

  // Filtrar productos cuando cambia la categoria o busqueda
  useEffect(() => {
    filtrarProductos()
  }, [categoriaSeleccionada, busqueda, productos])

  const cargarProductos = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await obtenerProductos()
      setProductos(data)
      setProductosFiltrados(data)
    } catch (err) {
      setError('Error al cargar productos. Verifica que el servidor este activo.')
      console.error('Error cargando productos:', err)
    } finally {
      setLoading(false)
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

  const filtrarProductos = () => {
    let productosFiltrados = [...productos]

    // Filtrar por categoria
    if (categoriaSeleccionada !== 'todas') {
      productosFiltrados = productosFiltrados.filter(p => 
        p.categoriaId === parseInt(categoriaSeleccionada)
      )
    }

    // Filtrar por busqueda
    if (busqueda.trim()) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
    }

    setProductosFiltrados(productosFiltrados)
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const obtenerRutaImagen = (imagen) => {
    // Si la imagen es una URL completa, usarla directamente
    if (imagen && imagen.startsWith('http')) {
      return imagen
    }
    
    // Si la imagen es una ruta relativa, buscar en assets/img
    if (imagen) {
      const nombreImagen = imagen.split('/').pop()
      // Buscar en el mapa de imágenes cargadas
      if (imagenes[nombreImagen]) {
        return imagenes[nombreImagen]
      }
    }
    
    // Si no se encuentra, retornar null para que el onError maneje el fallback
    return null
  }

  return (
    <main className="tienda-main">
      <section className="tienda-hero">
        <h1 className="tienda-title">Tienda TaxSIIto!</h1>
        <p className="tienda-subtitle">
          Descubre nuestros productos exclusivos con el logo de TaxSIIto
        </p>
      </section>

      {/* Filtros y Busqueda */}
      <section className="tienda-filtros">
        <div className="filtros-container">
          {/* Busqueda */}
          <div className="busqueda-container">
            <input
              type="text"
              className="busqueda-input"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="material-icons busqueda-icon">search</span>
          </div>

          {/* Filtro por categoria */}
          <div className="categorias-container">
            <button
              className={`categoria-btn ${categoriaSeleccionada === 'todas' ? 'active' : ''}`}
              onClick={() => setCategoriaSeleccionada('todas')}
            >
              Todas
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                className={`categoria-btn ${categoriaSeleccionada === categoria.id.toString() ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada(categoria.id.toString())}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Productos */}
      <section className="tienda-productos">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <span className="material-icons error-icon">error_outline</span>
            <p>{error}</p>
            <button className="btn-reload" onClick={cargarProductos}>
              Reintentar
            </button>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="empty-container">
            <span className="material-icons empty-icon">inventory_2</span>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="productos-grid">
            {productosFiltrados.map((producto) => (
              <article key={producto.id} className="producto-card">
                <div className="producto-imagen-container">
                  {obtenerRutaImagen(producto.imagen) ? (
                    <img
                      src={obtenerRutaImagen(producto.imagen)}
                      alt={producto.nombre}
                      className="producto-imagen"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const placeholder = e.target.nextElementSibling
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                  ) : (
                    <div className="producto-imagen-placeholder">
                      <span className="material-icons">image</span>
                      <span>Sin imagen</span>
                    </div>
                  )}
                  {obtenerRutaImagen(producto.imagen) && (
                    <div className="producto-imagen-placeholder" style={{ display: 'none' }}>
                      <span className="material-icons">image</span>
                      <span>Sin imagen</span>
                    </div>
                  )}
                  {producto.stockBajo && (
                    <span className="producto-badge stock-bajo">Stock bajo</span>
                  )}
                  {producto.stock === 0 && (
                    <span className="producto-badge sin-stock">Agotado</span>
                  )}
                </div>

                <div className="producto-info">
                  <div className="producto-categoria">{producto.categoriaNombre}</div>
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-descripcion">{producto.descripcion}</p>

                  <div className="producto-footer">
                    <div className="producto-precio">
                      {formatearPrecio(producto.precio)}
                    </div>
                    <div className="producto-stock">
                      {producto.stock > 0 ? (
                        <span className="stock-disponible">
                          Stock: {producto.stock}
                        </span>
                      ) : (
                        <span className="stock-agotado">Agotado</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Efecto glow */}
                <div className="producto-glow"></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Tienda

