import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import api from '../api'
import { colors, spacing } from '../theme'
import CustomPicker from '../components/CustomPicker'

export default function EditarTemaScreen({ route, navigation }) {
  const { temaId } = route.params
  const [tema, setTema] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('abierto')
  const [alumnos, setAlumnos] = useState([])
  const [criterios, setCriterios] = useState([])
  const [listaGenerada, setListaGenerada] = useState(false)
  
  // Modales
  const [modalEditarVisible, setModalEditarVisible] = useState(false)
  const [modalEntregaVisible, setModalEntregaVisible] = useState(false)
  const [entregaSeleccionada, setEntregaSeleccionada] = useState(null)
  const [calificacion, setCalificacion] = useState('')
  const [comentario, setComentario] = useState('')

  useFocusEffect(
    React.useCallback(() => {
      cargarDatos()
    }, [temaId])
  )

  const cargarDatos = async () => {
    try {
      const detalle = await api.detalleTema(temaId)
      setTema(detalle)
      setTitulo(detalle.titulo || '')
      setDescripcion(detalle.descripcion || '')
      setEstado(detalle.estado || 'abierto')

      const crit = await api.listarCriterios(temaId)
      setCriterios(crit || [])

      const alums = await api.listarAlumnosConEntregas(temaId)
      
      // Verificar si la lista fue generada: al menos una entrega con ID válido
      const tieneEntregas = alums && alums.length > 0 && alums.some(alumno => {
        if (!alumno.entregas) return false
        return Object.values(alumno.entregas).some(entrega => entrega && entrega.id)
      })
      
      console.log('🔍 Verificación lista generada:', {
        alumnosLength: alums?.length || 0,
        tieneEntregas,
        primerAlumno: alums?.[0],
        primeraEntrega: alums?.[0]?.entregas
      })
      
      setListaGenerada(tieneEntregas)
      
      // Solo guardar alumnos si la lista fue generada
      if (tieneEntregas) {
        setAlumnos(alums || [])
      } else {
        setAlumnos([])
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar el tema')
    }
  }

  const guardarEdicion = async () => {
    try {
      await api.editarTema({
        id: temaId,
        titulo,
        descripcion,
        estado
      })
      Alert.alert('Éxito', 'Tema actualizado')
      setModalEditarVisible(false)
      cargarDatos()
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el tema')
    }
  }

  const generarLista = async () => {
    if (criterios.length === 0) {
      Alert.alert('Error', 'Debe generar criterios primero')
      return
    }
    
    try {
      await api.generarLista(temaId)
      Alert.alert('Éxito', 'Lista generada para todos los alumnos')
      cargarDatos()
    } catch (err) {
      Alert.alert('Error', 'No se pudo generar la lista')
    }
  }

  const abrirModalEntrega = async (entrega, tipo) => {
    try {
      // Cargar detalles completos de la entrega incluyendo contenido
      const detalleEntrega = await api.detalleEntrega(entrega.id)
      setEntregaSeleccionada({ ...detalleEntrega, tipo })
      setCalificacion(detalleEntrega?.calificacion || '')
      setComentario(detalleEntrega?.comentario_docente || '')
      setModalEntregaVisible(true)
    } catch (err) {
      // Si falla, usar los datos básicos que ya tenemos
      setEntregaSeleccionada({ ...entrega, tipo })
      setCalificacion(entrega?.calificacion || '')
      setComentario(entrega?.comentario_docente || '')
      setModalEntregaVisible(true)
    }
  }

  const guardarEntrega = async () => {
    if (!entregaSeleccionada?.id) {
      Alert.alert('Error', 'No hay entrega seleccionada')
      return
    }
    
    if (!calificacion) {
      Alert.alert('Advertencia', 'Debe seleccionar una calificación')
      return
    }

    console.log('📝 Guardando entrega:', {
      entrega_id: entregaSeleccionada.id,
      calificacion,
      comentario_docente: comentario
    })

    try {
      const resultado = await api.editarEntrega({
        entrega_id: entregaSeleccionada.id,
        calificacion,
        comentario_docente: comentario
      })
      console.log('✅ Resultado guardar entrega:', resultado)
      Alert.alert('Éxito', 'Calificación guardada')
      setModalEntregaVisible(false)
      cargarDatos()
    } catch (err) {
      console.error('❌ Error al guardar entrega:', err)
      Alert.alert('Error', 'No se pudo guardar la calificación: ' + err.message)
    }
  }

  if (!tema) return <View style={styles.container}><Text>Cargando...</Text></View>

  const renderHeader = () => (
    <>
      {/* Header con estado y título */}
      <View style={styles.headerSection}>
        <View style={[
          styles.estadoBadge,
          estado === 'abierto' ? styles.estadoAbierto : styles.estadoCerrado
        ]}>
          <Text style={styles.estadoText}>
            {estado === 'abierto' ? '✓ Activo' : '✕ Cerrado'}
          </Text>
        </View>
        <Text style={styles.title}>{titulo}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setModalEditarVisible(true)}
          >
            <Text style={styles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.criteriosButton}
            onPress={() => {
              navigation.navigate('GenerarCriterios', { temaId })
            }}
          >
            <Text style={styles.criteriosButtonText}>
              {criterios.length > 0 ? '📋 Editar criterios' : '📋 Generar criterios'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección Lista de alumnos */}
      <View style={styles.alumnosSectionHeader}>
        <Text style={styles.sectionTitle}>Lista de alumnos</Text>
        
        <TouchableOpacity 
          style={[styles.generarButton, criterios.length === 0 && styles.generarButtonDisabled]}
          onPress={generarLista}
          disabled={criterios.length === 0}
        >
          <Text style={styles.generarButtonText}>
            {criterios.length === 0 
              ? '⚠️ Debe generar criterios primero' 
              : listaGenerada 
                ? '🔄 Refrescar lista' 
                : '📝 Generar lista'}
          </Text>
        </TouchableOpacity>

        {!listaGenerada && criterios.length > 0 && (
          <Text style={styles.infoWarning}>
            ⚠️ Presione "Generar lista" para crear las entregas de los alumnos
          </Text>
        )}
        
        {listaGenerada && (
          <Text style={styles.infoSuccess}>
            ℹ️ Use "Refrescar lista" si hay nuevos alumnos inscritos
          </Text>
        )}
      </View>
    </>
  )

  const renderAlumnoItem = ({ item: alumno }) => (
    <View style={styles.alumnoCard}>
      {/* Nombre del alumno */}
      <View style={styles.alumnoHeader}>
        <Text style={styles.alumnoNombre}>🧑 {alumno.nombre}</Text>
      </View>
      
      {/* Grid de calificaciones 2x2 */}
      <View style={styles.calificacionesGrid}>
        {[
          { tipo: 'escrita', icono: '✍️', label: 'Escrita' },
          { tipo: 'exposicion', icono: '🎤', label: 'Exposición' },
          { tipo: 'participacion', icono: '🙋', label: 'Participación' },
          { tipo: 'evaluacion', icono: '📊', label: 'Evaluación' }
        ].map(({ tipo, icono, label }) => {
          const entrega = alumno.entregas?.[tipo]
          return (
            <TouchableOpacity
              key={tipo}
              style={styles.calificacionItem}
              onPress={() => entrega && abrirModalEntrega(entrega, tipo)}
            >
              <Text style={styles.calificacionIcono}>{icono}</Text>
              <Text style={styles.calificacionLabel}>{label}</Text>
              <Text style={getCalificacionStyleCard(entrega?.calificacion)}>
                {entrega?.calificacion || '—'}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={listaGenerada ? alumnos : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAlumnoItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={null}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Modal Editar Tema */}
      <Modal
        visible={modalEditarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar tema</Text>
            
            <Text style={styles.label}>Título</Text>
            <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />

            <CustomPicker
              label="Estado"
              selectedValue={estado}
              onValueChange={setEstado}
              items={[
                { label: 'Activo', value: 'abierto' },
                { label: 'Cerrado', value: 'cerrado' },
              ]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalEditarVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={guardarEdicion}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Calificar Entrega */}
      <Modal
        visible={modalEntregaVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalEntregaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calificar entrega - {entregaSeleccionada?.tipo}</Text>
            
            {entregaSeleccionada?.contenido && (
              <View style={styles.contenidoSection}>
                <Text style={styles.label}>Mensaje de Alumno:</Text>
                <View style={styles.contenidoBox}>
                  <Text style={styles.contenidoText}>{entregaSeleccionada.contenido}</Text>
                </View>
              </View>
            )}

            <CustomPicker
              label="Calificación"
              selectedValue={calificacion}
              onValueChange={setCalificacion}
              items={[
                { label: 'Seleccione...', value: '' },
                { label: 'AD - Logro Destacado', value: 'AD' },
                { label: 'A - Logro Esperado', value: 'A' },
                { label: 'B - En Proceso', value: 'B' },
                { label: 'C - En Inicio', value: 'C' },
              ]}
            />

            <Text style={styles.label}>Comentario del docente</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={comentario}
              onChangeText={setComentario}
              multiline
              placeholder="Comentario opcional..."
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalEntregaVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={guardarEntrega}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const getCalificacionStyle = (cal) => {
  if (!cal) return { color: colors.textMuted, fontSize: 14 }
  const styleMap = {
    'AD': { color: colors.success, fontWeight: 'bold', fontSize: 16 },
    'A': { color: colors.info, fontWeight: 'bold', fontSize: 16 },
    'B': { color: colors.warning, fontWeight: 'bold', fontSize: 16 },
    'C': { color: colors.error, fontWeight: 'bold', fontSize: 16 }
  }
  return styleMap[cal] || { color: colors.textMuted, fontSize: 14 }
}

const getCalificacionStyleCard = (cal) => {
  if (!cal) return { color: colors.textMuted, fontSize: 20, fontWeight: 'bold' }
  const styleMap = {
    'AD': { color: colors.success, fontWeight: 'bold', fontSize: 24 },
    'A': { color: colors.info, fontWeight: 'bold', fontSize: 24 },
    'B': { color: colors.warning, fontWeight: 'bold', fontSize: 24 },
    'C': { color: colors.error, fontWeight: 'bold', fontSize: 24 }
  }
  return styleMap[cal] || { color: colors.textMuted, fontSize: 20, fontWeight: 'bold' }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.secondaryLight 
  },
  flatListContent: {
    padding: spacing.lg,
  },
  headerSection: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.lg,
    elevation: 3
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    marginBottom: spacing.sm
  },
  estadoAbierto: {
    backgroundColor: colors.success
  },
  estadoCerrado: {
    backgroundColor: colors.textMuted
  },
  estadoText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: 'bold'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: spacing.md,
    color: colors.primary
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.warning,
    padding: spacing.sm,
    borderRadius: 6,
    alignItems: 'center'
  },
  editButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 14
  },
  criteriosButton: {
    flex: 1,
    backgroundColor: colors.info,
    padding: spacing.sm,
    borderRadius: 6,
    alignItems: 'center'
  },
  criteriosButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 14
  },
  alumnosSectionHeader: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.md,
    elevation: 3
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: spacing.md,
    color: colors.primary
  },
  generarButton: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  generarButtonDisabled: {
    backgroundColor: colors.textMuted
  },
  generarButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 14
  },
  info: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    fontStyle: 'italic', 
    textAlign: 'center',
    marginVertical: spacing.lg,
    padding: spacing.lg
  },
  infoWarning: {
    fontSize: 13,
    color: colors.warning,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.xs,
    backgroundColor: colors.secondaryLight,
    padding: spacing.sm,
    borderRadius: 6
  },
  infoSuccess: {
    fontSize: 13,
    color: colors.info,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.xs,
    backgroundColor: colors.secondaryLight,
    padding: spacing.sm,
    borderRadius: 6
  },
  alumnoCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    elevation: 3
  },
  alumnoHeader: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  alumnoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary
  },
  calificacionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  calificacionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  calificacionIcono: {
    fontSize: 24,
    marginBottom: spacing.xs
  },
  calificacionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600'
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: spacing.sm, 
    marginBottom: spacing.xs,
    color: colors.textPrimary
  },
  input: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 6, 
    padding: spacing.md, 
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    fontSize: 16,
    color: colors.textPrimary
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
    elevation: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.lg
  },
  contenidoSection: {
    marginBottom: spacing.md
  },
  contenidoBox: {
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 120
  },
  contenidoText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20
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
    backgroundColor: colors.primary,
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
