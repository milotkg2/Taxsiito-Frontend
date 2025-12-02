import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../../components/Header.jsx'

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Mock de window.location.reload
    delete window.location
    window.location = { reload: vi.fn() }
  })

  describe('Carga de usuario', () => {
    it('debe cargar usuario desde localStorage', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'test@example.com',
        nombres: 'Juan',
        apellidos: 'Pérez',
        rol: 'CLIENTE'
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioMock))

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
      })
    })

    it('debe mostrar menú de usuario si hay sesión', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'test@example.com',
        nombres: 'Juan',
        apellidos: 'Pérez',
        rol: 'CLIENTE'
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioMock))

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        expect(screen.queryByText('Iniciar sesion')).not.toBeInTheDocument()
        expect(screen.queryByText('Registrarse')).not.toBeInTheDocument()
      })
    })

    it('debe mostrar botones de login/registro si no hay sesión', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      expect(screen.getByText('Iniciar sesion')).toBeInTheDocument()
      expect(screen.getByText('Registrarse')).toBeInTheDocument()
    })
  })

  describe('Menú de usuario', () => {
    it('debe abrir/cerrar menú al hacer clic', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'test@example.com',
        nombres: 'Juan',
        apellidos: 'Pérez',
        rol: 'CLIENTE'
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioMock))

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      await waitFor(() => {
        const menuButton = screen.getByText('Juan Pérez').closest('button')
        fireEvent.click(menuButton)
      })

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
        expect(screen.getByText('CLIENTE')).toBeInTheDocument()
      })

      // Cerrar menú
      const menuButton = screen.getByText('Juan Pérez').closest('button')
      fireEvent.click(menuButton)

      await waitFor(() => {
        expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
      })
    })

    it('debe mostrar enlace al panel de administración para ADMIN', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'admin@example.com',
        nombres: 'Admin',
        apellidos: 'Test',
        rol: 'ADMIN'
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioMock))

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      await waitFor(() => {
        const menuButton = screen.getByText('Admin Test').closest('button')
        fireEvent.click(menuButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
      })
    })

    it('debe mostrar enlace al panel de administración para VENDEDOR', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'vendedor@example.com',
        nombres: 'Vendedor',
        apellidos: 'Test',
        rol: 'VENDEDOR'
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioMock))

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      await waitFor(() => {
        const menuButton = screen.getByText('Vendedor Test').closest('button')
        fireEvent.click(menuButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
      })
    })

    it('no debe mostrar enlace al panel para CLIENTE', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'cliente@example.com',
        nombres: 'Cliente',
        apellidos: 'Test',
        rol: 'CLIENTE'
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioMock))

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      await waitFor(() => {
        const menuButton = screen.getByText('Cliente Test').closest('button')
        fireEvent.click(menuButton)
      })

      await waitFor(() => {
        expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument()
      })
    })
  })

  describe('Logout', () => {
    it('debe eliminar usuario de localStorage al hacer logout', async () => {
      const usuarioMock = {
        id: 1,
        correo: 'test@example.com',
        nombres: 'Juan',
        apellidos: 'Pérez',
        rol: 'CLIENTE'
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioMock))

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      await waitFor(() => {
        const menuButton = screen.getByText('Juan Pérez').closest('button')
        fireEvent.click(menuButton)
      })

      await waitFor(() => {
        const logoutButton = screen.getByText('Cerrar sesión')
        fireEvent.click(logoutButton)
      })

      expect(localStorage.getItem('usuario')).toBeNull()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})

