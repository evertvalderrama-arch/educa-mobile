import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'
import CustomPicker from '../components/CustomPicker'

export default function GenerarCriteriosScreen({ route, navigation }) {
  const { temaId } = route.params

  // Escrita
  const [escritaTitulo, setEscritaTitulo] = useState('')
  const [escritaDescripcion, setEscritaDescripcion] = useState('')
  const [escritaRequiereEntrega, setEscritaRequiereEntrega] = useState('1')
  const [escritaFechaLimite, setEscritaFechaLimite] = useState('')
  const [escritaEnlace, setEscritaEnlace] = useState('')

  // Exposición
  const [exposicionTitulo, setExposicionTitulo] = useState('')
  const [exposicionDescripcion, setExposicionDescripcion] = useState('')

  // Participación
  const [participacionTitulo, setParticipacionTitulo] = useState('')
  const [participacionDescripcion, setParticipacionDescripcion] = useState('')

  // Evaluación
  const [evaluacionTitulo, setEvaluacionTitulo] = useState('')
  const [evaluacionDescripcion, setEvaluacionDescripcion] = useState('')

  useEffect(() => {
    cargarCriteriosExistentes()
  }, [temaId])

  const cargarCriteriosExistentes = async () => {
    try {
      const criterios = await api.listarCriterios(temaId)
      if (criterios && criterios.length > 0) {
        console.log('📋 Cargando criterios existentes:', criterios)
        criterios.forEach(c => {
          switch (c.tipo) {
            case 'escrita':
              setEscritaTitulo(c.titulo || '')
              setEscritaDescripcion(c.descripcion || '')
              setEscritaRequiereEntrega(c.requiere_entrega?.toString() || '1')
              setEscritaFechaLimite(c.fecha_limite || '')
              setEscritaEnlace(c.enlace || '')
              break
            case 'exposicion':
              setExposicionTitulo(c.titulo || '')
              setExposicionDescripcion(c.descripcion || '')
              break
            case 'participacion':
              setParticipacionTitulo(c.titulo || '')
              setParticipacionDescripcion(c.descripcion || '')
              break
            case 'evaluacion':
              setEvaluacionTitulo(c.titulo || '')
              setEvaluacionDescripcion(c.descripcion || '')
              break
          }
        })
      }
    } catch (err) {
      console.error('Error cargando criterios:', err)
      // No mostrar alert, simplemente dejamos los campos vacíos para crear nuevos
    }
  }

  const guardarCriterios = async () => {
    const criterios = [
      {
        tipo: 'escrita',
        titulo: escritaTitulo,
        descripcion: escritaDescripcion,
        requiere_entrega: escritaRequiereEntrega,
        fecha_limite: escritaFechaLimite || null,
        enlace: escritaEnlace || null
      },
      {
        tipo: 'exposicion',
        titulo: exposicionTitulo,
        descripcion: exposicionDescripcion
      },
      {
        tipo: 'participacion',
        titulo: participacionTitulo,
        descripcion: participacionDescripcion
      },
      {
        tipo: 'evaluacion',
        titulo: evaluacionTitulo,
        descripcion: evaluacionDescripcion
      }
    ]

    console.log('💾 Guardando criterios para tema:', temaId)
    console.log('📝 Criterios a enviar:', JSON.stringify(criterios, null, 2))

    try {
      const resultado = await api.generarCriterios(temaId, criterios)
      console.log('✅ Resultado:', resultado)
      Alert.alert('Éxito', 'Criterios de evaluación guardados correctamente')
      navigation.goBack()
    } catch (err) {
      console.error('❌ Error guardando criterios:', err)
      Alert.alert('Error', 'No se pudieron guardar los criterios: ' + err.message)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generar Criterios de Evaluación</Text>

      {/* Escrita */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✍️ Escrita</Text>
        <TextInput
          style={styles.input}
          value={escritaTitulo}
          onChangeText={setEscritaTitulo}
          placeholder="Título"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          value={escritaDescripcion}
          onChangeText={setEscritaDescripcion}
          placeholder="Descripción (puede incluir enlaces)"
          multiline
          numberOfLines={3}
        />
        <CustomPicker
          label="Requiere entrega"
          selectedValue={escritaRequiereEntrega}
          onValueChange={setEscritaRequiereEntrega}
          items={[
            { label: 'Sí', value: '1' },
            { label: 'No', value: '0' },
          ]}
        />
        <TextInput
          style={styles.input}
          value={escritaFechaLimite}
          onChangeText={setEscritaFechaLimite}
          placeholder="Fecha límite (YYYY-MM-DD HH:MM)"
        />
        <TextInput
          style={styles.input}
          value={escritaEnlace}
          onChangeText={setEscritaEnlace}
          placeholder="Enlace para enviar archivo"
        />
      </View>

      {/* Exposición */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎤 Exposición</Text>
        <TextInput
          style={styles.input}
          value={exposicionTitulo}
          onChangeText={setExposicionTitulo}
          placeholder="Título"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          value={exposicionDescripcion}
          onChangeText={setExposicionDescripcion}
          placeholder="Descripción"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Participación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🙋 Participación</Text>
        <TextInput
          style={styles.input}
          value={participacionTitulo}
          onChangeText={setParticipacionTitulo}
          placeholder="Título"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          value={participacionDescripcion}
          onChangeText={setParticipacionDescripcion}
          placeholder="Descripción"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Evaluación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Evaluación</Text>
        <TextInput
          style={styles.input}
          value={evaluacionTitulo}
          onChangeText={setEvaluacionTitulo}
          placeholder="Título"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          value={evaluacionDescripcion}
          onChangeText={setEvaluacionDescripcion}
          placeholder="Descripción"
          multiline
          numberOfLines={3}
        />
      </View>

      <Button title="Guardar criterios" onPress={guardarCriterios} />
      <View style={{ height: 20 }} />
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
    marginBottom: spacing.xxl, 
    padding: spacing.md, 
    backgroundColor: colors.background, 
    borderRadius: 8,
    elevation: 2
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: spacing.md,
    color: colors.primary
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
  textarea: { 
    height: 80, 
    textAlignVertical: 'top' 
  }
})
