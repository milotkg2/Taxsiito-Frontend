import { Link } from 'react-router-dom'
import appStore from '../assets/img/app.png'
import googlePlay from '../assets/img/play.png'
import '../styles/pages/Home.css'

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Asistencia Tributaria Inteligente</div>
          <h1 className="hero-title">
            Eres una empresa emergente y necesitas <span className="highlight"> un guia en tus impuestos?</span>
          </h1>
          <h1 className="hero-subtitle">
            ¡SOMOS TU SOLUCION!
          </h1>
          <div className="hero-buttons">
            <Link to="/chatsiito" className="btn-primary">
              <span className="btn-icon">💬</span>
              INICIAR CHAT
            </Link>
            <Link to="/nosotros" className="btn-secondary">
              SABER MAS
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Disponibilidad</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Segura</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">IA</span>
            <span className="stat-label">Inteligente</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <h2 className="section-title">Nuestros Servicios</h2>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <span className="material-icons">question_answer</span>
              </div>
              <h3 className="service-title">ChatSIIto</h3>
              <p className="service-description">
                Asistente virtual que resuelve tus dudas tributarias al instante. 
                Disponible 24/7 para ayudarte.
              </p>
              <div className="service-glow"></div>
            </div>

            <div className="service-card">
              <div className="service-icon blue">
                <span className="material-icons">description</span>
              </div>
              <h3 className="service-title">Documentos</h3>
              <p className="service-description">
                Te guia paso a paso en la emision de boletas, facturas y documentos tributarios.
              </p>
              <div className="service-glow blue"></div>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span className="material-icons">notifications_active</span>
              </div>
              <h3 className="service-title">Recordatorios</h3>
              <p className="service-description">
                Accede a informacion actualizada y recordatorios de plazos importantes.
              </p>
              <div className="service-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Sigamos en contacto!</h2>
            <p className="cta-description">
              ¿Quieres simplificar la gestion tributaria de tu PYME? 
              Dejanos tus datos y te ayudamos a ahorrar tiempo.
            </p>
            <Link to="/contacto" className="btn-cta">
              Contactanos
              <span className="btn-shine"></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="download-section">
        <div className="download-container">
          <div className="download-content">
            <h2 className="download-title">
              Descarga la app
              <span className="download-highlight"> GRATIS</span>
            </h2>
            <p className="download-subtitle">Disponible para iOS y Android</p>
            <div className="download-buttons">
              <Link to="/mantenimiento" className="store-button">
                <div className="store-text">
                <img src={appStore} alt="Download on the App Store" className="app-img" />
                </div>
              </Link>
              <Link to="/mantenimiento" className="store-button">
                <div className="store-text">
                <img src={googlePlay} alt="Get it on Google Play" className="app-img" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
