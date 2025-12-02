import { Link } from 'react-router-dom'
import '../styles/pages/Nosotros.css'
import seba from '../assets/img/seba.png'
import milo from '../assets/img/milo.png'

function Nosotros() {
  const equipo = [
    {
      nombre: 'Sebastian Esparza',
      rol: 'Front-end | Accesibilidad',
      imagen: seba
    },
    {
      nombre: 'Camilo Romero',
      rol: 'Back-end | Integraciones',
      imagen: milo
    }
  ]

  return (
    <main className="nosotros-main">
      {/* Hero Section */}
      <section className="nosotros-hero">
        <div className="hero-content">
          <h1 className="nosotros-title">Quienes somos?</h1>
          <p className="nosotros-descripcion">
            En TaxSIIto creemos que cumplir con las obligaciones tributarias no deberia 
            ser un dolor de cabeza para los emprendedores. Nacimos con el proposito de 
            acompanar a las miniempresas de Chile en su camino hacia una gestion tributaria 
            mas simple, eficiente y accesible.
          </p>
          <p className="nosotros-descripcion">
            Nuestra plataforma combina innovacion tecnologica y cercania humana: integramos 
            inteligencia artificial, un calendario tributario personalizado, emision gratuita 
            de boletas electronicas y un chatbot disponible 24/7 para responder dudas. Ademas, 
            incorporamos herramientas de gamificacion que transforman tareas complejas en 
            experiencias motivadoras y faciles de seguir.
          </p>
          <p className="nosotros-descripcion">
            Sabemos que detras de cada negocio hay esfuerzo, suenos y metas. Por eso, nuestro 
            compromiso es ayudar a los emprendedores a enfocarse en lo que realmente importa: 
            hacer crecer su negocio, mientras nosotros simplificamos sus procesos fiscales y 
            administrativos.
          </p>
          <p className="nosotros-highlight">
            TaxSIIto: tus impuestos con un toque de carino.
          </p>
        </div>
      </section>

      {/* Mision Section */}
      <section className="nosotros-section">
        <div className="section-content">
          <h2 className="section-title">Nuestra mision</h2>
          <div className="mision-card">
            <p className="mision-texto">
              En TaxSIIto sonamos con un futuro en el que las pequenas y medianas empresas 
              puedan concentrar toda su energia en crecer y cumplir sus suenos, sin que las 
              obligaciones tributarias se conviertan en un obstaculo.
            </p>
            <p className="mision-texto">
              Nuestra vision es transformar la gestion tributaria en Chile en un proceso 
              accesible, eficiente y confiable, donde cada emprendedor cuente con herramientas 
              digitales inteligentes que le permitan cumplir con la normativa de manera clara, 
              oportuna y sin complicaciones.
            </p>
            <p className="mision-texto">
              Queremos ser reconocidos como la plataforma de referencia para miniempresas, 
              ofreciendo soluciones innovadoras como inteligencia artificial, recordatorios 
              personalizados y procesos automatizados que reduzcan la carga administrativa y 
              potencien el bienestar de quienes emprenden.
            </p>
            <p className="mision-destacado">
              Nuestra vision: hacer de lo complejo algo simple, y de lo obligatorio, un aliado 
              para el exito.
            </p>
          </div>
        </div>
      </section>

      {/* Equipo Section */}
      <section className="nosotros-section equipo-section">
        <div className="section-content">
          <h2 className="section-title">El Equipo</h2>
          <div className="equipo-grid">
            {equipo.map((miembro, index) => (
              <article key={index} className="equipo-card">
                <div className="equipo-avatar">
                  {miembro.imagen ? (
                    <img 
                      src={miembro.imagen} 
                      alt={miembro.nombre}
                      className="avatar-image"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const placeholder = e.target.nextElementSibling
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className="avatar-placeholder" style={{ display: miembro.imagen ? 'none' : 'flex' }}>
                    <span className="avatar-icon">👤</span>
                  </div>
                </div>
                <h3 className="equipo-nombre">{miembro.nombre}</h3>
                <p className="equipo-rol">{miembro.rol}</p>
              </article>
            ))}
          </div>
          <p className="equipo-contacto">
            Quieres saber mas? <Link to="/contacto" className="contacto-link">Escribenos</Link> y conversemos.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Nosotros

