const API_BASE = 'http://localhost:8080/api'

/**
 * Obtiene todas las preguntas frecuentes activas
 */
export const obtenerPreguntasActivas = async () => {
  try {
    const response = await fetch(`${API_BASE}/faqs`)
    if (!response.ok) throw new Error('Error al obtener preguntas')
    return await response.json()
  } catch (error) {
    console.error('Error al obtener preguntas frecuentes:', error)
    return []
  }
}

/**
 * Busca preguntas que contengan el texto dado
 */
export const buscarPreguntas = async (texto) => {
  try {
    const response = await fetch(`${API_BASE}/faqs/buscar?texto=${encodeURIComponent(texto)}`)
    if (!response.ok) throw new Error('Error al buscar preguntas')
    return await response.json()
  } catch (error) {
    console.error('Error al buscar preguntas:', error)
    return []
  }
}

/**
 * Obtiene las categorías disponibles
 */
export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_BASE}/faqs/categorias`)
    if (!response.ok) throw new Error('Error al obtener categorías')
    return await response.json()
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return []
  }
}

