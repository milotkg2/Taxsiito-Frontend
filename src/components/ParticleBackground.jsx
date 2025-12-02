import { useEffect, useRef } from 'react'
import '../styles/components/ParticleBackground.css'

function ParticleBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    // Configurar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Clase Particula
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.2
        // Colores: amarillo dorado y azul
        this.color = Math.random() > 0.5 ? '#facc15' : '#254bf5ff'
      }

      update(mouse) {
        this.x += this.speedX
        this.y += this.speedY

        // Reaccion al mouse
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          const force = (150 - distance) / 150
          this.x -= dx * force * 0.02
          this.y -= dy * force * 0.02
          this.opacity = Math.min(1, this.opacity + 0.1)
        } else {
          this.opacity = Math.max(0.2, this.opacity - 0.01)
        }

        // Rebote en bordes
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Crear particulas
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
      particlesRef.current = particles
    }
    createParticles()

    // Conectar particulas cercanas
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.strokeStyle = particles[i].color
            ctx.globalAlpha = 0.1 * (1 - distance / 120)
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    // Animacion
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update(mouseRef.current)
        particle.draw(ctx)
      })
      
      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Click handler - explosion de particulas
    const handleClick = (e) => {
      for (let i = 0; i < 5; i++) {
        const particle = new Particle()
        particle.x = e.clientX
        particle.y = e.clientY
        particle.speedX = (Math.random() - 0.5) * 3
        particle.speedY = (Math.random() - 0.5) * 3
        particle.size = Math.random() * 3 + 1
        particles.push(particle)
      }
      // Limitar cantidad de particulas
      if (particles.length > 200) {
        particles.splice(0, 5)
      }
    }
    window.addEventListener('click', handleClick)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

export default ParticleBackground

