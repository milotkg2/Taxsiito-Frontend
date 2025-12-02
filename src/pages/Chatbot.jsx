import { useState, useEffect, useRef } from 'react'
import { obtenerPreguntasActivas, buscarPreguntas } from '../services/preguntaFrecuenteService'
import '../styles/pages/Chatbot.css'

function Chatbot() {
  const [mensajes, setMensajes] = useState([])
  const [inputTexto, setInputTexto] = useState('')
  const [preguntasFrecuentes, setPreguntasFrecuentes] = useState([])
  const [cargando, setCargando] = useState(false)
  const [escribiendo, setEscribiendo] = useState(false)
  const chatBodyRef = useRef(null)

  useEffect(() => {
    // Cargar preguntas frecuentes del backend
    cargarPreguntasFrecuentes()
    
    // Mensaje inicial del bot
    if (mensajes.length === 0) {
      setMensajes([
        {
          role: 'bot',
          content: '¡Hola! Soy tu asesor tributario ChatSIIto. ¿En qué te puedo ayudar hoy? Puedes hacer una pregunta o seleccionar una de las opciones sugeridas.',
          timestamp: new Date()
        }
      ])
    }
  }, [])

  useEffect(() => {
    // Auto-scroll al final del chat
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [mensajes, escribiendo])

  const cargarPreguntasFrecuentes = async () => {
    try {
      const preguntas = await obtenerPreguntasActivas()
      setPreguntasFrecuentes(preguntas)
    } catch (error) {
      console.error('Error al cargar preguntas frecuentes:', error)
    }
  }

  const buscarRespuesta = async (texto) => {
    // Buscar en las preguntas frecuentes
    const preguntasEncontradas = await buscarPreguntas(texto)
    
    if (preguntasEncontradas.length > 0) {
      // Si encuentra preguntas similares, devolver la primera respuesta
      return preguntasEncontradas[0].respuesta
    }

    // Si no encuentra, buscar coincidencias parciales en las preguntas cargadas
    const textoLower = texto.toLowerCase()
    const preguntaEncontrada = preguntasFrecuentes.find(p => 
      p.pregunta.toLowerCase().includes(textoLower) ||
      textoLower.includes(p.pregunta.toLowerCase().substring(0, 20))
    )

    if (preguntaEncontrada) {
      return preguntaEncontrada.respuesta
    }

    // Respuestas genéricas basadas en palabras clave
    if (textoLower.includes('boleta') || textoLower.includes('emitir')) {
      return 'Para emitir una boleta electrónica, debes:\n\n1. Ingresar al módulo de "Emitir Boleta" en tu panel.\n2. Completar los datos del receptor (RUT, nombre, dirección).\n3. Agregar los productos o servicios con sus montos.\n4. Confirmar y firmar electrónicamente.\n5. Descargar el PDF y enviarlo al cliente.\n\n¿Necesitas ayuda con algún paso específico?'
    }

    if (textoLower.includes('f29') || textoLower.includes('iva')) {
      return 'El formulario F29 (IVA) debe presentarse mensualmente antes del día 20 del mes siguiente. Incluye:\n\n• Ventas afectas e IVA débito fiscal\n• Compras afectas e IVA crédito fiscal\n• Saldo a pagar o a favor\n\nRecuerda que puedes configurar recordatorios automáticos en tu calendario tributario. ¿Quieres que te ayude a configurar uno?'
    }

    if (textoLower.includes('obligacion') || textoLower.includes('vencimiento')) {
      return 'Tus principales obligaciones tributarias mensuales son:\n\n• **F29 (IVA)**: Vence el día 20 de cada mes\n• **PPM**: Según tu régimen tributario\n• **Boletas**: Emisión según actividad\n\nTambién tienes obligaciones anuales como el F22 (Renta) en abril. Puedes ver tu calendario personalizado en el panel de control. ¿Quieres más detalles sobre alguna de estas?'
    }

    if (textoLower.includes('recordatorio') || textoLower.includes('recordar')) {
      return 'Puedes crear recordatorios para tus obligaciones tributarias:\n\n1. Ve a "Calendario Tributario" en tu panel\n2. Haz clic en "Nuevo Recordatorio"\n3. Selecciona la obligación (F29, F22, etc.)\n4. Configura la fecha y hora\n5. Elige el canal de notificación (email, SMS)\n\nLos recordatorios te ayudarán a cumplir a tiempo con tus obligaciones. ¿Qué obligación quieres recordar?'
    }

    if (textoLower.includes('reporte') || textoLower.includes('informe')) {
      return 'Puedes generar reportes de:\n\n• **IVA**: Por períodos mensuales o trimestrales\n• **Ventas**: Resumen de facturación\n• **Compras**: Registro de gastos\n• **Renta**: Preparación para F22\n\nVe a la sección "Reportes" en tu panel y selecciona el tipo de reporte que necesitas. Puedes exportarlos en PDF o Excel. ¿Qué tipo de reporte necesitas?'
    }

    // Respuesta genérica si no encuentra coincidencias
    return 'Entiendo tu consulta. Aunque no tengo una respuesta específica para eso en este momento, puedo ayudarte con:\n\n• Emisión de boletas electrónicas\n• Obligaciones tributarias (F29, F22, PPM)\n• Recordatorios y calendario tributario\n• Reportes e informes\n• Dudas sobre impuestos\n\n¿Puedes reformular tu pregunta o seleccionar una de las opciones sugeridas?'
  }

  const enviarMensaje = async (texto = null) => {
    const mensajeUsuario = texto || inputTexto.trim()
    if (!mensajeUsuario) return

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario = {
      role: 'user',
      content: mensajeUsuario,
      timestamp: new Date()
    }
    setMensajes(prev => [...prev, nuevoMensajeUsuario])
    setInputTexto('')
    setCargando(true)
    setEscribiendo(true)

    // Simular delay de escritura
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Buscar respuesta
    const respuesta = await buscarRespuesta(mensajeUsuario)

    // Simular escritura progresiva
    setEscribiendo(false)
    const nuevoMensajeBot = {
      role: 'bot',
      content: respuesta,
      timestamp: new Date()
    }
    setMensajes(prev => [...prev, nuevoMensajeBot])
    setCargando(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  const seleccionarPregunta = (pregunta) => {
    enviarMensaje(pregunta.pregunta)
  }

  return (
    <main className="chatbot-main">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h1 className="chatbot-title">
            <span className="material-icons">smart_toy</span>
            ChatSIIto - Asesor Tributario
          </h1>
          <p className="chatbot-subtitle">Tu asistente virtual disponible 24/7</p>
        </div>

        <div className="chatbot-content">
          {/* Preguntas frecuentes sugeridas */}
          {preguntasFrecuentes.length > 0 && mensajes.length <= 1 && (
            <div className="preguntas-sugeridas">
              <h3 className="sugeridas-title">Preguntas frecuentes:</h3>
              <div className="chips-container">
                {preguntasFrecuentes.slice(0, 8).map((pregunta) => (
                  <button
                    key={pregunta.id}
                    className="chip"
                    onClick={() => seleccionarPregunta(pregunta)}
                  >
                    {pregunta.pregunta}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Área de chat */}
          <div className="chat-body" ref={chatBodyRef}>
            {mensajes.map((mensaje, index) => (
              <div key={index} className={`mensaje ${mensaje.role}`}>
                <div className="mensaje-avatar">
                  {mensaje.role === 'user' ? (
                    <span className="material-icons">person</span>
                  ) : (
                    <span className="material-icons">smart_toy</span>
                  )}
                </div>
                <div className="mensaje-burbuja">
                  <div className="mensaje-contenido">
                    {mensaje.content.split('\n').map((linea, i) => (
                      <p key={i}>{linea || '\u00A0'}</p>
                    ))}
                  </div>
                  <div className="mensaje-timestamp">
                    {mensaje.timestamp.toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {escribiendo && (
              <div className="mensaje bot">
                <div className="mensaje-avatar">
                  <span className="material-icons">smart_toy</span>
                </div>
                <div className="mensaje-burbuja">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input de mensaje */}
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                className="chat-input"
                placeholder="Escribe tu pregunta aquí... (Enter para enviar, Shift+Enter para nueva línea)"
                value={inputTexto}
                onChange={(e) => setInputTexto(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={cargando}
              />
              <button
                className="chat-send-button"
                onClick={() => enviarMensaje()}
                disabled={!inputTexto.trim() || cargando}
                aria-label="Enviar mensaje"
              >
                <span className="material-icons">send</span>
              </button>
            </div>
            <p className="chat-input-hint">
              ChatSIIto puede ayudarte con obligaciones tributarias, boletas, reportes y más.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Chatbot

