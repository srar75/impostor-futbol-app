import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#f2f2f7', // iOS default group background
        },
        headerTintColor: '#007aff', // iOS link blue
        contentStyle: {
          backgroundColor: '#f2f2f7',
        }
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Impostor Futbol' }} />
      <Stack.Screen name="game" options={{ title: 'Roles', presentation: 'modal' }} />
      <Stack.Screen name="voting" options={{ title: 'Votación', presentation: 'modal', gestureEnabled: false, headerLeft: () => null }} />
      <Stack.Screen name="result" options={{ title: 'Resultado', presentation: 'fullScreenModal', gestureEnabled: false, headerLeft: () => null }} />
    </Stack>
  );
}