import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0a1f12',
        },
        headerTintColor: '#a8d5ba',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#0d2818',
        }
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Inicio', headerShown: false }} />
      <Stack.Screen name="game" options={{ title: 'Revelar Roles', gestureEnabled: false, headerBackVisible: false }} />
      <Stack.Screen name="rounds" options={{ title: 'Preguntas', gestureEnabled: false, headerBackVisible: false }} />
      <Stack.Screen name="voting" options={{ title: 'Votación', gestureEnabled: false, headerBackVisible: false }} />
      <Stack.Screen name="result" options={{ title: 'Resultado', gestureEnabled: false, headerBackVisible: false }} />
      <Stack.Screen name="stats" options={{ title: 'Estadísticas', presentation: 'modal' }} />
    </Stack>
  );
}