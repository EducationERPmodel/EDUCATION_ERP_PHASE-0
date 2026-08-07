import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';

// Auth guard — redirects unauthenticated users to /login
// In production replace this simple flag with a proper token store
let _isLoggedIn = false;
export function setLoggedIn(v) { _isLoggedIn = v; }
export function isLoggedIn()   { return _isLoggedIn; }

const PUBLIC_ROUTES = ['/', '/login'];

function AuthGuard() {
  const router   = useRouter();
  const pathname = usePathname();
  const checked  = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r));
    if (!isPublic && !_isLoggedIn) {
      router.replace('/login');
    }
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
