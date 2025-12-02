import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import RecuperarPassword from '../../pages/RecuperarPassword.jsx'

// Helper para obtener el formulario
const getForm = (container) => {
  return container.querySelector('form')
}

describe('RecuperarPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validaciones de formulario', () => {
    it('debe mostrar error cuando el email está vacío', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const form = getForm(container)
      fireEvent.submit(form)

      // Las validaciones son síncronas, pero React necesita un ciclo de renderizado
      await waitFor(() => {
        expect(screen.getByText('El correo es requerido')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando el email supera 100 caracteres', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const confirmEmailInput = screen.getByLabelText('Confirmar correo electrónico')
      const form = getForm(container)

      const emailLargo = 'a'.repeat(95) + '@gmail.com'
      fireEvent.change(emailInput, { target: { value: emailLargo } })
      fireEvent.change(confirmEmailInput, { target: { value: emailLargo } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('El correo no puede superar 100 caracteres')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando el email no tiene dominio permitido', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const confirmEmailInput = screen.getByLabelText('Confirmar correo electrónico')
      const form = getForm(container)

      fireEvent.change(emailInput, { target: { value: 'test@yahoo.com' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test@yahoo.com' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com')).toBeInTheDocument()
      })
    })

    it('debe aceptar emails con dominios permitidos', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const confirmEmailInput = screen.getByLabelText('Confirmar correo electrónico')
      const form = getForm(container)

      // Probar con @duoc.cl
      fireEvent.change(emailInput, { target: { value: 'test@duoc.cl' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test@duoc.cl' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.queryByText('Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com')).not.toBeInTheDocument()
      })

      // Probar con @profesor.duoc.cl
      fireEvent.change(emailInput, { target: { value: 'test@profesor.duoc.cl' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test@profesor.duoc.cl' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.queryByText('Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com')).not.toBeInTheDocument()
      })

      // Probar con @gmail.com
      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.queryByText('Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com')).not.toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando los emails no coinciden', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const confirmEmailInput = screen.getByLabelText('Confirmar correo electrónico')
      const form = getForm(container)

      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test2@gmail.com' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Los correos no coinciden')).toBeInTheDocument()
      })
    })

    it('debe limpiar errores al escribir en los campos', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const form = getForm(container)

      // Intentar enviar con email vacío
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(screen.getByText('El correo es requerido')).toBeInTheDocument()
      })

      // Escribir en el campo
      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })

      await waitFor(() => {
        expect(screen.queryByText('El correo es requerido')).not.toBeInTheDocument()
      })
    })
  })

  describe('Manejo de estado', () => {
    it('debe mostrar mensaje de éxito al enviar correctamente', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const confirmEmailInput = screen.getByLabelText('Confirmar correo electrónico')
      const form = getForm(container)

      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.submit(form)

      // Esperar a que se complete el setTimeout (1500ms) y las actualizaciones de estado
      await waitFor(() => {
        expect(screen.getByText('Solicitud válida')).toBeInTheDocument()
        expect(screen.getByText('Revisa tu correo electrónico para continuar con la recuperación de contraseña.')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('debe limpiar el formulario al éxito', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const confirmEmailInput = screen.getByLabelText('Confirmar correo electrónico')
      const form = getForm(container)

      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.submit(form)

      // Esperar a que se complete el setTimeout (1500ms) y las actualizaciones de estado
      await waitFor(() => {
        expect(emailInput.value).toBe('')
        expect(confirmEmailInput.value).toBe('')
      }, { timeout: 3000 })
    })

    it('debe mostrar loading durante el envío', async () => {
      const { container } = render(
        <BrowserRouter>
          <RecuperarPassword />
        </BrowserRouter>
      )

      const emailInput = screen.getByLabelText('Correo electrónico')
      const confirmEmailInput = screen.getByLabelText('Confirmar correo electrónico')
      const form = getForm(container)

      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.change(confirmEmailInput, { target: { value: 'test@gmail.com' } })
      fireEvent.submit(form)

      // El loading debe aparecer inmediatamente
      expect(screen.getByText('Enviando...')).toBeInTheDocument()
      expect(emailInput).toBeDisabled()
      expect(confirmEmailInput).toBeDisabled()
    })
  })
})

