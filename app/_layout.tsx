import "@/global.css";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY — check your .env file"
  );
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────
// Redirects users based on auth state without showing a flash of wrong content.
function InitialRedirect() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.Background }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // If signed in, always land on the tabs dashboard
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise land on onboarding
  return <Redirect href="/Onboarding" />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Auth stack */}
          <Stack.Screen name="(auth)" options={{ animation: "none" }} />
          {/* Main app tabs */}
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
          {/* Onboarding / landing */}
          <Stack.Screen name="Onboarding" options={{ animation: "none" }} />
          {/* Index — acts as redirect hub */}
          <Stack.Screen name="index" options={{ animation: "none" }} />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}