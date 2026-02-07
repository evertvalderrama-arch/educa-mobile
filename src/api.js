const API_BASE = 'https://educa.tyjet.org/api'

// Callback para manejar sesión expirada
let onSessionExpired = null

export function setSessionExpiredCallback(callback) {
  onSessionExpired = callback
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const init = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }
  if (init.body && typeof init.body === 'object') {
    init.body = JSON.stringify(init.body)
  }

  const res = await fetch(url, init)
  const text = await res.text()
  
  // Detectar sesión expirada o no autorizada
  if (res.status === 401 || res.status === 403) {
    console.log('🔒 Sesión expirada o no autorizada')
    if (onSessionExpired) {
      onSessionExpired()
    }
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
  }
  
  try {
    const data = text ? JSON.parse(text) : null
    
    // Verificar si hay error en la respuesta (aunque el status sea 200)
    if (data && data.error) {
      // Mensajes específicos de sesión expirada del backend
      if (data.error.toLowerCase().includes('sesión') || 
          data.error.toLowerCase().includes('no autenticado') ||
          data.error.toLowerCase().includes('no autorizado')) {
        console.log('🔒 Error de autenticación detectado:', data.error)
        if (onSessionExpired) {
          onSessionExpired()
        }
      }
      throw new Error(data.error)
    }
    
    if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`)
    return data
  } catch (err) {
    // JSON parse failed or server returned text
    if (!res.ok) throw new Error(text || err.message)
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }
}

export default {
  async login({ email, password }) {
    try {
      return await request('/logins.php', { method: 'POST', body: { email, password } })
    } catch (err) {
      console.error('login error', err.message)
      throw err
    }
  },

  async listarCursos() {
    return await request('/admins.php?accion=listar_cursos')
  }
,

  async listarTemas(cursoId) {
    // alumnos.php?action=listar_temas expects curso_id param
    return await request(`/alumnos.php?accion=listar_temas&curso_id=${cursoId}`)
  },

  async detalleActividad(id) {
    return await request(`/alumnos.php?accion=detalle_actividad&id=${id}`)
  },

  async guardarEntrega(actividadId, contenido) {
    return await request('/alumnos.php', { method: 'POST', body: { accion: 'guardar_entrega', actividad_id: actividadId, contenido } })
  },

  // Admin endpoints
  async crearUsuario({ nombre, email, password, rol }) {
    return await request('/admins.php', { method: 'POST', body: { accion: 'crear_usuario', nombre, email, password, rol } })
  },

  async crearCurso({ nombre, descripcion }) {
    return await request('/admins.php', { method: 'POST', body: { accion: 'crear_curso', nombre, descripcion } })
  },

  // Docente endpoints
  async listarCursosDocente() {
    return await request('/docentes.php?accion=listar_cursos')
  },

  async crearTema({ curso_id, titulo, descripcion }) {
    return await request('/docentes.php', { method: 'POST', body: { accion: 'crear_tema', curso_id, titulo, descripcion } })
  },

  async listarTemasDocente(cgsId) {
    return await request(`/docentes.php?accion=listar_temas&cgs_id=${cgsId}`)
  },

  // Temas endpoints (docente)
  async detalleTema(temaId) {
    return await request(`/temas.php?accion=detalle_tema&id=${temaId}`)
  },

  async listarCriterios(temaId) {
    return await request(`/temas.php?accion=listar_criterios&tema_id=${temaId}`)
  },

  async listarAlumnosConEntregas(temaId) {
    return await request(`/temas.php?accion=listar_alumnos&tema_id=${temaId}`)
  },

  async detalleEntrega(entregaId) {
    return await request(`/temas.php?accion=detalle_entrega&id=${entregaId}`)
  },

  async editarEntrega({ entrega_id, calificacion, comentario_docente }) {
    return await request('/temas.php', { method: 'POST', body: { accion: 'editar_entrega', entrega_id, calificacion, comentario_docente } })
  },

  // Admin - Configurar usuario
  async buscarUsuario(query) {
    return await request(`/admins.php?accion=buscar_usuario&query=${encodeURIComponent(query)}`)
  },

  async getConfiguracionUsuario(usuarioId) {
    return await request(`/admins.php?accion=get_configuracion&usuario_id=${usuarioId}`)
  },

  async listarGradosSeccionesConfig(cursoId) {
    return await request(`/admins.php?accion=get_configuracion&curso_id=${cursoId}`)
  },

  async configurarUsuario({ usuario_id, rol, grado, seccion, curso_id, curso_grado_seccion_ids }) {
    return await request('/admins.php', { method: 'POST', body: { accion: 'configurar_usuario', usuario_id, rol, grado, seccion, curso_id, curso_grado_seccion_ids } })
  },

  // Admin - Configurar curso
  async configurarCurso({ curso_id, grados, secciones }) {
    return await request('/admins.php', { method: 'POST', body: { accion: 'configurar_curso', curso_id, grados, secciones } })
  },

  // Docente - Editar tema
  async editarTema({ id, titulo, descripcion, estado }) {
    return await request('/temas.php', { method: 'POST', body: { accion: 'editar_tema', id, titulo, descripcion, estado } })
  },

  async generarLista(temaId) {
    return await request('/temas.php', { method: 'POST', body: { accion: 'generar_lista', tema_id: temaId } })
  },

  // Alumno - Grado y sección
  async listarGradoSeccion(alumnoId) {
    return await request(`/alumnos.php?accion=listar_grado_seccion&alumno_id=${alumnoId}`)
  },

  async listarCursosAlumno(alumnoId) {
    return await request(`/alumnos.php?accion=listar_cursos&alumno_id=${alumnoId}`)
  },

  async listarTemasCalificaciones(alumnoId, cursoGradoId) {
    return await request(`/alumnos.php?accion=listar_temas_calificaciones&alumno_id=${alumnoId}&curso_grado_id=${cursoGradoId}`)
  },

  // Admin - Visualizar cursos
  async visualizarCursos({ grado, seccion }) {
    const params = new URLSearchParams()
    if (grado) params.append('grado', grado)
    if (seccion) params.append('seccion', seccion)
    return await request(`/admins.php?accion=visualizar_cursos&${params.toString()}`)
  },

  // Docente - Grados y secciones
  async listarGradosSecciones(cursoId) {
    return await request(`/docentes.php?accion=listar_grados_secciones&curso_id=${cursoId}`)
  },

  // Docente - Generar criterios
  async generarCriterios(temaId, criterios) {
    return await request('/temas.php', { method: 'POST', body: { accion: 'guardar_criterios', tema_id: temaId, criterios } })
  }
}
