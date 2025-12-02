import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../../pages/Login.jsx'

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  describe('Validaciones de formulario', () => {
    it('debe mostrar error cuando el email está vacío', async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const submitButton = screen.getByText('Iniciar sesion')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor ingresa tu correo electronico')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando el email es inválido', async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const submitButton = screen.getByText('Iniciar sesion')

      fireEvent.change(emailInput, { target: { value: 'emailinvalido' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor ingresa un correo electronico valido')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando la contraseña está vacía', async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const submitButton = screen.getByText('Iniciar sesion')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor ingresa tu contrasena')).toBeInTheDocument()
      })
    })

    it('debe limpiar errores al escribir en los campos', async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const submitButton = screen.getByText('Iniciar sesion')

      // Intentar enviar con email vacío
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Por favor ingresa tu correo electronico')).toBeInTheDocument()
      })

      // Escribir en el campo
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      await waitFor(() => {
        expect(screen.queryByText('Por favor ingresa tu correo electronico')).not.toBeInTheDocument()
      })
    })
  })

  describe('Integración con API', () => {
    it('debe redirigir a /admin cuando el login es exitoso con rol ADMIN', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'admin@test.com',
        rol: 'ADMIN',
        nombres: 'Admin',
        apellidos: 'Test'
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ usuario: usuarioMock })
        })
      )

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByText('Iniciar sesion')

      fireEvent.change(emailInput, { target: { value: 'admin@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              correo: 'admin@test.com',
              password: 'password123'
            })
          })
        )
      })

      await waitFor(() => {
        expect(localStorage.getItem('usuario')).toBeTruthy()
        expect(mockNavigate).toHaveBeenCalledWith('/admin')
      })
    })

    it('debe redirigir a / cuando el login es exitoso con rol CLIENTE', async () => {
      const usuarioMock = {
        id: 2,
        correo: 'cliente@test.com',
        rol: 'CLIENTE',
        nombres: 'Cliente',
        apellidos: 'Test'
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ usuario: usuarioMock })
        })
      )

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByText('Iniciar sesion')

      fireEvent.change(emailInput, { target: { value: 'cliente@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    })

    it('debe mostrar error cuando las credenciales son incorrectas', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Usuario o contraseña incorrectos' })
        })
      )

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByText('Iniciar sesion')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando hay error de conexión', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      )

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByText('Iniciar sesion')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Error de conexion. Verifica que el servidor este activo.')).toBeInTheDocument()
      })
    })

    it('debe mostrar estado de loading durante el envío', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ usuario: { id: 1, rol: 'CLIENTE' } })
        })
      )

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      const emailInput = screen.getByPlaceholderText('tu@email.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByText('Iniciar sesion')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      // Verificar que el botón está deshabilitado durante el loading
      expect(submitButton).toBeDisabled()
    })
  })
})

