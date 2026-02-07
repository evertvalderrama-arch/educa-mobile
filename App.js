import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './src/screens/LoginScreen'
import AlumnoHomeScreen from './src/screens/AlumnoHomeScreen'
import AdminHomeScreen from './src/screens/AdminHomeScreen'
import DocenteHomeScreen from './src/screens/DocenteHomeScreen'
import CreateUserScreen from './src/screens/CreateUserScreen'
import CreateCourseScreen from './src/screens/CreateCourseScreen'
import CreateTemaScreen from './src/screens/CreateTemaScreen'
import AdminCoursesScreen from './src/screens/AdminCoursesScreen'
import ConfigurarUsuarioScreen from './src/screens/ConfigurarUsuarioScreen'
import ConfigurarCursoScreen from './src/screens/ConfigurarCursoScreen'
import EditarTemaScreen from './src/screens/EditarTemaScreen'
import VisualizarCursosScreen from './src/screens/VisualizarCursosScreen'
import GenerarCriteriosScreen from './src/screens/GenerarCriteriosScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import logger from './src/utils/logger'

const Stack = createNativeStackNavigator()

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigationRef = React.useRef(null)

  useEffect(() => {
    AsyncStorage.getItem('educa_user').then(s => {
      if (s) {
        const userData = JSON.parse(s)
        setUser(userData)
        logger.log('📱 Usuario cargado desde AsyncStorage:', userData.rol, '-', userData.nombre)
      }
      setLoading(false)
    })
  }, [])

  const handleLogout = async (navigation) => {
    logger.log('🚪 Logout ejecutado')
    await AsyncStorage.removeItem('educa_user')
    setUser(null)
    navigation?.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  if (loading) return null

  const initialRoute = user ? (user.rol === 'admin' ? 'AdminHome' : user.rol === 'docente' ? 'DocenteHome' : 'AlumnoHome') : 'Login'
  logger.log('🎯 Ruta inicial determinada:', initialRoute, '- Rol:', user?.rol)

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const currentRoute = navigationRef.current?.getCurrentRoute()
        logger.log('🔄 Navegación cambió a:', currentRoute?.name)
      }}
    >
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" options={{ title: 'Iniciar sesión' }}>
          {props => (
            <LoginScreen
              {...props}
              onLogin={(u) => {
                setUser(u)
                const targetScreen = u.rol === 'admin' ? 'AdminHome' : u.rol === 'docente' ? 'DocenteHome' : 'AlumnoHome'
                props.navigation.replace(targetScreen)
              }}
            />
          )}
        </Stack.Screen>

        {/* Alumno screens */}
        <Stack.Screen name="AlumnoHome" options={{ title: 'Panel Alumno' }}>
          {props => (
            <AlumnoHomeScreen {...props} user={user} onLogout={() => handleLogout(props.navigation)} />
          )}
        </Stack.Screen>

        {/* Admin screens */}
        <Stack.Screen name="AdminHome" options={{ title: 'Panel Administrador' }}>
          {props => (
            <AdminHomeScreen {...props} user={user} onLogout={() => handleLogout(props.navigation)} />
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateUser" component={CreateUserScreen} options={{ title: 'Crear Usuario' }} />
        <Stack.Screen name="CreateCourse" component={CreateCourseScreen} options={{ title: 'Crear Curso' }} />
        <Stack.Screen name="AdminCourses" component={AdminCoursesScreen} options={{ title: 'Listar Cursos' }} />
        <Stack.Screen name="ConfigurarUsuario" component={ConfigurarUsuarioScreen} options={{ title: 'Configurar Usuario' }} />
        <Stack.Screen name="ConfigurarCurso" component={ConfigurarCursoScreen} options={{ title: 'Configurar Curso' }} />
        <Stack.Screen name="VisualizarCursos" component={VisualizarCursosScreen} options={{ title: 'Visualizar Cursos' }} />

        {/* Docente screens */}
        <Stack.Screen name="DocenteHome" options={{ title: 'Panel Docente' }}>
          {props => (
            <DocenteHomeScreen {...props} user={user} onLogout={() => handleLogout(props.navigation)} />
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateTema" component={CreateTemaScreen} options={{ title: 'Crear Tema' }} />
        <Stack.Screen name="EditarTema" component={EditarTemaScreen} options={{ title: 'Editar Tema' }} />
        <Stack.Screen name="GenerarCriterios" component={GenerarCriteriosScreen} options={{ title: 'Generar Criterios' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
