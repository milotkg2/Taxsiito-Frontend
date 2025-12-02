import { describe, it, expect } from 'vitest'

// Funciones de validación extraídas de los componentes
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validarRun = (run) => {
  if (!run || run.trim() === '') return false
  const runTrimmed = run.trim()
  const runLimpio = runTrimmed.replace(/[.-]/g, '').toUpperCase()
  // Debe tener exactamente 8 o 9 caracteres (7-8 dígitos + 1 dígito verificador)
  if (runLimpio.length !== 8 && runLimpio.length !== 9) return false
  // Si el RUN original termina con guion sin dígito verificador después, es inválido
  // Ejemplo: '12345678-' se limpia a '12345678' (8 chars), pero debería tener 9
  if (runTrimmed.endsWith('-') && runLimpio.length === 8) {
    return false
  }
  // Debe terminar con un dígito verificador (número o K)
  if (!/[0-9K]$/.test(runLimpio)) return false
  // Los primeros caracteres deben ser solo números
  const cuerpo = runLimpio.slice(0, -1)
  if (!/^[0-9]+$/.test(cuerpo)) return false
  // Verificar que el cuerpo tenga 7 u 8 dígitos
  if (cuerpo.length < 7 || cuerpo.length > 8) return false
  return true
}

describe('Funciones de Validación', () => {
  describe('validarEmail', () => {
    it('debe validar emails correctos', () => {
      expect(validarEmail('test@example.com')).toBe(true)
      expect(validarEmail('usuario@gmail.com')).toBe(true)
      expect(validarEmail('admin@duoc.cl')).toBe(true)
      expect(validarEmail('nombre.apellido@profesor.duoc.cl')).toBe(true)
    })

    it('debe rechazar emails inválidos', () => {
      expect(validarEmail('')).toBe(false)
      expect(validarEmail('sinarroba')).toBe(false)
      expect(validarEmail('sin@dominio')).toBe(false)
      expect(validarEmail('sinpunto@dominio')).toBe(false)
      expect(validarEmail('@dominio.com')).toBe(false)
      expect(validarEmail('usuario@')).toBe(false)
      expect(validarEmail('usuario @dominio.com')).toBe(false)
    })
  })

  describe('validarRun', () => {
    it('debe validar RUNs correctos con formato estándar', () => {
      expect(validarRun('12345678-9')).toBe(true)
      expect(validarRun('12345678K')).toBe(true)
      expect(validarRun('12345678-9')).toBe(true)
    })

    it('debe validar RUNs con puntos y guiones', () => {
      expect(validarRun('12.345.678-9')).toBe(true)
      expect(validarRun('12345678-9')).toBe(true)
      expect(validarRun('12345678K')).toBe(true)
    })

    it('debe rechazar RUNs inválidos', () => {
      expect(validarRun('')).toBe(false)
      expect(validarRun('1234567')).toBe(false) // Muy corto
      expect(validarRun('1234567890')).toBe(false) // Muy largo
      expect(validarRun('ABCDEFGH-K')).toBe(false) // Solo letras
      expect(validarRun('12345678-')).toBe(false) // Sin dígito verificador
      expect(validarRun('12345678-A')).toBe(false) // Dígito verificador inválido (solo K o número)
    })

    it('debe manejar RUNs en minúsculas', () => {
      expect(validarRun('12345678-k')).toBe(true)
      expect(validarRun('12345678k')).toBe(true)
    })
  })
})

