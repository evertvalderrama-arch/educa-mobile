import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'
import CustomPicker from '../components/CustomPicker'

export default function DocenteHomeScreen({ navigation, user, onLogout }) {
  const [cursos, setCursos] = useState(null)
  const [cursoSeleccionado, setCursoSeleccionado] = useState('')
  const [gradosSecciones, setGradosSecciones] = useState([])
  const [gsSeleccionado, setGsSeleccionado] = useState('')
  const [temas, setTemas] = useState([])
  const [mostrandoTemas, setMostrandoTemas] = useState(false)

  useEffect(() => {
    console.log('🎓 DocenteHomeScreen montado - Usuario:', user?.nombre, '- Rol:', user?.rol)
    let mounted = true
    api.listarCursosDocente().then(data => {
      if (mounted) {
        console.log('📚 Cursos cargados para docente:', data?.length || 0)
        setCursos(data)
      }
    }).catch(() => {
      if (mounted) setCursos([])
    })
    return () => mounted = false
  }, [])

  const cargarGradosSecciones = async (cursoId) => {
    try {
      console.log('📋 Cargando grados/secciones para curso:', cursoId)
      const data = await api.listarGradosSecciones(cursoId)
      console.log('📋 Grados/secciones cargados:', data?.length || 0)
      setGradosSecciones(data || [])
      setGsSeleccionado('')
      setTemas([])
      setMostrandoTemas(false)
    } catch (err) {
      console.error('❌ Error cargando grados/secciones:', err)
      setGradosSecciones([])
    }
  }

  const mostrarResultados = async () => {
    if (!gsSeleccionado) {
      Alert.alert('Aviso', 'Seleccione un grado y sección primero')
      return
    }
    try {
      console.log('📖 Cargando temas para grado/sección:', gsSeleccionado)
      const data = await api.listarTemasDocente(gsSeleccionado)
      console.log('📖 Temas cargados:', data?.length || 0)
      setTemas(data || [])
      setMostrandoTemas(true)
    } catch (err) {
      console.error('❌ Error cargando temas:', err)
      Alert.alert('Error', 'No se pudieron cargar los temas')
      setTemas([])
    }
  }

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Hola, {user.nombre}</Text>
          <Text style={styles.roleText}>Docente</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Selector de Curso y Grado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Mis Cursos</Text>
        
        <CustomPicker
          label="Seleccionar curso"
          selectedValue={cursoSeleccionado}
          onValueChange={(value) => {
            setCursoSeleccionado(value)
            setTemas([])
            setMostrandoTemas(false)
            if (value) cargarGradosSecciones(value)
          }}
          items={[
            { label: 'Seleccione un curso', value: '' },
            ...(cursos || []).map(c => ({ label: c.nombre, value: String(c.id) }))
          ]}
          placeholder="Seleccione un curso"
        />

        {gradosSecciones.length > 0 && (
          <>
            <CustomPicker
              label="Grado y Sección"
              selectedValue={gsSeleccionado}
              onValueChange={(value) => {
                setGsSeleccionado(value)
                setTemas([])
                setMostrandoTemas(false)
              }}
              items={[
                { label: 'Seleccione grado/sección', value: '' },
                ...gradosSecciones.map(gs => ({ label: `${gs.grado} - ${gs.seccion}`, value: String(gs.id) }))
              ]}
              placeholder="Seleccione grado/sección"
            />
            
            <TouchableOpacity style={styles.mostrarButton} onPress={mostrarResultados}>
              <Text style={styles.mostrarButtonText}>📊 Mostrar Resultados</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Cabecera de temas */}
      {mostrandoTemas && (
        <View style={styles.temasSection}>
          <View style={styles.temasHeader}>
            <Text style={styles.temasTitle}>📋 Temas del Curso</Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => navigation.navigate('CreateTema', { cursoGradoSeccionId: gsSeleccionado })}
            >
              <Text style={styles.addButtonText}>+ Agregar tema</Text>
            </TouchableOpacity>
          </View>

          {temas.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📭 No hay temas registrados</Text>
            </View>
          )}
        </View>
      )}
    </>
  )

  const renderTema = ({ item: tema }) => (
    <View style={styles.temaCard}>
      <View style={styles.temaHeader}>
        <Text style={styles.temaTitulo}>{tema.titulo}</Text>
        <View style={[
          styles.estadoBadge,
          tema.estado === 'abierto' ? styles.estadoAbierto : styles.estadoCerrado
        ]}>
          <Text style={styles.estadoText}>
            {tema.estado === 'abierto' ? '✓ Activo' : '✕ Cerrado'}
          </Text>
        </View>
      </View>
      
      {tema.descripcion && (
        <Text style={styles.temaDescripcion} numberOfLines={2}>
          {tema.descripcion}
        </Text>
      )}
      
      <View style={styles.temaFooter}>
        <Text style={styles.temaFecha}>
          📅 {new Date(tema.creado_en).toLocaleDateString()}
        </Text>
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => {
            console.log('🔍 Navegando a EditarTema con temaId:', tema.id)
            navigation.navigate('EditarTema', { temaId: tema.id })
          }}
        >
          <Text style={styles.detailButtonText}>Ver detalles →</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (!user) {
    return <View style={styles.container}><Text>Cargando...</Text></View>
  }

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={renderHeader}
      data={mostrandoTemas ? temas : []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderTema}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      contentContainerStyle={styles.flatListContent}
    />
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.secondaryLight 
  },
  flatListContent: {
    flexGrow: 1
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
    marginBottom: spacing.xs
  },
  roleText: {
    fontSize: 14,
    color: colors.secondaryLight,
    fontWeight: '600'
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
  temasSection: {
    margin: spacing.lg,
    marginTop: 0
  },
  temasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 8,
    elevation: 3
  },
  temasTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1
  },
  addButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6
  },
  addButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 14
  },
  emptyContainer: {
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
    elevation: 1
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic'
  },
  temaCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    elevation: 3
  },
  temaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm
  },
  temaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm
  },
  estadoBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12
  },
  estadoAbierto: {
    backgroundColor: colors.success
  },
  estadoCerrado: {
    backgroundColor: colors.textMuted
  },
  estadoText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: 'bold'
  },
  temaDescripcion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20
  },
  temaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight
  },
  temaFecha: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500'
  },
  detailButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6
  },
  detailButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 14
  }
})
