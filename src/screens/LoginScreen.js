import React, { useState } from 'react'
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native'
import api from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, spacing } from '../theme'

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }
    
    setLoading(true)
    try {
      const u = await api.login({ email, password })
      await AsyncStorage.setItem('educa_user', JSON.stringify(u))
      onLogin(u)
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          {/*<Text style={styles.appName}>EDUCA</Text>*/}
          <Text style={styles.appSubtitle}>Sistema de Gestión Educativa</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>
          
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
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={submit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Iniciando sesión...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryLight
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 2
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs
  },
  appSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  formContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.xl,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.lg,
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
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
    elevation: 3
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
    elevation: 0
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold'
  }
})
