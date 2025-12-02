import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  obtenerProductos, 
  obtenerProductoPorId, 
  buscarProductos, 
  obtenerProductosPorCategoria 
} from '../../services/productoService'

describe('productoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('obtenerProductos', () => {
    it('debe retornar array de productos cuando la petición es exitosa', async () => {
      const productosMock = [
        { id: 1, nombre: 'Producto 1', precio: 10000 },
        { id: 2, nombre: 'Producto 2', precio: 20000 }
      ]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(productosMock)
        })
      )

      const resultado = await obtenerProductos()
      expect(resultado).toEqual(productosMock)
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/productos')
    })

    it('debe retornar array vacío cuando hay error', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      const resultado = await obtenerProductos()
      expect(resultado).toEqual([])
    })

    it('debe retornar array vacío cuando la respuesta no es ok', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500
        })
      )

      const resultado = await obtenerProductos()
      expect(resultado).toEqual([])
    })
  })

  describe('obtenerProductoPorId', () => {
    it('debe retornar producto cuando la petición es exitosa', async () => {
      const productoMock = { id: 1, nombre: 'Producto 1', precio: 10000 }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(productoMock)
        })
      )

      const resultado = await obtenerProductoPorId(1)
      expect(resultado).toEqual(productoMock)
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/productos/1')
    })

    it('debe retornar null cuando hay error', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      const resultado = await obtenerProductoPorId(1)
      expect(resultado).toBeNull()
    })

    it('debe retornar null cuando la respuesta no es ok', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404
        })
      )

      const resultado = await obtenerProductoPorId(999)
      expect(resultado).toBeNull()
    })
  })

  describe('buscarProductos', () => {
    it('debe codificar el parámetro de búsqueda correctamente', async () => {
      const productosMock = [{ id: 1, nombre: 'Producto buscado' }]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(productosMock)
        })
      )

      await buscarProductos('producto test')
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/productos/buscar?nombre=producto%20test'
      )
    })

    it('debe retornar productos encontrados', async () => {
      const productosMock = [{ id: 1, nombre: 'Producto encontrado' }]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(productosMock)
        })
      )

      const resultado = await buscarProductos('producto')
      expect(resultado).toEqual(productosMock)
    })

    it('debe retornar array vacío cuando hay error', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      const resultado = await buscarProductos('producto')
      expect(resultado).toEqual([])
    })
  })

  describe('obtenerProductosPorCategoria', () => {
    it('debe retornar productos de la categoría específica', async () => {
      const productosMock = [
        { id: 1, nombre: 'Producto 1', categoriaId: 1 },
        { id: 2, nombre: 'Producto 2', categoriaId: 1 }
      ]

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(productosMock)
        })
      )

      const resultado = await obtenerProductosPorCategoria(1)
      expect(resultado).toEqual(productosMock)
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/productos/categoria/1')
    })

    it('debe retornar array vacío cuando hay error', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      const resultado = await obtenerProductosPorCategoria(1)
      expect(resultado).toEqual([])
    })
  })
})

