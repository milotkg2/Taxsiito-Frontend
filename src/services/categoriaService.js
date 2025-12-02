// Servicio para consumir API de categorias

const API_URL = 'http://localhost:8080/api/categorias'

/**
 * Obtiene todas las categorias activas.
 */
export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}`)
    if (!response.ok) {
      throw new Error('Error al obtener categorias')
    }
    return await response.json()
  } catch (error) {
    console.error('Error en obtenerCategorias:', error)
    return []
  }
}

/**
 * Obtiene una categoria por ID.
 */
export const obtenerCategoriaPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Error al obtener categoria')
    }
    return await response.json()
  } catch (error) {
    console.error('Error en obtenerCategoriaPorId:', error)
    return null
  }
}

