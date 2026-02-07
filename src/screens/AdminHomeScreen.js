import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'

export default function AdminHomeScreen({ navigation, user, onLogout }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Opcional: cargar estadísticas generales
    setStats({ usuarios: '—', cursos: '—' })
  }, [])

  if (!user) {
    return <View style={styles.container}><Text>Cargando...</Text></View>
  }

  const menuItems = [
    { title: '👤 Crear Usuario', screen: 'CreateUser', color: colors.primary },
    { title: '📚 Crear Curso', screen: 'CreateCourse', color: colors.primary },
    { title: '📋 Listar Cursos', screen: 'AdminCourses', color: colors.primary },
    { title: '⚙️ Configurar Usuario', screen: 'ConfigurarUsuario', color: colors.warning },
    { title: '⚙️ Configurar Curso', screen: 'ConfigurarCurso', color: colors.warning },
    { title: '👁️ Visualizar Cursos', screen: 'VisualizarCursos', color: colors.info }
  ]

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Hola, {user.nombre}</Text>
          <Text style={styles.roleText}>Administrador</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Sección Gestión */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ Gestión del Sistema</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.menuButton, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuButtonText}>{item.title}</Text>
            <Text style={styles.menuButtonArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryLight
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
    marginBottom: spacing.lg
  },
  menuButton: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 6,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  menuButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600'
  },
  menuButtonArrow: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: 'bold'
  }
})
