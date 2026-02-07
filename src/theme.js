// Tema global de la aplicación
export const colors = {
  // Colores principales
  primary: '#8B1538',      // Vino
  primaryDark: '#6B0F2A',  // Vino oscuro
  primaryLight: '#A8194A', // Vino claro
  
  secondary: '#F5E6D3',    // Crema
  secondaryDark: '#E8D4BC', // Crema oscuro
  secondaryLight: '#FFF8F0', // Crema claro
  
  // Colores de acento
  accent: '#D4AF37',       // Dorado
  accentLight: '#F0D98D',  // Dorado claro
  
  // Colores de estado
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#007bff',
  
  // Colores de texto
  textPrimary: '#2c3e50',
  textSecondary: '#6c757d',
  textLight: '#ffffff',
  textMuted: '#999999',
  
  // Colores de fondo
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundDark: '#2c3e50',
  
  // Colores de borde
  border: '#ddd',
  borderLight: '#e9ecef',
  borderDark: '#666',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
}

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
}

export const commonStyles = {
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.secondaryLight,
  },
  
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  buttonSecondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: spacing.md,
    backgroundColor: colors.background,
    fontSize: 16,
    color: colors.textPrimary,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  // Solución para Picker en Android
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  
  picker: {
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  
  pickerItem: {
    color: colors.textPrimary,
    fontSize: 16,
  },
}
