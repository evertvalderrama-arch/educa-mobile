# Guía para crear el icono de la aplicación

## Requisitos de iconos para Expo

Necesitas crear los siguientes iconos:

### 1. **icon.png** (1024x1024px)
- Icono principal de la aplicación
- Formato: PNG con transparencia
- Tamaño: 1024x1024 píxeles
- Ubicación: `assets/icon.png`

### 2. **adaptive-icon.png** (1024x1024px) [Opcional - Android]
- Icono adaptable para Android
- Área segura: círculo de 660px centrado
- Ubicación: `assets/adaptive-icon.png`

### 3. **splash.png** (2048x2048px o 1284x2778px) [Opcional]
- Pantalla de carga
- Ubicación: `assets/splash.png`

## Diseño sugerido para EDUCA

**Concepto:** 
- Color principal: Vino (#8B1538)
- Símbolo: 📚 (libro) + 🎓 (birrete) o letra "E" estilizada
- Fondo: Degradado vino → crema o color sólido vino

**Herramientas online gratuitas:**
- https://www.appicon.co/ - Generador de iconos
- https://icon.kitchen/ - Generador específico para Expo/React Native
- https://www.canva.com/ - Diseño personalizado

## Configuración en app.json

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#8B1538"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#8B1538"
      }
    }
  }
}
```

## Pasos rápidos

1. Usa https://icon.kitchen/
2. Sube un logo o diseña uno simple
3. Descarga el paquete completo
4. Extrae `icon.png` y `adaptive-icon.png` a la carpeta `assets/`
5. Actualiza `app.json` con las rutas

