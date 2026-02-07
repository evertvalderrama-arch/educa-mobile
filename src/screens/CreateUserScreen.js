import React, { useState } from 'react'
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'

export default function CreateUserScreen({ navigation }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('alumno')

  const submit = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Completa todos los campos')
      return
    }
    try {
      await api.crearUsuario({ nombre, email, password, rol })
      Alert.alert('Éxito', 'Usuario creado correctamente')
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo crear el usuario')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>👤 Crear Usuario</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput 
            value={nombre} 
            onChangeText={setNombre} 
            placeholder="Ingrese el nombre completo"
            placeholderTextColor={colors.textMuted}
            style={styles.input} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize='none'
            keyboardType="email-address"
            placeholder="usuario@ejemplo.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
            placeholder="Ingrese una contraseña"
            placeholderTextColor={colors.textMuted}
            style={styles.input} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rol del Usuario</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity 
              style={[styles.roleButton, rol === 'alumno' && styles.roleButtonActive]}
              onPress={() => setRol('alumno')}
            >
              <Text style={[styles.roleButtonText, rol === 'alumno' && styles.roleButtonTextActive]}>
                👨‍🎓 Alumno
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.roleButton, rol === 'docente' && styles.roleButtonActive]}
              onPress={() => setRol('docente')}
            >
              <Text style={[styles.roleButtonText, rol === 'docente' && styles.roleButtonTextActive]}>
                👨‍🏫 Docente
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.roleButton, rol === 'admin' && styles.roleButtonActive]}
              onPress={() => setRol('admin')}
            >
              <Text style={[styles.roleButtonText, rol === 'admin' && styles.roleButtonTextActive]}>
                👨‍💼 Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submit}>
          <Text style={styles.submitButtonText}>✓ Crear Usuario</Text>
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
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap'
  },
  roleButton: {
    flex: 1,
    minWidth: 100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center'
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary
  },
  roleButtonTextActive: {
    color: colors.textLight
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
