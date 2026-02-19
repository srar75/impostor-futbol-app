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
      <Stack.Screen name="game" options={{ title: 'Revelación de Roles' }} />
      <Stack.Screen name="voting" options={{ title: 'Votación Final' }} />
      <Stack.Screen name="result" options={{ title: 'Resultado' }} />
    </Stack>
  );
}