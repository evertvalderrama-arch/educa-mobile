import React, { useState, useEffect } from 'react'
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'
import CustomPicker from '../components/CustomPicker'

export default function ConfigurarCursoScreen({ navigation }) {
  const [cursos, setCursos] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState('')
  
  // Grados y secciones seleccionados
  const [gradosSeleccionados, setGradosSeleccionados] = useState({
    1: false, 2: false, 3: false, 4: false, 5: false
  })
  const [seccionesPorGrado, setSeccionesPorGrado] = useState({
    1: { A: false, B: false, C: false, D: false },
    2: { A: false, B: false, C: false, D: false },
    3: { A: false, B: false, C: false, D: false },
    4: { A: false, B: false, C: false, D: false },
    5: { A: false, B: false, C: false, D: false }
  })

  useEffect(() => {
    api.listarCursos().then(data => setCursos(data || [])).catch(() => setCursos([]))
  }, [])

  const cargarConfiguracionCurso = async (cursoId) => {
    try {
      const data = await api.listarGradosSeccionesConfig(cursoId)
      
      // Reiniciar estados
      const nuevosGrados = { 1: false, 2: false, 3: false, 4: false, 5: false }
      const nuevasSecciones = {
        1: { A: false, B: false, C: false, D: false },
        2: { A: false, B: false, C: false, D: false },
        3: { A: false, B: false, C: false, D: false },
        4: { A: false, B: false, C: false, D: false },
        5: { A: false, B: false, C: false, D: false }
      }
      
      // Marcar los grados y secciones existentes
      if (data && data.length > 0) {
        data.forEach(gs => {
          const grado = parseInt(gs.grado)
          const seccion = gs.seccion
          
          if (grado >= 1 && grado <= 5 && ['A', 'B', 'C', 'D'].includes(seccion)) {
            nuevosGrados[grado] = true
            nuevasSecciones[grado][seccion] = true
          }
        })
      }
      
      setGradosSeleccionados(nuevosGrados)
      setSeccionesPorGrado(nuevasSecciones)
    } catch (err) {
      console.error('Error al cargar configuración del curso:', err)
    }
  }

  const toggleGrado = (grado) => {
    setGradosSeleccionados(prev => ({ ...prev, [grado]: !prev[grado] }))
  }

  const toggleSeccion = (grado, seccion) => {
    setSeccionesPorGrado(prev => ({
      ...prev,
      [grado]: { ...prev[grado], [seccion]: !prev[grado][seccion] }
    }))
  }

  const guardarConfiguracion = async () => {
    if (!cursoSeleccionado) {
      Alert.alert('Error', 'Seleccione un curso')
      return
    }
    
    // Construir payload: secciones[grado][] = seccion
    const secciones = {}
    Object.keys(gradosSeleccionados).forEach(grado => {
      if (gradosSeleccionados[grado]) {
        secciones[grado] = []
        Object.keys(seccionesPorGrado[grado]).forEach(seccion => {
          if (seccionesPorGrado[grado][seccion]) {
            secciones[grado].push(seccion)
          }
        })
      }
    })

    try {
      await api.configurarCurso({
        curso_id: cursoSeleccionado,
        grados: Object.keys(gradosSeleccionados).filter(g => gradosSeleccionados[g]),
        secciones
      })
      Alert.alert('Éxito', 'Curso configurado correctamente')
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar la configuración del curso')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configurar Curso</Text>
      <Text style={styles.subtitle}>Asignar grados y secciones a un curso</Text>

      <View style={styles.section}>
        <CustomPicker
          label="Curso"
          selectedValue={cursoSeleccionado}
          onValueChange={(value) => {
            setCursoSeleccionado(value)
            if (value) {
              cargarConfiguracionCurso(value)
            } else {
              // Limpiar selecciones si deselecciona
              setGradosSeleccionados({ 1: false, 2: false, 3: false, 4: false, 5: false })
              setSeccionesPorGrado({
                1: { A: false, B: false, C: false, D: false },
                2: { A: false, B: false, C: false, D: false },
                3: { A: false, B: false, C: false, D: false },
                4: { A: false, B: false, C: false, D: false },
                5: { A: false, B: false, C: false, D: false }
              })
            }
          }}
          items={[
            { label: 'Seleccione un curso', value: '' },
            ...cursos.map(c => ({ label: c.nombre, value: String(c.id) }))
          ]}
          placeholder="Seleccione un curso"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Grados y Secciones</Text>
        {[1, 2, 3, 4, 5].map(grado => (
          <View key={grado} style={styles.gradoContainer}>
            <Button
              title={`${gradosSeleccionados[grado] ? '✓' : '○'} ${grado}°`}
              onPress={() => toggleGrado(grado)}
              color={gradosSeleccionados[grado] ? '#28a745' : '#6c757d'}
            />
            {gradosSeleccionados[grado] && (
              <View style={styles.seccionesContainer}>
                {['A', 'B', 'C', 'D'].map(seccion => (
                  <Button
                    key={seccion}
                    title={`${seccionesPorGrado[grado][seccion] ? '✓' : '○'} ${seccion}`}
                    onPress={() => toggleSeccion(grado, seccion)}
                    color={seccionesPorGrado[grado][seccion] ? '#007bff' : '#6c757d'}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <Button title="Guardar configuración" onPress={guardarConfiguracion} />
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
    marginBottom: spacing.sm,
    color: colors.primary
  },
  subtitle: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginBottom: spacing.lg 
  },
  section: { 
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
    elevation: 2
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: spacing.sm,
    color: colors.primary
  },
  gradoContainer: { marginBottom: spacing.md },
  seccionesContainer: { 
    marginTop: spacing.sm, 
    marginLeft: spacing.lg, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: spacing.sm 
  }
})
