import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#030A05" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#030A05" } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="snake/[id]" options={{ presentation: "modal" }} />
          <Stack.Screen name="emergency" options={{ presentation: "fullScreenModal" }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
