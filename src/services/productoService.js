// Servicio para consumir API de productos

const API_URL = 'http://localhost:8080/api/productos'

/**
 * Obtiene todos los productos activos.
 */
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_URL}`)
    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }
    return await response.json()
  } catch (error) {
    console.error('Error en obtenerProductos:', error)
    return []
  }
}

/**
 * Obtiene un producto por ID.
 */
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Error al obtener producto')
    }
    return await response.json()
  } catch (error) {
    console.error('Error en obtenerProductoPorId:', error)
    return null
  }
}

/**
 * Busca productos por nombre.
 */
export const buscarProductos = async (nombre) => {
  try {
    const response = await fetch(`${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`)
    if (!response.ok) {
      throw new Error('Error al buscar productos')
    }
    return await response.json()
  } catch (error) {
    console.error('Error en buscarProductos:', error)
    return []
  }
}

/**
 * Obtiene productos por categoria.
 */
export const obtenerProductosPorCategoria = async (categoriaId) => {
  try {
    const response = await fetch(`${API_URL}/categoria/${categoriaId}`)
    if (!response.ok) {
      throw new Error('Error al obtener productos por categoria')
    }
    return await response.json()
  } catch (error) {
    console.error('Error en obtenerProductosPorCategoria:', error)
    return []
  }
}

