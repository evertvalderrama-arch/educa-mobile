# 📱 Educa Mobile - Sistema de Gestión Educativa

Aplicación móvil desarrollada con **Expo** y **React Native** para la gestión integral de instituciones educativas. Permite a administradores, docentes y alumnos gestionar cursos, temas, actividades y calificaciones desde dispositivos móviles.

---

## 🎯 Características Principales

### **👤 Panel Administrador**
- ✅ Crear usuarios (admin, docente, alumno)
- ✅ Crear cursos
- ✅ Configurar usuarios (asignar grado/sección)
- ✅ Configurar cursos (asignar grado/sección/docente)
- ✅ Visualizar cursos por grado/sección
- ✅ Listar todos los cursos

### **👨‍🏫 Panel Docente**
- ✅ Gestionar temas por curso
- ✅ Crear y editar temas con descripción
- ✅ Generar criterios de evaluación (4 tipos)
- ✅ Generar lista de alumnos automáticamente
- ✅ Calificar entregas (AD/A/B/C)
- ✅ Agregar comentarios a calificaciones
- ✅ Ver estado de actividades (abiertas/cerradas)

### **🎓 Panel Alumno**
- ✅ Ver cursos asignados
- ✅ Ver temas y calificaciones por curso
- ✅ Realizar entregas de actividades
- ✅ Ver calificaciones (4 tipos: Escrita, Exposición, Participación, Evaluación)
- ✅ Consultar comentarios del docente
- ✅ Ver fechas límite de entregas

---

## 🚀 Instalación

### **Requisitos previos:**
- Node.js 16+ 
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Emulador Android/iOS o Expo Go en dispositivo físico

### **Instalación:**

```bash
# Clonar repositorio
cd Web/mobile

# Instalar dependencias
npm install

# Instalar dependencias nativas con Expo
npx expo install react-native-gesture-handler react-native-screens react-native-safe-area-context

# Iniciar servidor de desarrollo
npx expo start
```

### **Ejecutar en dispositivo:**

- **Android:** Presiona `a` en la terminal o escanea QR con Expo Go
- **iOS:** Presiona `i` en la terminal o escanea QR con Expo Go
- **Web:** Presiona `w` (funcionalidad limitada)

---

## 🏗️ Arquitectura

### **Stack Tecnológico:**
- **Frontend:** React Native 0.71.8 + Expo SDK 48
- **Navegación:** React Navigation 6.x (Stack Navigator)
- **Estado:** React Hooks (useState, useEffect)
- **Storage:** AsyncStorage (persistencia de sesión)
- **Backend:** PHP 7.4+ con MySQL
- **API:** REST JSON en `https://educa.tyjet.org/api`

### **Estructura del Proyecto:**
```
mobile/
├── assets/               # Iconos y recursos
│   └── icon-guide.md    # Guía para crear iconos
├── src/
│   ├── screens/         # 13 pantallas principales
│   │   ├── LoginScreen.js
│   │   ├── AlumnoHomeScreen.js
│   │   ├── DocenteHomeScreen.js
│   │   ├── AdminHomeScreen.js
│   │   ├── EditarTemaScreen.js
│   │   ├── GenerarCriteriosScreen.js
│   │   └── ... (otros screens)
│   ├── components/      # Componentes reutilizables
│   │   └── CustomPicker.js
│   ├── utils/           # Utilidades
│   │   └── logger.js    # Logger centralizado (DEV mode)
│   ├── api.js           # Cliente API
│   └── theme.js         # Tema global (colores, espaciado)
├── App.js               # Entry point con navegación
└── package.json
```

---

## 🎨 Tema Visual

**Paleta de colores:**
- **Primario (Vino):** `#8B1538`
- **Secundario (Crema):** `#F5E6D3`
- **Acento (Dorado):** `#D4AF37`
- **Éxito:** `#28a745` (AD)
- **Info:** `#007bff` (A)
- **Warning:** `#ffc107` (B)
- **Error:** `#dc3545` (C)

**Diseño:**
- Cards con elevación y bordes redondeados
- Grid responsive 2×2 para calificaciones
- Sin scroll horizontal (mobile-first)
- Touch targets ≥45% ancho

---

## 📊 Optimizaciones Implementadas

### **1. Virtualización de Listas (FlatList)**
- ✅ 5 pantallas optimizadas con FlatList
- ✅ Renderizado inicial: 20 elementos
- ✅ Performance 10x mejor con listas grandes
- ✅ Configuración: `initialNumToRender={20}`

### **2. Logger Centralizado**
- ✅ Logs solo en modo desarrollo (`__DEV__`)
- ✅ Sin logs en producción
- ✅ Uso: `import logger from './utils/logger'`

### **3. Limpieza de Código**
- ✅ Eliminados 7 screens obsoletos
- ✅ -1,200 líneas de código muerto
- ✅ 13 screens activos optimizados

**Ver reporte completo:** `OPTIMIZATION_REPORT.md`

---

## 🔐 Autenticación

### **Backend PHP (Actual):**
- Sesiones PHP con cookies
- **Limitación:** No funciona de forma confiable en apps nativas
- **Recomendación:** Migrar a autenticación JWT para producción

### **Flujo de Login:**
```javascript
POST /api/logins.php
Body: { accion: 'login', usuario: '...', password: '...' }
Response: { usuario: { id, nombre, rol } }
```

Roles: `admin`, `docente`, `alumno`

---

## 📱 Screens por Rol

### **🔐 Público:**
- **LoginScreen** - Inicio de sesión

### **🎓 Alumno (1 screen):**
- **AlumnoHomeScreen** - Panel principal con temas y calificaciones integradas

### **👨‍🏫 Docente (4 screens):**
- **DocenteHomeScreen** - Panel con selector de curso
- **CreateTemaScreen** - Crear nuevo tema
- **EditarTemaScreen** - Gestión completa de tema + calificaciones
- **GenerarCriteriosScreen** - Configurar criterios de evaluación

### **👤 Admin (7 screens):**
- **AdminHomeScreen** - Panel con menú de opciones
- **CreateUserScreen** - Crear usuarios
- **CreateCourseScreen** - Crear cursos
- **AdminCoursesScreen** - Listar cursos
- **ConfigurarUsuarioScreen** - Asignar grado/sección
- **ConfigurarCursoScreen** - Configurar curso
- **VisualizarCursosScreen** - Ver cursos filtrados

---

## 🔧 Configuración de Producción

### **1. Crear Icono de Aplicación:**
```bash
# Ver guía completa en:
assets/icon-guide.md

# Crear archivos:
assets/icon.png (1024×1024px)
assets/adaptive-icon.png (1024×1024px Android)
assets/splash.png (2048×2048px opcional)
```

**Herramientas recomendadas:**
- https://icon.kitchen/ (Expo específico)
- https://www.appicon.co/

### **2. Configurar app.json:**
```json
{
  "expo": {
    "name": "Educa",
    "slug": "educa-mobile",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#8B1538"
    },
    "android": {
      "package": "com.tyjet.educa",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#8B1538"
      }
    }
  }
}
```

### **3. Build para Producción:**
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar proyecto
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview
```

---

## 🧪 Testing

### **Testing Manual:**
1. Probar cada rol (admin, docente, alumno)
2. Verificar flujos completos:
   - Admin: Crear usuario → Configurar → Ver cursos
   - Docente: Crear tema → Generar criterios → Calificar
   - Alumno: Ver temas → Entregar actividad → Ver calificación

### **Dispositivos Recomendados:**
- Android 8.0+ (API 26+)
- iOS 12.0+
- Resoluciones: 360×640 a 414×896

---

## 🐛 Troubleshooting

### **Error: "Network request failed"**
- Verificar que el backend esté corriendo
- Revisar URL en `src/api.js` (línea 3)
- Verificar CORS en servidor PHP

### **Error: AsyncStorage**
- Ejecutar: `npx expo install @react-native-async-storage/async-storage`

### **Error: Navigation**
- Ejecutar: `npm install @react-navigation/native @react-navigation/native-stack`

### **Logs no aparecen:**
- Están deshabilitados en producción (modo `__DEV__`)
- Usar `logger.critical()` para logs siempre visibles

---

## 📚 API Endpoints

**Base URL:** `https://educa.tyjet.org/api`

### **Autenticación:**
- `POST /logins.php` - Login

### **Admin:**
- `POST /admins.php` - CRUD usuarios
- `POST /admins.php?accion=crear_curso` - Crear curso
- `POST /admins.php?accion=listar_cursos` - Listar cursos
- `POST /admins.php?accion=configurar_usuario` - Configurar usuario
- `POST /admins.php?accion=configurar_curso` - Configurar curso

### **Docente:**
- `POST /docentes.php` - Listar cursos docente
- `POST /temas.php` - CRUD temas
- `POST /temas.php?accion=listar_criterios` - Listar criterios
- `POST /temas.php?accion=guardar_criterios` - Guardar criterios
- `POST /temas.php?accion=generar_lista` - Generar lista alumnos
- `POST /temas.php?accion=editar_entrega` - Calificar entrega

### **Alumno:**
- `POST /alumnos.php` - Datos del alumno
- `POST /temas.php?accion=listar_temas` - Listar temas
- `POST /temas.php?accion=guardar_entrega` - Enviar entrega

---

## 🤝 Contribución

Este proyecto es parte del sistema Educa de TyJet. Para contribuir:

1. Fork el repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Proyecto privado - TyJet © 2026

---

## 📞 Soporte

- **Backend API:** https://educa.tyjet.org
- **Documentación:** Ver `OPTIMIZATION_REPORT.md`
- **Guía de iconos:** Ver `assets/icon-guide.md`

---

**Última actualización:** 2026-02-07
