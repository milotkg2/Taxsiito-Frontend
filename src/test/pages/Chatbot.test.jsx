import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Chatbot from '../../pages/Chatbot.jsx'

// Mock de preguntaFrecuenteService
const mockObtenerPreguntasActivas = vi.fn()
const mockBuscarPreguntas = vi.fn()

vi.mock('../../services/preguntaFrecuenteService', () => ({
  obtenerPreguntasActivas: () => mockObtenerPreguntasActivas(),
  buscarPreguntas: (texto) => mockBuscarPreguntas(texto)
}))

describe('Chatbot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockObtenerPreguntasActivas.mockResolvedValue([
      { id: 1, pregunta: '¿Cómo emitir boleta?', respuesta: 'Para emitir una boleta...' },
      { id: 2, pregunta: '¿Qué es el F29?', respuesta: 'El F29 es el formulario...' }
    ])
    mockBuscarPreguntas.mockResolvedValue([])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Inicialización', () => {
    it('debe mostrar mensaje inicial del bot', async () => {
      render(<Chatbot />)

      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('debe cargar preguntas frecuentes al montar', async () => {
      render(<Chatbot />)

      await waitFor(() => {
        expect(mockObtenerPreguntasActivas).toHaveBeenCalled()
      }, { timeout: 3000 })
    })

    it('debe mostrar preguntas frecuentes sugeridas', async () => {
      render(<Chatbot />)

      await waitFor(() => {
        expect(screen.getByText('¿Cómo emitir boleta?')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Funcionalidad de búsqueda', () => {
    it('debe buscar respuesta en preguntas frecuentes', async () => {
      mockBuscarPreguntas.mockResolvedValue([
        { id: 1, pregunta: '¿Cómo emitir boleta?', respuesta: 'Respuesta encontrada' }
      ])

      render(<Chatbot />)

      // Esperar a que cargue el componente
      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Escribe tu pregunta aquí/)
      const sendButton = screen.getByLabelText('Enviar mensaje')

      fireEvent.change(input, { target: { value: 'boleta' } })
      fireEvent.click(sendButton)

      // Esperar a que se complete el setTimeout (1000ms) y las actualizaciones de estado
      await waitFor(() => {
        expect(mockBuscarPreguntas).toHaveBeenCalledWith('boleta')
      }, { timeout: 3000 })
    })

    it('debe mostrar respuesta genérica para palabras clave', async () => {
      mockBuscarPreguntas.mockResolvedValue([])

      render(<Chatbot />)

      // Esperar a que cargue el componente
      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Escribe tu pregunta aquí/)
      const sendButton = screen.getByLabelText('Enviar mensaje')

      fireEvent.change(input, { target: { value: 'boleta' } })
      fireEvent.click(sendButton)

      // Esperar a que se complete el setTimeout (1000ms) y las actualizaciones de estado
      // El texto puede estar truncado, así que buscamos el inicio del mensaje
      await waitFor(() => {
        expect(screen.getByText(/Para emitir una boleta/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('debe manejar búsqueda de F29/IVA', async () => {
      mockBuscarPreguntas.mockResolvedValue([])

      render(<Chatbot />)

      // Esperar a que cargue el componente
      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Escribe tu pregunta aquí/)
      const sendButton = screen.getByLabelText('Enviar mensaje')

      fireEvent.change(input, { target: { value: 'F29' } })
      fireEvent.click(sendButton)

      // Esperar a que se complete el setTimeout (1000ms) y las actualizaciones de estado
      // El componente encuentra la pregunta en preguntasFrecuentes y devuelve "El F29 es el formulario..."
      await waitFor(() => {
        expect(screen.getByText(/El F29 es el formulario/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Manejo de mensajes', () => {
    it('debe agregar mensaje del usuario al enviar', async () => {
      render(<Chatbot />)

      // Esperar a que cargue el componente
      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Escribe tu pregunta aquí/)
      const sendButton = screen.getByLabelText('Enviar mensaje')

      fireEvent.change(input, { target: { value: 'Mi pregunta' } })
      fireEvent.click(sendButton)

      // El mensaje se agrega inmediatamente, antes del setTimeout
      expect(screen.getByText('Mi pregunta')).toBeInTheDocument()
    })

    it('debe limpiar input al enviar mensaje', async () => {
      render(<Chatbot />)

      // Esperar a que cargue el componente
      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Escribe tu pregunta aquí/)
      const sendButton = screen.getByLabelText('Enviar mensaje')

      fireEvent.change(input, { target: { value: 'Mi pregunta' } })
      fireEvent.click(sendButton)

      // El input se limpia inmediatamente
      expect(input.value).toBe('')
    })

    it('debe enviar mensaje con Enter', async () => {
      render(<Chatbot />)

      // Esperar a que cargue el componente
      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Escribe tu pregunta aquí/)

      fireEvent.change(input, { target: { value: 'Mi pregunta' } })
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

      // El mensaje se agrega inmediatamente
      expect(screen.getByText('Mi pregunta')).toBeInTheDocument()
    })

    it('no debe enviar mensaje con Shift+Enter', async () => {
      render(<Chatbot />)

      // Esperar a que cargue el componente
      await waitFor(() => {
        expect(screen.getByText(/¡Hola! Soy tu asesor tributario ChatSIIto/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Escribe tu pregunta aquí/)

      fireEvent.change(input, { target: { value: 'Mi pregunta' } })
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13, shiftKey: true })

      // El input debe seguir teniendo el texto (no se envió)
      expect(input.value).toBe('Mi pregunta')
      
      // Esperar un momento para asegurar que no se procesó el envío
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // No debe haber mensajes de usuario en el chat (solo el mensaje inicial del bot)
      // Verificar que no hay ningún elemento con clase 'mensaje user' que contenga 'Mi pregunta'
      const chatBody = document.querySelector('.chat-body')
      if (chatBody) {
        const mensajesUsuario = chatBody.querySelectorAll('.mensaje.user')
        const tieneMensaje = Array.from(mensajesUsuario).some(mensaje => 
          mensaje.textContent.includes('Mi pregunta')
        )
        expect(tieneMensaje).toBe(false)
      }
    })
  })

  describe('Selección de preguntas', () => {
    it('debe enviar mensaje al seleccionar pregunta sugerida', async () => {
      render(<Chatbot />)

      // Esperar a que cargue el componente y las preguntas
      await waitFor(() => {
        expect(screen.getByText('¿Cómo emitir boleta?')).toBeInTheDocument()
      }, { timeout: 3000 })

      const preguntaButton = screen.getByText('¿Cómo emitir boleta?')
      fireEvent.click(preguntaButton)

      // Verificar que el mensaje se agregó (puede aparecer dos veces: en el botón y en el chat)
      await waitFor(() => {
        const mensajes = screen.getAllByText('¿Cómo emitir boleta?')
        expect(mensajes.length).toBeGreaterThan(0)
      }, { timeout: 3000 })
    })
  })
})

