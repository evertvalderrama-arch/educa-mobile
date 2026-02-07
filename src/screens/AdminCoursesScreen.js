import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'

export default function AdminCoursesScreen({ navigation }) {
  const [cursos, setCursos] = useState(null)

  useEffect(() => {
    let mounted = true
    api.listarCursos().then(data => {
      if (mounted) setCursos(data)
    }).catch(() => {
      if (mounted) setCursos([])
    })
    return () => mounted = false
  }, [])

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>📚 Lista de Cursos</Text>
    </View>
  )

  const renderEmpty = () => {
    if (cursos === null) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      )
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📦 No hay cursos registrados</Text>
      </View>
    )
  }

  const renderCurso = ({ item }) => (
    <View style={styles.cursoCard}>
      <Text style={styles.cursoNombre}>📚 {item.nombre}</Text>
      {item.descripcion && (
        <Text style={styles.cursoDescripcion}>{item.descripcion}</Text>
      )}
    </View>
  )

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      data={cursos || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCurso}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      contentContainerStyle={styles.listContainer}
    />
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
    elevation: 4
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: colors.textLight,
    textAlign: 'center'
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: 'italic'
  },
  emptyContainer: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.textMuted
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic'
  },
  listContainer: {
    padding: spacing.lg
  },
  cursoCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    elevation: 3
  },
  cursoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs
  },
  cursoDescripcion: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20
  }
})
