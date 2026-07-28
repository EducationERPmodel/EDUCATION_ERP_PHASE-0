import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

// Suppress LogBox entirely so the real error is visible as text on screen
// instead of crashing inside LogBox's own UI (which uses AnimatedComponent/Image
// in a way that conflicts with Fabric on RN 0.81).
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
