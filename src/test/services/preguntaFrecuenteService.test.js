import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  obtenerPreguntasActivas, 
  buscarPreguntas 
} from '../../services/preguntaFrecuenteService'

describe('preguntaFrecuenteService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('obtenerPreguntasActivas', () => {
    it('debe retornar array de preguntas cuando la petición es exitosa', async () => {
      const preguntasMock = [
        { id: 1, pregunta: '¿Cómo emitir boleta?', respuesta: 'Para emitir...' },
        { id: 2, pregunta: '¿Qué es el F29?', respuesta: 'El F29 es...' }
      ]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(preguntasMock)
        })
      )

      const resultado = await obtenerPreguntasActivas()
      expect(resultado).toEqual(preguntasMock)
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/faqs')
    })

    it('debe retornar array vacío cuando hay error', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      const resultado = await obtenerPreguntasActivas()
      expect(resultado).toEqual([])
    })

    it('debe retornar array vacío cuando la respuesta no es ok', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500
        })
      )

      const resultado = await obtenerPreguntasActivas()
      expect(resultado).toEqual([])
    })
  })

  describe('buscarPreguntas', () => {
    it('debe codificar el parámetro de búsqueda correctamente', async () => {
      const preguntasMock = [{ id: 1, pregunta: 'Pregunta encontrada', respuesta: 'Respuesta' }]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(preguntasMock)
        })
      )

      await buscarPreguntas('boleta electrónica')
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/faqs/buscar?texto=boleta%20electr%C3%B3nica'
      )
    })

    it('debe retornar preguntas encontradas', async () => {
      const preguntasMock = [
        { id: 1, pregunta: '¿Cómo emitir boleta?', respuesta: 'Para emitir...' }
      ]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(preguntasMock)
        })
      )

      const resultado = await buscarPreguntas('boleta')
      expect(resultado).toEqual(preguntasMock)
    })

    it('debe retornar array vacío cuando hay error', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      const resultado = await buscarPreguntas('test')
      expect(resultado).toEqual([])
    })
  })
})

