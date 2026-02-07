import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'
import CustomPicker from '../components/CustomPicker'

export default function AlumnoHomeScreen({ navigation, user, onLogout }) {
  const [gradoSeccion, setGradoSeccion] = useState('')
  const [cursos, setCursos] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState('')
  const [temas, setTemas] = useState([])
  const [mostrandoCalificaciones, setMostrandoCalificaciones] = useState(false)

  // Modal para actividad
  const [modalVisible, setModalVisible] = useState(false)
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null)
  const [contenido, setContenido] = useState('')

  useEffect(() => {
    if (user?.id) {
      console.log('👤 Usuario alumno:', user)
      cargarDatosAlumno(user.id)
    }
  }, [user])

  const cargarDatosAlumno = async (alumnoId) => {
    try {
      // Cargar grado y sección
      const gs = await api.listarGradoSeccion(alumnoId)
      if (gs) {
        setGradoSeccion(`${gs.grado} - ${gs.seccion}`)
        console.log('📋 Grado y sección:', gs)
      }

      // Cargar cursos del alumno
      const cursosData = await api.listarCursosAlumno(alumnoId)
      setCursos(cursosData || [])
      console.log('📚 Cursos cargados:', cursosData)
    } catch (err) {
      console.error('Error cargando datos alumno:', err)
      Alert.alert('Error', 'No se pudieron cargar los datos')
    }
  }

  const mostrarCalificaciones = async () => {
    if (!cursoSeleccionado) {
      Alert.alert('Aviso', 'Seleccione un curso primero')
      return
    }

    try {
      console.log('🔍 Cargando temas para curso_id:', cursoSeleccionado)
      const temasData = await api.listarTemas(cursoSeleccionado)
      console.log('📖 Temas recibidos:', temasData)

      // Agrupar por tema_id
      const agrupados = {}
      temasData.forEach(t => {
        if (!agrupados[t.id]) {
          agrupados[t.id] = { 
            id: t.id, 
            titulo: t.titulo, 
            actividades: {} 
          }
        }
        agrupados[t.id].actividades[t.tipo] = {
          actividad_id: t.actividad_id,
          tipo: t.tipo,
          titulo: t.actividad_titulo,
          descripcion: t.descripcion,
          requiere_entrega: t.requiere_entrega,
          fecha_limite: t.fecha_limite,
          enlace: t.enlace,
          entrega_id: t.entrega_id,
          calificacion: t.calificacion,
          comentario_docente: t.comentario_docente,
          contenido: t.contenido
        }
      })

      setTemas(Object.values(agrupados))
      setMostrandoCalificaciones(true)
      console.log('✅ Temas agrupados:', Object.values(agrupados).length)
    } catch (err) {
      console.error('❌ Error cargando temas:', err)
      Alert.alert('Error', 'No se pudieron cargar las calificaciones')
      setTemas([])
    }
  }

  const abrirModalActividad = async (actividad) => {
    try {
      console.log('🔍 Abriendo actividad:', actividad)
      
      // Cargar detalles completos
      const detalle = await api.detalleActividad(actividad.actividad_id)
      console.log('📋 Detalle actividad:', detalle)
      
      setActividadSeleccionada({ ...actividad, ...detalle })
      setContenido(detalle.contenido || '')
      setModalVisible(true)
    } catch (err) {
      console.error('❌ Error cargando actividad:', err)
      // Usar los datos que ya tenemos
      setActividadSeleccionada(actividad)
      setContenido(actividad.contenido || '')
      setModalVisible(true)
    }
  }

  const guardarEntrega = async () => {
    if (!actividadSeleccionada?.actividad_id) {
      Alert.alert('Error', 'No hay actividad seleccionada')
      return
    }

    try {
      console.log('💾 Guardando entrega:', {
        actividad_id: actividadSeleccionada.actividad_id,
        contenido
      })

      await api.guardarEntrega(actividadSeleccionada.actividad_id, contenido)
      Alert.alert('Éxito', 'Entrega guardada correctamente')
      setModalVisible(false)
      // Recargar calificaciones
      mostrarCalificaciones()
    } catch (err) {
      console.error('❌ Error guardando entrega:', err)
      Alert.alert('Error', 'No se pudo guardar la entrega')
    }
  }

  const cerrarSesion = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const getActividadInfo = (tipo) => {
    const info = {
      'escrita': { icono: '✍️', label: 'Escrita' },
      'exposicion': { icono: '🎤', label: 'Exposición' },
      'participacion': { icono: '🙋', label: 'Participación' },
      'evaluacion': { icono: '📊', label: 'Evaluación' }
    }
    return info[tipo] || { icono: '📄', label: tipo }
  }

  const renderCeldaCard = (actividad) => {
    if (!actividad) {
      return <Text style={styles.celdaVaciaCard}>—</Text>
    }

    // Si ya tiene calificación
    if (actividad.calificacion) {
      return (
        <View style={styles.calificacionContainer}>
          <Text style={getCalificacionStyleCard(actividad.calificacion)}>
            {actividad.calificacion}
          </Text>
          {actividad.comentario_docente && (
            <Text style={styles.iconoComentarioCard}>💬</Text>
          )}
        </View>
      )
    }

    // No requiere entrega (solo evaluación del docente)
    if (actividad.requiere_entrega == 0) {
      return (
        <View style={styles.calificacionContainer}>
          <Text style={styles.celdaVaciaCard}>—</Text>
          <Text style={styles.celdaEsperaCard}>⏳</Text>
        </View>
      )
    }

    // Requiere entrega
    if (actividad.requiere_entrega == 1) {
      const vigente = actividad.fecha_limite 
        ? new Date(actividad.fecha_limite) >= new Date() 
        : true

      if (vigente) {
        return (
          <View style={styles.calificacionContainer}>
            <Text style={styles.celdaVaciaCard}>—</Text>
            <Text style={styles.botonTextoCard}>📝</Text>
          </View>
        )
      } else {
        return (
          <View style={styles.calificacionContainer}>
            <Text style={styles.celdaVaciaCard}>—</Text>
            <Text style={styles.botonTextoDisabledCard}>⛔</Text>
          </View>
        )
      }
    }

    return <Text style={styles.celdaVaciaCard}>—</Text>
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Hola, {user.nombre}</Text>
          <View style={styles.gradoSeccionContainer}>
            <Text style={styles.gradoSeccionLabel}>Grado:</Text>
            <Text style={styles.gradoSeccionValue}>{gradoSeccion.split('-')[0]?.trim() || '—'}</Text>
            <Text style={styles.gradoSeccionLabel}>Sección:</Text>
            <Text style={styles.gradoSeccionValue}>{gradoSeccion.split('-')[1]?.trim() || '—'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Sección Cursos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Mis Cursos</Text>
        
        <CustomPicker
          label="Seleccionar curso"
          selectedValue={cursoSeleccionado}
          onValueChange={setCursoSeleccionado}
          items={[
            { label: 'Seleccione un curso', value: '' },
            ...cursos.map(c => ({ 
              label: c.curso_nombre, 
              value: String(c.curso_grado_id) 
            }))
          ]}
          placeholder="Seleccione un curso"
        />

        <TouchableOpacity 
          style={styles.mostrarButton} 
          onPress={mostrarCalificaciones}
        >
          <Text style={styles.mostrarButtonText}>📊 Mostrar Calificaciones</Text>
        </TouchableOpacity>
      </View>

      {/* Temas y Calificaciones */}
      {mostrandoCalificaciones && temas.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.infoText}>No hay temas disponibles para este curso</Text>
        </View>
      )}

      {mostrandoCalificaciones && temas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Temas y Calificaciones</Text>
          
          <FlatList
            data={temas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: tema }) => (
              <View style={styles.temaCard}>
                <View style={styles.temaHeader}>
                  <Text style={styles.temaTituloCard}>{tema.titulo}</Text>
                </View>
                
                <View style={styles.actividadesGrid}>
                  {['escrita', 'exposicion', 'participacion', 'evaluacion'].map(tipo => {
                    const actividadInfo = getActividadInfo(tipo)
                    const actividad = tema.actividades[tipo]
                    
                    return (
                      <TouchableOpacity 
                        key={tipo} 
                        style={styles.actividadItem}
                        onPress={() => actividad && abrirModalActividad(actividad)}
                        disabled={!actividad}
                      >
                        <Text style={styles.actividadIcono}>{actividadInfo.icono}</Text>
                        <Text style={styles.actividadLabel}>{actividadInfo.label}</Text>
                        {renderCeldaCard(actividad)}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            scrollEnabled={false}
            contentContainerStyle={styles.temasCards}
          />
        </View>
      )}

      {/* Modal Actividad */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {actividadSeleccionada?.titulo || 'Actividad'}
              </Text>

              {actividadSeleccionada?.descripcion && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Descripción:</Text>
                  <Text style={styles.modalText}>{actividadSeleccionada.descripcion}</Text>
                </View>
              )}

              {actividadSeleccionada?.fecha_limite && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Fecha límite:</Text>
                  <Text style={styles.modalText}>
                    {new Date(actividadSeleccionada.fecha_limite).toLocaleString('es-PE')}
                  </Text>
                </View>
              )}

              {actividadSeleccionada?.enlace && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Enlace:</Text>
                  <Text style={[styles.modalText, styles.enlaceText]}>
                    {actividadSeleccionada.enlace}
                  </Text>
                </View>
              )}

              {actividadSeleccionada?.calificacion && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Calificación:</Text>
                  <Text style={getCalificacionStyle(actividadSeleccionada.calificacion)}>
                    {actividadSeleccionada.calificacion}
                  </Text>
                </View>
              )}

              {actividadSeleccionada?.comentario_docente && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Comentario del docente:</Text>
                  <View style={styles.comentarioBox}>
                    <Text style={styles.modalText}>{actividadSeleccionada.comentario_docente}</Text>
                  </View>
                </View>
              )}

              {/* Campo de entrega solo si requiere_entrega=1 y no está calificado */}
              {actividadSeleccionada?.requiere_entrega == 1 && !actividadSeleccionada?.calificacion && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Tu entrega:</Text>
                  <TextInput
                    style={styles.textarea}
                    value={contenido}
                    onChangeText={setContenido}
                    placeholder="Escribe tu respuesta aquí..."
                    multiline
                    numberOfLines={5}
                    editable={
                      !actividadSeleccionada.fecha_limite || 
                      new Date(actividadSeleccionada.fecha_limite) >= new Date()
                    }
                  />
                </View>
              )}

              {/* Mostrar contenido si ya fue entregado */}
              {actividadSeleccionada?.contenido && actividadSeleccionada?.calificacion && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Tu entrega:</Text>
                  <View style={styles.comentarioBox}>
                    <Text style={styles.modalText}>{actividadSeleccionada.contenido}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>

              {actividadSeleccionada?.requiere_entrega == 1 && 
               !actividadSeleccionada?.calificacion &&
               (!actividadSeleccionada.fecha_limite || 
                new Date(actividadSeleccionada.fecha_limite) >= new Date()) && (
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={guardarEntrega}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const getCalificacionStyle = (cal) => {
  const styles = {
    'AD': { color: colors.success, fontWeight: 'bold', fontSize: 16 },
    'A': { color: colors.info, fontWeight: 'bold', fontSize: 16 },
    'B': { color: colors.warning, fontWeight: 'bold', fontSize: 16 },
    'C': { color: colors.error, fontWeight: 'bold', fontSize: 16 }
  }
  return styles[cal] || { color: colors.textMuted, fontSize: 14 }
}

const getCalificacionStyleCard = (cal) => {
  const styles = {
    'AD': { color: colors.success, fontWeight: 'bold', fontSize: 24 },
    'A': { color: colors.info, fontWeight: 'bold', fontSize: 24 },
    'B': { color: colors.warning, fontWeight: 'bold', fontSize: 24 },
    'C': { color: colors.error, fontWeight: 'bold', fontSize: 24 }
  }
  return styles[cal] || { color: colors.textMuted, fontSize: 18 }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryLight
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    elevation: 4
  },
  headerContent: {
    marginBottom: spacing.md
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: spacing.sm
  },
  gradoSeccionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  gradoSeccionLabel: {
    fontSize: 14,
    color: colors.secondaryLight,
    fontWeight: 'bold'
  },
  gradoSeccionValue: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: spacing.md
  },
  logoutButton: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  logoutButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14
  },
  section: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 8,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md
  },
  mostrarButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: spacing.md
  },
  mostrarButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  temasCards: {
    gap: spacing.md
  },
  temaCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  temaHeader: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  temaTituloCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary
  },
  actividadesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
    columnGap: spacing.sm
  },
  actividadItem: {
    width: '48%',
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100
  },
  actividadIcono: {
    fontSize: 24,
    marginBottom: spacing.xs
  },
  actividadLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs
  },
  celdaVaciaCard: {
    fontSize: 18,
    color: colors.textMuted
  },
  celdaEsperaCard: {
    fontSize: 28
  },
  calificacionContainer: {
    alignItems: 'center'
  },
  iconoComentarioCard: {
    fontSize: 16,
    marginTop: spacing.xs
  },
  botonTextoCard: {
    fontSize: 16,
    color: colors.info,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  botonTextoDisabledCard: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    elevation: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.lg
  },
  modalSection: {
    marginBottom: spacing.md
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs
  },
  modalText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20
  },
  enlaceText: {
    color: colors.info,
    textDecorationLine: 'underline'
  },
  comentarioBox: {
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: spacing.md,
    backgroundColor: colors.background,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 100
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.textMuted,
    padding: spacing.md,
    borderRadius: 6,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 14
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: 6,
    alignItems: 'center'
  },
  saveButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 14
  }
})
