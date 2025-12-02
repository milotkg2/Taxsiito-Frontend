import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages/Blogs.css'

function Blogs() {
  const [blogSeleccionado, setBlogSeleccionado] = useState(null)

  const blogs = [
    {
      id: 1,
      titulo: 'Guia para iniciar actividades en el SII',
      resumen: 'Todo lo que necesitas saber para comenzar tu emprendimiento de forma legal en Chile.',
      contenido: `Iniciar actividades en el Servicio de Impuestos Internos (SII) es el primer paso para formalizar tu emprendimiento en Chile. Este proceso te permite emitir boletas y facturas, lo que es esencial para operar legalmente.

Para iniciar actividades necesitas:
- Cedula de identidad vigente
- Clave tributaria del SII
- Definir tu actividad economica (giro)
- Elegir tu regimen tributario

El proceso es completamente online a traves del sitio web del SII (sii.cl). Una vez completado, podras comenzar a emitir documentos tributarios y cumplir con tus obligaciones fiscales.`,
      fecha: '15 Nov 2025',
      categoria: 'Tramites'
    },
    {
      id: 2,
      titulo: 'Diferencias entre boleta y factura electronica',
      resumen: 'Aprende cuando usar cada documento tributario y evita errores comunes.',
      contenido: `La boleta electronica se utiliza principalmente para ventas a consumidores finales, mientras que la factura electronica se usa en transacciones entre empresas.

Principales diferencias:
- La factura permite al comprador usar el IVA como credito fiscal
- La boleta es mas simple y no requiere datos del comprador
- Ambas tienen validez legal y deben ser emitidas electronicamente

Es importante elegir el documento correcto segun el tipo de cliente para evitar problemas con el SII.`,
      fecha: '10 Nov 2025',
      categoria: 'Documentos'
    },
    {
      id: 3,
      titulo: 'Como calcular y pagar el IVA mensual',
      resumen: 'Explicacion paso a paso del proceso de declaracion mensual de IVA.',
      contenido: `El IVA (Impuesto al Valor Agregado) es un impuesto del 19% que se aplica a la venta de bienes y servicios en Chile. Como contribuyente, debes declarar y pagar este impuesto mensualmente.

Pasos para calcular el IVA:
1. Suma el IVA de todas tus ventas (debito fiscal)
2. Suma el IVA de todas tus compras (credito fiscal)
3. Resta el credito del debito
4. El resultado es lo que debes pagar

La declaracion se realiza a traves del Formulario 29 en el sitio del SII, con vencimiento el dia 12 del mes siguiente.`,
      fecha: '5 Nov 2025',
      categoria: 'Impuestos'
    },
    {
      id: 4,
      titulo: 'Beneficios del regimen Pro Pyme',
      resumen: 'Descubre las ventajas tributarias para pequenas empresas en Chile.',
      contenido: `El regimen Pro Pyme esta disenado especialmente para pequenas y medianas empresas, ofreciendo importantes beneficios tributarios.

Principales beneficios:
- Tasa de impuesto reducida (25% vs 27%)
- Tributacion sobre base retirada
- Depreciacion instantanea de activos
- Simplificacion de registros contables

Para acceder a este regimen, tu empresa debe cumplir con ciertos requisitos de ingresos anuales. Es una excelente opcion para emprendedores que estan comenzando.`,
      fecha: '1 Nov 2025',
      categoria: 'Regimenes'
    }
  ]

  if (blogSeleccionado) {
    const blog = blogs.find(b => b.id === blogSeleccionado)
    return (
      <main className="blogs-main">
        <section className="blog-detail">
          <button 
            className="btn-volver" 
            onClick={() => setBlogSeleccionado(null)}
          >
            ← Volver a blogs
          </button>
          
          <article className="blog-article">
            <span className="blog-categoria">{blog.categoria}</span>
            <h1 className="blog-title-detail">{blog.titulo}</h1>
            <span className="blog-fecha-detail">{blog.fecha}</span>
            <div className="blog-contenido">
              {blog.contenido.split('\n\n').map((parrafo, index) => (
                <p key={index}>{parrafo}</p>
              ))}
            </div>
          </article>
        </section>
      </main>
    )
  }

  return (
    <main className="blogs-main">
      <section className="blogs-hero">
        <h1 className="blogs-title">Blogs</h1>
        <p className="blogs-subtitle">
          Articulos y guias para simplificar tu gestion tributaria
        </p>
      </section>

      <section className="blogs-grid-container">
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <article 
              key={blog.id} 
              className="blog-card"
              onClick={() => setBlogSeleccionado(blog.id)}
            >
              <div className="blog-card-header">
                <span className="blog-categoria">{blog.categoria}</span>
                <span className="blog-fecha">{blog.fecha}</span>
              </div>
              <h2 className="blog-card-title">{blog.titulo}</h2>
              <p className="blog-card-resumen">{blog.resumen}</p>
              <span className="blog-leer-mas">Leer mas →</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Blogs

