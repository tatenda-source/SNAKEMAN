import { Tabs } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Camera, BookOpen, CalendarDays, Home, AlertTriangle } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

function EmergencyButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        router.push("/emergency");
      }}
      style={styles.emergencyBtn}
      activeOpacity={0.8}
    >
      <AlertTriangle size={22} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emergencyBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0D1F10",
          borderTopColor: "#132B17",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#22C55E",
        tabBarInactiveTintColor: "#4B5563",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="identify"
        options={{
          title: "Identify",
          tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="emergency-tab"
        options={{
          title: "",
          tabBarIcon: () => <EmergencyButton />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Consult",
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
