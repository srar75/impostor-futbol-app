import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a472a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Impostor Futbol' }} />
      <Stack.Screen name="lobby" options={{ title: 'Sala de Espera' }} />
      <Stack.Screen name="game" options={{ title: 'Partida' }} />
      <Stack.Screen name="result" options={{ title: 'Resultado' }} />
    </Stack>
  );
}
