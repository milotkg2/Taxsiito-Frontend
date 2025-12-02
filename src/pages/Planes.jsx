import { Link } from 'react-router-dom'
import '../styles/pages/Planes.css'

function Planes() {
  const planes = [
    {
      id: 'basico',
      nombre: 'Basico',
      descripcion: 'Ideal para empezar: resuelve dudas rapidas cada dia sin complicaciones.',
      precio: '5.990',
      consultas: '10 consultas diarias',
      caracteristicas: [
        'Respuestas claras y confiables',
        'Historial de hasta 5 conversaciones',
        'Soporte por correo (48 h)'
      ],
      destacado: false,
      botonTexto: 'Empezar con Basico'
    },
    {
      id: 'plus',
      nombre: 'Plus',
      descripcion: 'El equilibrio perfecto: mas consultas, velocidad prioritaria y herramientas para ir un paso adelante.',
      precio: '9.990',
      consultas: '25 consultas diarias',
      caracteristicas: [
        'Todo lo de Basico',
        'Historial ilimitado',
        'Respuestas priorizadas',
        'Exportar chats (PDF/CSV)'
      ],
      destacado: true,
      botonTexto: 'Elegir Plus'
    },
    {
      id: 'premium',
      nombre: 'Premium',
      descripcion: 'Para power users y equipos exigentes: maximo desempeno y soporte prioritario.',
      precio: '16.999',
      consultas: '50 consultas diarias',
      caracteristicas: [
        'Todo lo de Plus',
        'Soporte prioritario (respuesta rapida)',
        'Acceso anticipado a nuevas funciones',
        'Contexto extendido para chats largos'
      ],
      destacado: false,
      botonTexto: 'Ir por Premium'
    }
  ]

  return (
    <main className="planes-main">
      <section className="planes-hero">
        <h1 className="planes-title">Elige tu plan!</h1>
        <p className="planes-subtitle">Selecciona el plan que mejor se adapte a tus necesidades</p>
      </section>

      <section className="planes-grid-container">
        <div className="planes-grid">
          {planes.map((plan) => (
            <article 
              key={plan.id} 
              className={`plan-card ${plan.destacado ? 'plan-destacado' : ''}`}
            >
              {plan.destacado && (
                <div className="plan-badge">
                  <span>Mas popular</span>
                </div>
              )}
              
              <div className="plan-header">
                <h3 className="plan-nombre">{plan.nombre}</h3>
                <p className="plan-descripcion">{plan.descripcion}</p>
              </div>

              <div className="plan-precio-container">
                <span className="plan-precio">${plan.precio}</span>
                <span className="plan-periodo">/mes</span>
              </div>

              <p className="plan-consultas">{plan.consultas}</p>

              <ul className="plan-caracteristicas">
                {plan.caracteristicas.map((caracteristica, index) => (
                  <li key={index} className="plan-caracteristica">
                    <span className="check-icon">✓</span>
                    <span>{caracteristica}</span>
                  </li>
                ))}
              </ul>

              <Link 
                Link to="/mantenimiento"
                className={`plan-boton ${plan.destacado ? 'plan-boton-destacado' : ''}`}
              >
                {plan.botonTexto}
              </Link>

              {/* Efecto glow */}
              <div className={`plan-glow ${plan.destacado ? 'glow-blue' : 'glow-yellow'}`}></div>
            </article>
          ))}
        </div>

        <p className="planes-nota">
          Los limites de consultas se renuevan diariamente a las 00:00 (hora local). 
          Puedes cambiar de plan en cualquier momento.
        </p>
      </section>
    </main>
  )
}

export default Planes

