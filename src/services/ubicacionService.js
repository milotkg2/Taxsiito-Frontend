// Servicio para consumir API de ubicacion (regiones y comunas)

const API_URL = 'http://localhost:8080/api/ubicacion'

/**
 * Obtiene todas las regiones.
 */
export const obtenerRegiones = async () => {
  const response = await fetch(`${API_URL}/regiones`)
  if (!response.ok) {
    throw new Error('Error al obtener regiones')
  }
  return await response.json()
}

/**
 * Obtiene todas las regiones con sus comunas.
 */
export const obtenerRegionesConComunas = async () => {
  const response = await fetch(`${API_URL}/regiones/completas`)
  if (!response.ok) {
    throw new Error('Error al obtener regiones con comunas')
  }
  return await response.json()
}

/**
 * Obtiene las comunas de una region especifica.
 */
export const obtenerComunasPorRegion = async (regionId) => {
  const response = await fetch(`${API_URL}/regiones/${regionId}/comunas`)
  if (!response.ok) {
    throw new Error('Error al obtener comunas')
  }
  return await response.json()
}

