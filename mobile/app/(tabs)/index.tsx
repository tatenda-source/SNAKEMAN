import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Camera, AlertTriangle, BookOpen, CalendarDays, ChevronRight, Shield } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const SNAKES = [
  { id: "black-mamba", name: "Black Mamba", danger: "CRITICAL", accent: "#EF4444" },
  { id: "puff-adder", name: "Puff Adder", danger: "CRITICAL", accent: "#F59E0B" },
  { id: "mozambique-spitting-cobra", name: "Spitting Cobra", danger: "CRITICAL", accent: "#F59E0B" },
  { id: "boomslang", name: "Boomslang", danger: "HIGH", accent: "#84CC16" },
  { id: "green-mamba", name: "Green Mamba", danger: "HIGH", accent: "#F87171" },
  { id: "egyptian-cobra", name: "Egyptian Cobra", danger: "HIGH", accent: "#FB923C" },
  { id: "african-rock-python", name: "Rock Python", danger: "MEDIUM", accent: "#A78BFA" },
  { id: "rinkhals", name: "Rinkhals", danger: "HIGH", accent: "#F87171" },
];

const FEATURES = [
  { icon: Camera, label: "Identify", sub: "AI-powered ID", route: "/identify", color: "#DC2626" },
  { icon: BookOpen, label: "Library", sub: "Species & safety", route: "/library", color: "#A78BFA" },
  { icon: CalendarDays, label: "Consult", sub: "Book an expert", route: "/book", color: "#60A5FA" },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleEmergency = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    router.push("/emergency");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={["#071209", "#0A0505"]} style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Zimbabwe's Snake Platform</Text>
          </View>

          <Text style={styles.heroTitle}>Know Your{"\n"}<Text style={styles.heroAccent}>Snake.</Text></Text>
          <Text style={styles.heroSub}>Save Your Life.</Text>
          <Text style={styles.heroDesc}>
            AI-powered identification for Zimbabwe's 8 most common snake species. Expert consultations and emergency support.
          </Text>

          {/* Emergency button */}
          <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergency} activeOpacity={0.85}>
            <AlertTriangle size={20} color="#fff" />
            <Text style={styles.emergencyBtnText}>EMERGENCY</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.section}>
          <View style={styles.featureRow}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <TouchableOpacity
                  key={f.label}
                  style={styles.featureCard}
                  onPress={() => router.push(f.route as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.featureIcon, { backgroundColor: `${f.color}15`, borderColor: `${f.color}30` }]}>
                    <Icon size={22} color={f.color} />
                  </View>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Text style={styles.featureSub}>{f.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Species */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Zimbabwe's 8 Species</Text>
          <TouchableOpacity onPress={() => router.push("/library")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.snakeScroll}
        >
          {SNAKES.map((snake) => (
            <TouchableOpacity
              key={snake.id}
              style={[styles.snakeCard, { borderColor: `${snake.accent}25` }]}
              onPress={() => router.push(`/snake/${snake.id}` as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.snakeIcon, { backgroundColor: `${snake.accent}15` }]}>
                {/* Simple snake SVG representation */}
                <Shield size={24} color={snake.accent} />
              </View>
              <Text style={styles.snakeName}>{snake.name}</Text>
              <View style={[styles.dangerBadge, { backgroundColor: `${snake.accent}20`, borderColor: `${snake.accent}40` }]}>
                <Text style={[styles.dangerText, { color: snake.accent }]}>{snake.danger}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Safety tip */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Shield size={16} color="#DC2626" />
              <Text style={styles.tipTitle}>Daily Safety Tip</Text>
            </View>
            <Text style={styles.tipText}>
              If you encounter a snake, stay calm and back away slowly. Never try to pick up, corner, or provoke it. Most bites happen when humans attempt to handle snakes.
            </Text>
            <TouchableOpacity style={styles.tipCta} onPress={() => router.push("/library")}>
              <Text style={styles.tipCtaText}>Read more in Library</Text>
              <ChevronRight size={14} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0505" },
  hero: { paddingTop: 64, paddingHorizontal: 24, paddingBottom: 36 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 20, backgroundColor: "rgba(220,38,38,0.1)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start", borderWidth: 1, borderColor: "rgba(220,38,38,0.2)" },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#DC2626" },
  badgeText: { color: "#DC2626", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  heroTitle: { fontSize: 52, fontWeight: "900", color: "#FFF5F5", lineHeight: 54, marginBottom: 4 },
  heroAccent: { color: "#DC2626" },
  heroSub: { fontSize: 28, fontWeight: "900", color: "#FFF5F5", marginBottom: 16 },
  heroDesc: { color: "#4B5563", fontSize: 14, lineHeight: 22, marginBottom: 28 },
  emergencyBtn: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#EF4444", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, alignSelf: "flex-start", shadowColor: "#EF4444", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10 },
  emergencyBtnText: { color: "#fff", fontSize: 14, fontWeight: "800", letterSpacing: 1.5 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  featureRow: { flexDirection: "row", gap: 12 },
  featureCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center" },
  featureIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10, borderWidth: 1 },
  featureLabel: { color: "#FFF5F5", fontSize: 12, fontWeight: "700", marginBottom: 2 },
  featureSub: { color: "#4B5563", fontSize: 10, textAlign: "center" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 28, marginBottom: 14 },
  sectionTitle: { color: "#FFF5F5", fontSize: 18, fontWeight: "700" },
  seeAll: { color: "#DC2626", fontSize: 13, fontWeight: "600" },
  snakeScroll: { paddingHorizontal: 20, gap: 12 },
  snakeCard: { width: 120, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 14, alignItems: "center", borderWidth: 1 },
  snakeIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  snakeName: { color: "#FFF5F5", fontSize: 11, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  dangerBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  dangerText: { fontSize: 9, fontWeight: "700" },
  tipCard: { backgroundColor: "rgba(220,38,38,0.06)", borderRadius: 20, padding: 18, borderWidth: 1, borderColor: "rgba(220,38,38,0.15)" },
  tipHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  tipTitle: { color: "#DC2626", fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  tipText: { color: "#9CA3AF", fontSize: 13, lineHeight: 20, marginBottom: 12 },
  tipCta: { flexDirection: "row", alignItems: "center", gap: 4 },
  tipCtaText: { color: "#DC2626", fontSize: 12, fontWeight: "600" },
});
