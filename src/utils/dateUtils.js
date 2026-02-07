/**
 * Utilidades para manejo de fechas con zona horaria de Perú (America/Lima, UTC-5)
 * Todas las fechas del servidor se interpretan como hora de Lima
 */

// Offset de Lima en minutos (UTC-5 = -300 minutos)
const LIMA_OFFSET_MINUTES = -300

/**
 * Parsea una fecha string del servidor como si fuera hora de Lima
 * @param {string} fechaString - Fecha en formato "YYYY-MM-DD HH:MM:SS" o ISO
 * @returns {Date} Objeto Date ajustado a zona horaria de Lima
 */
export const parseFechaLima = (fechaString) => {
  if (!fechaString) return null
  
  // Crear fecha SIN zona horaria (será interpretada como UTC)
  const fecha = new Date(fechaString.replace(' ', 'T'))
  
  // Obtener offset local del dispositivo
  const offsetLocalMinutos = fecha.getTimezoneOffset()
  
  // Calcular diferencia entre Lima y zona local
  // getTimezoneOffset() es negativo al este de UTC, positivo al oeste
  const diferencia = offsetLocalMinutos - LIMA_OFFSET_MINUTES
  
  // Ajustar la fecha
  fecha.setMinutes(fecha.getMinutes() - diferencia)
  
  return fecha
}

/**
 * Obtiene la fecha/hora actual en zona horaria de Lima
 * @returns {Date} Fecha actual ajustada a Lima
 */
export const obtenerFechaActualLima = () => {
  const ahora = new Date()
  const offsetLocal = ahora.getTimezoneOffset()
  const diferencia = offsetLocal - LIMA_OFFSET_MINUTES
  
  const fechaLima = new Date(ahora.getTime() - (diferencia * 60000))
  return fechaLima
}

/**
 * Formatea una fecha para visualización en español (Perú)
 * @param {string|Date} fecha - Fecha a formatear
 * @param {object} opciones - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export const formatearFechaLima = (fecha, opciones = {}) => {
  if (!fecha) return ''
  
  const fechaObj = typeof fecha === 'string' ? parseFechaLima(fecha) : fecha
  
  const opcionesDefecto = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...opciones
  }
  
  return fechaObj.toLocaleString('es-PE', opcionesDefecto)
}

/**
 * Verifica si una fecha límite está vigente (no ha expirado)
 * @param {string} fechaLimiteString - Fecha límite del servidor
 * @returns {boolean} true si aún está vigente, false si expiró
 */
export const estaVigente = (fechaLimiteString) => {
  if (!fechaLimiteString) return true
  
  const fechaLimite = parseFechaLima(fechaLimiteString)
  const ahora = obtenerFechaActualLima()
  
  return fechaLimite >= ahora
}

/**
 * Verifica si una fecha límite ha expirado
 * @param {string} fechaLimiteString - Fecha límite del servidor
 * @returns {boolean} true si expiró, false si aún está vigente
 */
export const haExpirado = (fechaLimiteString) => {
  if (!fechaLimiteString) return false
  return !estaVigente(fechaLimiteString)
}

/**
 * Formatea fecha para enviar a la base de datos
 * @param {Date} fecha - Objeto Date
 * @returns {string} Fecha en formato "YYYY-MM-DD HH:MM:SS"
 */
export const formatearParaDB = (fecha) => {
  if (!fecha) return null
  
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  const hours = String(fecha.getHours()).padStart(2, '0')
  const minutes = String(fecha.getMinutes()).padStart(2, '0')
  const seconds = String(fecha.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Convierte fecha Date ajustada a Lima para visualización legible
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha legible en español
 */
export const fechaLegible = (fecha) => {
  if (!fecha) return ''
  
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
  
  return fecha.toLocaleString('es-PE', opciones)
}
