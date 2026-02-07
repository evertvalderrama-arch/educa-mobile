import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import api from '../api'
import { colors, spacing, commonStyles } from '../theme'
import CustomPicker from '../components/CustomPicker'

export default function ConfigurarUsuarioScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [cursos, setCursos] = useState([])

  // Campos de alumno
  const [grado, setGrado] = useState('1')
  const [seccion, setSeccion] = useState('A')

  // Campos de docente
  const [cursoDocente, setCursoDocente] = useState('')
  const [gradosSeccionesDisponibles, setGradosSeccionesDisponibles] = useState([])
  const [gradosSeccionesSeleccionados, setGradosSeccionesSeleccionados] = useState([])

  useEffect(() => {
    // Cargar lista de cursos para docentes
    api.listarCursos().then(data => setCursos(data || [])).catch(() => setCursos([]))
  }, [])

  const buscarUsuario = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Ingrese nombre o correo para buscar')
      return
    }
    try {
      const data = await api.buscarUsuario(searchQuery)
      
      // Verificar si hay error en la respuesta
      if (data && data.error) {
        Alert.alert('No encontrado', data.error)
        setUsuario(null)
        return
      }
      
      if (data && data.id) {
        setUsuario(data)
        
        // Cargar datos previos
        if (data.rol === 'alumno') {
          setGrado(data.grado || '1')
          setSeccion(data.seccion || 'A')
        } else if (data.rol === 'docente' && data.curso_id) {
          setCursoDocente(String(data.curso_id))
          cargarGradosSeccionesDocente(data.curso_id, data.id)
        }
      } else {
        Alert.alert('No encontrado', 'No se encontró el usuario')
        setUsuario(null)
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo buscar el usuario: ' + (err?.message || 'Error desconocido'))
      setUsuario(null)
    }
  }

  const cargarGradosSeccionesDocente = async (cursoId, docenteId = null) => {
    try {
      const data = await api.listarGradosSeccionesConfig(cursoId)
      setGradosSeccionesDisponibles(data || [])
      
      // Si hay docente, marcar los que ya tiene asignados
      if (docenteId) {
        const asignados = data.filter(gs => gs.docente_id === docenteId).map(gs => gs.id)
        setGradosSeccionesSeleccionados(asignados)
      } else {
        setGradosSeccionesSeleccionados([])
      }
    } catch (err) {
      setGradosSeccionesDisponibles([])
      setGradosSeccionesSeleccionados([])
    }
  }

  const toggleGradoSeccion = (id) => {
    if (gradosSeccionesSeleccionados.includes(id)) {
      setGradosSeccionesSeleccionados(gradosSeccionesSeleccionados.filter(x => x !== id))
    } else {
      setGradosSeccionesSeleccionados([...gradosSeccionesSeleccionados, id])
    }
  }

  const guardarConfiguracion = async () => {
    if (!usuario) return
    try {
      const body = {
        usuario_id: usuario.id,
        rol: usuario.rol
      }
      
      if (usuario.rol === 'alumno') {
        body.grado = grado
        body.seccion = seccion
      } else if (usuario.rol === 'docente') {
        if (!cursoDocente) {
          Alert.alert('Error', 'Debe seleccionar un curso para el docente')
          return
        }
        body.curso_id = cursoDocente
        body.curso_grado_seccion_ids = gradosSeccionesSeleccionados
      }
      
      await api.configurarUsuario(body)
      Alert.alert('Éxito', 'Usuario configurado correctamente')
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar la configuración')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configurar Usuario</Text>

      {/* Buscar usuario */}
      <View style={styles.section}>
        <Text style={styles.label}>Buscar por nombre o correo</Text>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Ingrese nombre o email"
        />
        <Button title="Buscar" onPress={buscarUsuario} color={colors.primary} />
      </View>

      {/* Mostrar datos del usuario encontrado */}
      {usuario && (
        <View style={styles.section}>
          <Text style={styles.label}>Usuario: {usuario.nombre}</Text>
          <Text>Email: {usuario.email}</Text>
          <Text>Rol: {usuario.rol}</Text>

          {/* Campos específicos para alumno */}
          {usuario.rol === 'alumno' && (
            <View style={styles.subsection}>
              <CustomPicker
                label="Grado"
                selectedValue={grado}
                onValueChange={setGrado}
                items={[
                  { label: '1°', value: '1' },
                  { label: '2°', value: '2' },
                  { label: '3°', value: '3' },
                  { label: '4°', value: '4' },
                  { label: '5°', value: '5' },
                ]}
              />

              <CustomPicker
                label="Sección"
                selectedValue={seccion}
                onValueChange={setSeccion}
                items={[
                  { label: 'A', value: 'A' },
                  { label: 'B', value: 'B' },
                  { label: 'C', value: 'C' },
                  { label: 'D', value: 'D' },
                ]}
              />
            </View>
          )}

          {/* Campos específicos para docente */}
          {usuario.rol === 'docente' && (
            <View style={styles.subsection}>
              <CustomPicker
                label="Curso"
                selectedValue={cursoDocente}
                onValueChange={(value) => {
                  setCursoDocente(value)
                  if (value) cargarGradosSeccionesDocente(value, usuario?.id)
                }}
                items={[
                  { label: 'Seleccione un curso', value: '' },
                  ...cursos.map(c => ({ label: c.nombre, value: String(c.id) }))
                ]}
                placeholder="Seleccione un curso"
              />

              {gradosSeccionesDisponibles.length > 0 && (
                <>
                  <Text style={styles.sublabel}>Grados y Secciones</Text>
                  <Text style={styles.info}>Seleccione los grados/secciones que impartirá este docente:</Text>
                  {gradosSeccionesDisponibles.map((gs) => (
                    <TouchableOpacity
                      key={gs.id}
                      style={[
                        styles.checkboxItem,
                        gradosSeccionesSeleccionados.includes(gs.id) && styles.checkboxItemSelected
                      ]}
                      onPress={() => toggleGradoSeccion(gs.id)}
                    >
                      <Text style={styles.checkboxText}>
                        {gradosSeccionesSeleccionados.includes(gs.id) ? '✓' : '○'} {gs.grado}° - {gs.seccion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
          )}

          <View style={{ height: 16 }} />
          <Button title="Guardar configuración" onPress={guardarConfiguracion} color={colors.primary} />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: spacing.lg, 
    backgroundColor: colors.secondaryLight 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: spacing.lg,
    color: colors.primary 
  },
  section: { 
    marginBottom: spacing.lg, 
    padding: spacing.md, 
    backgroundColor: colors.background, 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subsection: { 
    marginTop: spacing.md, 
    paddingTop: spacing.md, 
    borderTopWidth: 1, 
    borderTopColor: colors.borderLight 
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: spacing.sm,
    color: colors.primary
  },
  sublabel: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: spacing.sm, 
    marginBottom: spacing.xs,
    color: colors.textPrimary
  },
  info: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    fontStyle: 'italic', 
    marginBottom: spacing.sm 
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
  checkboxItem: {
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.background
  },
  checkboxItemSelected: {
    backgroundColor: colors.secondaryDark,
    borderColor: colors.primary,
    borderWidth: 2
  },
  checkboxText: {
    fontSize: 14,
    color: colors.textPrimary
  }
})
