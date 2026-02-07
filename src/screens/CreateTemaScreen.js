import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Picker } from 'react-native'
import api from '../api'

export default function CreateTemaScreen({ navigation }) {
  const [cursoId, setCursoId] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const submit = async () => {
    if (!cursoId || !titulo) {
      Alert.alert('Error', 'Completa curso y título')
      return
    }
    try {
      await api.crearTema({ curso_id: cursoId, titulo, descripcion })
      Alert.alert('Éxito', 'Tema creado correctamente')
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo crear el tema')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Tema</Text>
      <Text>ID del curso (por ahora manual)</Text>
      <TextInput value={cursoId} onChangeText={setCursoId} keyboardType='numeric' style={styles.input} />
      <Text>Título del tema</Text>
      <TextInput value={titulo} onChangeText={setTitulo} style={styles.input} />
      <Text>Descripción</Text>
      <TextInput value={descripcion} onChangeText={setDescripcion} multiline style={styles.input} />
      <Button title="Crear" onPress={submit} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }
})
