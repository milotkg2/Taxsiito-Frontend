import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Registro from '../../pages/Registro.jsx'

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock de ubicacionService
vi.mock('../../services/ubicacionService', () => ({
  obtenerRegiones: () => Promise.resolve([
    { id: 1, nombre: 'Región Metropolitana' },
    { id: 2, nombre: 'Valparaíso' }
  ]),
  obtenerComunasPorRegion: (regionId) => {
    if (regionId === '1') {
      return Promise.resolve([
        { id: 1, nombre: 'Santiago' },
        { id: 2, nombre: 'Providencia' }
      ])
    }
    return Promise.resolve([])
  }
}))

describe('Registro', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  describe('Validaciones de formulario', () => {
    it('debe mostrar error cuando el RUN está vacío', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      const submitButton = await screen.findByText('Crear cuenta')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor ingresa tu RUN')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando el RUN es inválido', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      const runInput = await screen.findByPlaceholderText('12345678K')
      const submitButton = await screen.findByText('Crear cuenta')

      fireEvent.change(runInput, { target: { value: '123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('El RUN ingresado no es valido')).toBeInTheDocument()
      })
    })

    it('debe aceptar RUN válido con diferentes formatos', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      const runInput = await screen.findByPlaceholderText('12345678K')
      const emailInput = await screen.findByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('4-10 caracteres')
      const confirmPasswordInput = screen.getByPlaceholderText('Repetir contrasena')
      const nombresInput = screen.getByPlaceholderText('Tus nombres')
      const apellidosInput = screen.getByPlaceholderText('Tus apellidos')
      const direccionInput = screen.getByPlaceholderText('Tu direccion completa')
      const submitButton = await screen.findByText('Crear cuenta')

      // Llenar todos los campos requeridos
      fireEvent.change(runInput, { target: { value: '12345678-9' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass1234' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'pass1234' } })
      fireEvent.change(nombresInput, { target: { value: 'Juan' } })
      fireEvent.change(apellidosInput, { target: { value: 'Pérez' } })
      fireEvent.change(direccionInput, { target: { value: 'Calle 123' } })

      // Esperar a que carguen las regiones
      await waitFor(() => {
        const regionSelect = screen.getByDisplayValue('Selecciona region')
        fireEvent.change(regionSelect, { target: { value: '1' } })
      })

      await waitFor(() => {
        const comunaSelect = screen.getByDisplayValue('Selecciona comuna')
        fireEvent.change(comunaSelect, { target: { value: '1' } })
      })

      fireEvent.click(submitButton)

      // No debe mostrar error de RUN
      await waitFor(() => {
        expect(screen.queryByText('El RUN ingresado no es valido')).not.toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('debe mostrar error cuando la contraseña es menor a 4 caracteres', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      const runInput = await screen.findByPlaceholderText('12345678K')
      const emailInput = await screen.findByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('4-10 caracteres')
      const submitButton = await screen.findByText('Crear cuenta')

      fireEvent.change(runInput, { target: { value: '12345678-9' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: '123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('La contrasena debe tener entre 4 y 10 caracteres')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando la contraseña es mayor a 10 caracteres', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      const runInput = await screen.findByPlaceholderText('12345678K')
      const emailInput = await screen.findByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('4-10 caracteres')
      const submitButton = await screen.findByText('Crear cuenta')

      fireEvent.change(runInput, { target: { value: '12345678-9' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: '12345678901' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('La contrasena debe tener entre 4 y 10 caracteres')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando las contraseñas no coinciden', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      const runInput = await screen.findByPlaceholderText('12345678K')
      const emailInput = await screen.findByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('4-10 caracteres')
      const confirmPasswordInput = screen.getByPlaceholderText('Repetir contrasena')
      const submitButton = await screen.findByText('Crear cuenta')

      fireEvent.change(runInput, { target: { value: '12345678-9' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass1234' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'pass5678' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Las contrasenas no coinciden')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando faltan campos requeridos', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      const submitButton = await screen.findByText('Crear cuenta')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor ingresa tu RUN')).toBeInTheDocument()
      })
    })
  })

  describe('Carga de regiones y comunas', () => {
    it('debe cargar regiones al montar el componente', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Región Metropolitana')).toBeInTheDocument()
      })
    })

    it('debe cargar comunas al seleccionar una región', async () => {
      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      await waitFor(() => {
        const regionSelect = screen.getByDisplayValue('Selecciona region')
        fireEvent.change(regionSelect, { target: { value: '1' } })
      })

      await waitFor(() => {
        expect(screen.getByText('Santiago')).toBeInTheDocument()
      })
    })
  })

  describe('Integración con API', () => {
    it('debe enviar datos correctos al registrar usuario', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'test@example.com',
        rol: 'CLIENTE',
        nombres: 'Juan',
        apellidos: 'Pérez'
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ usuario: usuarioMock })
        })
      )

      render(
        <BrowserRouter>
          <Registro />
        </BrowserRouter>
      )

      // Llenar formulario
      const runInput = await screen.findByPlaceholderText('12345678K')
      const emailInput = await screen.findByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('4-10 caracteres')
      const confirmPasswordInput = screen.getByPlaceholderText('Repetir contrasena')
      const nombresInput = screen.getByPlaceholderText('Tus nombres')
      const apellidosInput = screen.getByPlaceholderText('Tus apellidos')
      const direccionInput = screen.getByPlaceholderText('Tu direccion completa')

      fireEvent.change(runInput, { target: { value: '12345678-9' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass1234' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'pass1234' } })
      fireEvent.change(nombresInput, { target: { value: 'Juan' } })
      fireEvent.change(apellidosInput, { target: { value: 'Pérez' } })
      fireEvent.change(direccionInput, { target: { value: 'Calle 123' } })

      await waitFor(() => {
        const regionSelect = screen.getByDisplayValue('Selecciona region')
        fireEvent.change(regionSelect, { target: { value: '1' } })
      })

      await waitFor(() => {
        const comunaSelect = screen.getByDisplayValue('Selecciona comuna')
        fireEvent.change(comunaSelect, { target: { value: '1' } })
      })

      const submitButton = await screen.findByText('Crear cuenta')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/auth/register',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              run: '123456789',
              correo: 'test@example.com',
              password: 'pass1234',
              nombres: 'Juan',
              apellidos: 'Pérez',
              direccion: 'Calle 123',
              regionId: 1,
              comunaId: 1,
              telefono: ''
            })
          })
        )
      })
    })
  })
})

