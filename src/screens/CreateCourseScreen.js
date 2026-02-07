import React, { useState } from 'react'
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'

export default function CreateCourseScreen({ navigation }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const submit = async () => {
    if (!nombre) {
      Alert.alert('Error', 'Ingresa el nombre del curso')
      return
    }
    try {
      await api.crearCurso({ nombre, descripcion })
      Alert.alert('Éxito', 'Curso creado correctamente')
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo crear el curso')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📚 Crear Curso</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Curso</Text>
          <TextInput 
            value={nombre} 
            onChangeText={setNombre}
            placeholder="Ej: Matemáticas, Comunicación, etc."
            placeholderTextColor={colors.textMuted}
            style={styles.input} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción (Opcional)</Text>
          <TextInput 
            value={descripcion} 
            onChangeText={setDescripcion} 
            multiline
            numberOfLines={4}
            placeholder="Descripción breve del curso..."
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.textarea]}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submit}>
          <Text style={styles.submitButtonText}>✓ Crear Curso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.secondaryLight 
  },
  card: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderRadius: 12,
    elevation: 4
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: colors.primary,
    marginBottom: spacing.xl,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: spacing.lg
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs
  },
  input: { 
    borderWidth: 2, 
    borderColor: colors.border, 
    borderRadius: 8,
    padding: spacing.md, 
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background
  },
  textarea: {
    minHeight: 100
  },
  submitButton: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.lg,
    elevation: 3
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold'
  }
})
