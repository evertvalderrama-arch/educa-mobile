/**
 * Logger centralizado para la aplicación
 * Solo activa en modo desarrollo (__DEV__)
 * 
 * Para cambiar a producción: configura __DEV__ = false en app.json o build config
 */

const IS_DEV = __DEV__

const logger = {
  log: (...args) => {
    if (IS_DEV) {
      console.log(...args)
    }
  },

  error: (...args) => {
    if (IS_DEV) {
      console.error(...args)
    }
  },

  warn: (...args) => {
    if (IS_DEV) {
      console.warn(...args)
    }
  },

  info: (...args) => {
    if (IS_DEV) {
      console.info(...args)
    }
  },

  // Logs críticos que siempre se muestran (incluso en producción)
  critical: (...args) => {
    console.error('[CRITICAL]', ...args)
  }
}

export default logger
