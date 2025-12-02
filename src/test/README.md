# Guía de Troubleshooting de Tests

## Problemas Comunes y Soluciones

### 1. Errores de Importación de CSS
Si ves errores relacionados con archivos `.css`, Vitest ya está configurado para manejarlos con `css: true` en `vite.config.js`.

### 2. Mocks de React Router
Los mocks de `react-router-dom` están configurados en cada archivo de prueba que los necesita. Si hay conflictos, verifica que el mock esté antes de los imports del componente.

### 3. Mocks de Servicios
Los servicios se mockean usando `vi.mock()` con rutas relativas desde `src/test/`. Asegúrate de que las rutas sean correctas:
- Desde `test/pages/`: `../../services/...`
- Desde `test/services/`: `../../services/...`

### 4. localStorage
El localStorage está mockeado en `setup.js`. Si necesitas resetearlo en un test específico, usa `localStorage.clear()` en el `beforeEach`.

### 5. Timers
Algunos tests usan `vi.useFakeTimers()` y `vi.useRealTimers()`. Asegúrate de restaurar los timers reales en `afterEach`.

### 6. fetch Global
El `fetch` global está mockeado en `setup.js`. En cada test, puedes sobrescribirlo con:
```javascript
global.fetch = vi.fn(() => Promise.resolve({...}))
```

## Estructura de Archivos

```
src/test/
├── setup.js                    # Configuración global
├── utils/                      # Pruebas de utilidades
├── services/                   # Pruebas de servicios
├── pages/                      # Pruebas de páginas
└── components/                 # Pruebas de componentes
```

## Ejecutar Tests

```bash
npm test              # Modo watch
npm run test:ui       # UI interactiva
npm run test:coverage # Con cobertura
```

