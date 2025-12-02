import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Tienda from '../../pages/Tienda.jsx'

// Mock de servicios
const mockObtenerProductos = vi.fn()
const mockObtenerCategorias = vi.fn()

vi.mock('../../services/productoService', () => ({
  obtenerProductos: () => mockObtenerProductos()
}))

vi.mock('../../services/categoriaService', () => ({
  obtenerCategorias: () => mockObtenerCategorias()
}))

describe('Tienda', () => {
  const productosMock = [
    { 
      id: 1, 
      nombre: 'Producto 1', 
      descripcion: 'Descripción 1', 
      precio: 10000, 
      stock: 5,
      categoriaId: 1,
      categoriaNombre: 'Categoría 1',
      imagen: 'producto1.png'
    },
    { 
      id: 2, 
      nombre: 'Producto 2', 
      descripcion: 'Descripción 2', 
      precio: 20000, 
      stock: 0,
      categoriaId: 2,
      categoriaNombre: 'Categoría 2',
      imagen: 'producto2.png'
    },
    { 
      id: 3, 
      nombre: 'Producto 3', 
      descripcion: 'Otra descripción', 
      precio: 15000, 
      stock: 2,
      categoriaId: 1,
      categoriaNombre: 'Categoría 1',
      imagen: null
    }
  ]

  const categoriasMock = [
    { id: 1, nombre: 'Categoría 1' },
    { id: 2, nombre: 'Categoría 2' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockObtenerProductos.mockResolvedValue(productosMock)
    mockObtenerCategorias.mockResolvedValue(categoriasMock)
  })

  describe('Carga de datos', () => {
    it('debe cargar productos al montar', async () => {
      render(<Tienda />)

      await waitFor(() => {
        expect(mockObtenerProductos).toHaveBeenCalled()
      })
    })

    it('debe cargar categorías al montar', async () => {
      render(<Tienda />)

      await waitFor(() => {
        expect(mockObtenerCategorias).toHaveBeenCalled()
      })
    })

    it('debe mostrar loading durante la carga', async () => {
      mockObtenerProductos.mockImplementation(() => new Promise(() => {})) // Promise que nunca se resuelve

      render(<Tienda />)

      expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
    })

    it('debe mostrar error si falla la carga', async () => {
      mockObtenerProductos.mockRejectedValue(new Error('Error de red'))

      render(<Tienda />)

      await waitFor(() => {
        expect(screen.getByText('Error al cargar productos. Verifica que el servidor este activo.')).toBeInTheDocument()
      })
    })
  })

  describe('Filtrado de productos', () => {
    it('debe filtrar productos por categoría', async () => {
      render(<Tienda />)

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })

      // Buscar el botón de categoría usando getByRole
      const categoriaButton = screen.getByRole('button', { name: 'Categoría 1' })
      fireEvent.click(categoriaButton)

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
        expect(screen.getByText('Producto 3')).toBeInTheDocument()
        expect(screen.queryByText('Producto 2')).not.toBeInTheDocument()
      })
    })

    it('debe filtrar productos por búsqueda en nombre', async () => {
      render(<Tienda />)

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })

      const busquedaInput = screen.getByPlaceholderText('Buscar productos...')
      fireEvent.change(busquedaInput, { target: { value: 'Producto 1' } })

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
        expect(screen.queryByText('Producto 2')).not.toBeInTheDocument()
        expect(screen.queryByText('Producto 3')).not.toBeInTheDocument()
      })
    })

    it('debe filtrar productos por búsqueda en descripción', async () => {
      render(<Tienda />)

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })

      const busquedaInput = screen.getByPlaceholderText('Buscar productos...')
      fireEvent.change(busquedaInput, { target: { value: 'Otra' } })

      await waitFor(() => {
        expect(screen.getByText('Producto 3')).toBeInTheDocument()
        expect(screen.queryByText('Producto 1')).not.toBeInTheDocument()
        expect(screen.queryByText('Producto 2')).not.toBeInTheDocument()
      })
    })

    it('debe combinar filtros de categoría y búsqueda', async () => {
      render(<Tienda />)

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })

      // Buscar el botón de categoría usando getByRole
      const categoriaButton = screen.getByRole('button', { name: 'Categoría 1' })
      fireEvent.click(categoriaButton)

      const busquedaInput = screen.getByPlaceholderText('Buscar productos...')
      fireEvent.change(busquedaInput, { target: { value: 'Producto 1' } })

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
        expect(screen.queryByText('Producto 3')).not.toBeInTheDocument()
      })
    })

    it('debe mostrar todos los productos cuando se selecciona "Todas"', async () => {
      render(<Tienda />)

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
      })

      // Filtrar por categoría primero
      const categoriaButton = screen.getByRole('button', { name: 'Categoría 1' })
      fireEvent.click(categoriaButton)

      await waitFor(() => {
        expect(screen.queryByText('Producto 2')).not.toBeInTheDocument()
      })

      // Seleccionar "Todas"
      const todasButton = screen.getByRole('button', { name: 'Todas' })
      fireEvent.click(todasButton)

      await waitFor(() => {
        expect(screen.getByText('Producto 1')).toBeInTheDocument()
        expect(screen.getByText('Producto 2')).toBeInTheDocument()
        expect(screen.getByText('Producto 3')).toBeInTheDocument()
      })
    })
  })

  describe('Formateo y visualización', () => {
    it('debe formatear precios en CLP correctamente', async () => {
      render(<Tienda />)

      await waitFor(() => {
        // Verificar que el precio está formateado (puede variar según la configuración de Intl)
        expect(screen.getByText(/10.000|10000/)).toBeInTheDocument()
      })
    })

    it('debe mostrar mensaje cuando no hay productos', async () => {
      mockObtenerProductos.mockResolvedValue([])

      render(<Tienda />)

      await waitFor(() => {
        expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
      })
    })

    it('debe mostrar badge de agotado para productos sin stock', async () => {
      render(<Tienda />)

      await waitFor(() => {
        // Buscar el badge específicamente (tiene la clase 'producto-badge')
        const agotadoElements = screen.getAllByText('Agotado')
        const badge = agotadoElements.find(el => el.classList.contains('producto-badge'))
        expect(badge).toBeInTheDocument()
      })
    })
  })
})

