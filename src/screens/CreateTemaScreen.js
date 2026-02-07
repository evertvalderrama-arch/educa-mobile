import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import api from '../api'

export default function CreateTemaScreen({ navigation, route }) {
  const { cursoGradoSeccionId } = route.params || {}
  
  const [submitting, setSubmitting] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const submit = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio')
      return
    }

    setSubmitting(true)
    try {
      await api.crearTema({ 
        curso_id: cursoGradoSeccionId, 
        titulo: titulo.trim(), 
        descripcion: descripcion.trim() 
      })
      Alert.alert('Éxito', 'Tema creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo crear el tema')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear Nuevo Tema</Text>
        <Text style={styles.subtitle}>Agrega contenido al curso seleccionado</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Título del Tema *</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ej: Introducción a JavaScript"
          placeholderTextColor="#999"
          style={styles.input}
          maxLength={100}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describe brevemente el contenido del tema..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
          maxLength={500}
        />

        <Text style={styles.hint}>
          * Campos obligatorios
        </Text>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Crear Tema</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    padding: 20,
    backgroundColor: '#8B0000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#F5F5DC',
  },
  card: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B0000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#8B0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  cancelButtonText: {
    color: '#8B0000',
    fontSize: 16,
    fontWeight: '600',
  },
})
