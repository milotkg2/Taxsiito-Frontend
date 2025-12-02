import { Link } from 'react-router-dom'
import logo from '../assets/img/LOGO2.png'
import '../styles/components/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-brand">
              <img className="footer-logo" src={logo} alt="TaxSIIto Logo" />
            </div>
            <p className="footer-tagline">
              Simplificando tus impuestos con tecnologia
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Redes Sociales</h3>
            <ul className="footer-list">
              <li><Link to="/mantenimiento" className="footer-link">Twitter</Link></li>
              <li><Link to="/mantenimiento" className="footer-link">Facebook</Link></li>
              <li><Link to="/mantenimiento" className="footer-link">Instagram</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <p className="footer-text">Av Providencia 1234, Santiago</p>
            <p className="footer-text">taxsiito@taxsiito.cl</p>
            <p className="footer-text">+56 969596969</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="footer-copyright">2025 TaxSIIto. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
