import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import api from '../api'
import { colors, spacing } from '../theme'

export default function VisualizarCursosScreen({ navigation }) {
  const [grado, setGrado] = useState('')
  const [seccion, setSeccion] = useState('')
  const [resultados, setResultados] = useState(null)

  const filtrar = async () => {
    try {
      const data = await api.visualizarCursos({ grado, seccion })
      setResultados(data || [])
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los cursos')
      setResultados([])
    }
  }

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>👁️ Visualizar Cursos</Text>
      </View>

      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>Filtros de Búsqueda</Text>
        
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Grado</Text>
            <TextInput
              style={styles.input}
              value={grado}
              onChangeText={setGrado}
              placeholder="1-5"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Sección</Text>
            <TextInput
              style={styles.input}
              value={seccion}
              onChangeText={setSeccion}
              placeholder="A, B, C, D"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.filterButton} onPress={filtrar}>
          <Text style={styles.filterButtonText}>🔍 Filtrar Cursos</Text>
        </TouchableOpacity>
      </View>

      {resultados && resultados.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📭 No se encontraron cursos con estos filtros</Text>
        </View>
      )}
    </>
  )

  const renderCurso = ({ item: curso }) => (
    <View style={styles.cursoCard}>
      <Text style={styles.cursoNombre}>
        📚 {curso.curso_nombre || curso.nombre || 'Sin nombre'}
      </Text>
      <Text style={styles.cursoInfo}>
        🎓 Grado: {curso.grado} | Sección: {curso.seccion}
      </Text>
      
      {curso.temas && curso.temas.length > 0 && (
        <View style={styles.temasSection}>
          <Text style={styles.temasTitle}>📋 Temas:</Text>
          {curso.temas.map((tema, tIdx) => (
            <View key={tIdx} style={styles.temaItem}>
              <View style={styles.temaHeader}>
                <Text style={styles.temaTitulo}>{tema.titulo}</Text>
                <Text style={[styles.temaEstado, tema.estado !== 'abierto' && styles.temaEstadoCerrado]}>
                  {tema.estado === 'abierto' ? '✅ Activo' : '🔒 Cerrado'}
                </Text>
              </View>
              
              {tema.actividades && tema.actividades.length > 0 && (
                <View style={styles.actividadesSection}>
                  <Text style={styles.actividadesTitle}>Actividades:</Text>
                  {tema.actividades.map((act, aIdx) => (
                    <Text key={aIdx} style={styles.actividadItem}>
                      • {act.tipo}: {act.titulo}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={renderHeader}
      data={resultados || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderCurso}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      contentContainerStyle={styles.resultados}
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
  filterCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 12,
    elevation: 4
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md
  },
  row: { 
    flexDirection: 'row', 
    gap: spacing.md, 
    marginBottom: spacing.md 
  },
  col: { flex: 1 },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: spacing.xs,
    color: colors.textPrimary
  },
  input: { 
    borderWidth: 2, 
    borderColor: colors.border, 
    borderRadius: 8, 
    padding: spacing.md,
    backgroundColor: colors.background,
    fontSize: 16,
    color: colors.textPrimary
  },
  filterButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3
  },
  filterButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold'
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
  resultados: { 
    padding: spacing.lg
  },
  cursoCard: { 
    backgroundColor: colors.background, 
    padding: spacing.lg, 
    borderRadius: 12, 
    marginBottom: spacing.lg, 
    borderLeftWidth: 4, 
    borderLeftColor: colors.primary,
    elevation: 4
  },
  cursoNombre: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: spacing.sm, 
    color: colors.primary
  },
  cursoInfo: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginBottom: spacing.md,
    fontWeight: '600'
  },
  temasSection: { 
    marginTop: spacing.md, 
    paddingTop: spacing.md, 
    borderTopWidth: 1, 
    borderTopColor: colors.borderLight 
  },
  temasTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: spacing.md, 
    color: colors.primary 
  },
  temaItem: { 
    marginBottom: spacing.md, 
    padding: spacing.md,
    backgroundColor: colors.secondaryLight,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent
  },
  temaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  temaTitulo: { 
    fontSize: 15, 
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm
  },
  temaEstado: { 
    fontSize: 11, 
    color: colors.success, 
    fontWeight: 'bold',
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4
  },
  temaEstadoCerrado: {
    color: colors.textMuted,
    backgroundColor: colors.textMuted + '20'
  },
  actividadesSection: { 
    marginTop: spacing.sm,
    paddingLeft: spacing.md
  },
  actividadesTitle: { 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: spacing.xs, 
    color: colors.textSecondary 
  },
  actividadItem: { 
    fontSize: 12, 
    color: colors.textPrimary, 
    marginBottom: spacing.xs,
    lineHeight: 18
  }
})
