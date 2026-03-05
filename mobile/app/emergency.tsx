import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { X, MapPin, AlertTriangle, Phone, CheckCircle, Loader } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export default function EmergencyScreen() {
  const router = useRouter();
  const [bitten, setBitten] = useState(false);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [phone, setPhone] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const getLocation = async () => {
    setLocLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Location access is needed for emergency response.");
      setLocLoading(false);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    setLocLoading(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Required", "Please describe the encounter.");
      return;
    }
    setLoading(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    try {
      const res = await fetch(`${API_BASE}/api/emergency/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          latitude: coords?.lat,
          longitude: coords?.lng,
          location_name: locationName,
          bitten,
          user_phone: phone,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      Alert.alert("Error", "Failed to send report. Call 999 directly if life-threatening.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1A0000", "#030A05"]} style={styles.bg} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconWrap}>
          <AlertTriangle size={40} color="#EF4444" />
        </View>

        <Text style={styles.title}>Emergency</Text>
        <Text style={styles.subtitle}>Report a snake encounter or bite. Experts respond immediately.</Text>
        <Text style={styles.emergencyNote}>Life-threatening? Call <Text style={styles.phone999}>999</Text> first.</Text>

        {!result ? (
          <>
            {/* Bitten toggle */}
            <View style={[styles.card, bitten && styles.cardDanger]}>
              <View style={styles.row}>
                <View>
                  <Text style={[styles.cardTitle, bitten && { color: "#EF4444" }]}>
                    {bitten ? "BITTEN — Get to hospital NOW" : "I was NOT bitten"}
                  </Text>
                  <Text style={styles.cardSub}>Toggle if you were bitten</Text>
                </View>
                <Switch
                  value={bitten}
                  onValueChange={setBitten}
                  trackColor={{ false: "#1F2937", true: "#991B1B" }}
                  thumbColor={bitten ? "#EF4444" : "#4B5563"}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.card}>
              <Text style={styles.label}>Describe the Encounter *</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. Large grey snake in my bedroom, spread black mouth, about 2m long..."
                placeholderTextColor="#4B5563"
                style={styles.textarea}
                multiline
                numberOfLines={5}
                autoFocus
              />
            </View>

            {/* Location */}
            <View style={styles.card}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                value={locationName}
                onChangeText={setLocationName}
                placeholder="14 Borrowdale Road, Harare"
                placeholderTextColor="#4B5563"
                style={styles.input}
              />
              <TouchableOpacity style={styles.gpsBtn} onPress={getLocation} disabled={locLoading}>
                {locLoading ? (
                  <ActivityIndicator size="small" color="#22C55E" />
                ) : (
                  <MapPin size={16} color="#22C55E" />
                )}
                <Text style={styles.gpsBtnText}>{coords ? "GPS Captured" : "Get GPS Location"}</Text>
              </TouchableOpacity>
            </View>

            {/* Phone */}
            <View style={styles.card}>
              <Text style={styles.label}>Your Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+263 7X XXX XXXX"
                placeholderTextColor="#4B5563"
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient colors={["#DC2626", "#991B1B"]} style={styles.submitGradient}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <AlertTriangle size={20} color="#fff" />
                    <Text style={styles.submitText}>SEND EMERGENCY REPORT</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          /* RESULT */
          <View style={styles.resultContainer}>
            <View style={styles.successCard}>
              <CheckCircle size={32} color="#22C55E" />
              <Text style={styles.successTitle}>Report Submitted</Text>
              <Text style={styles.successId}>ID: {result.emergency_id}</Text>
              <Text style={styles.successSub}>Experts notified. Response est: {result.guidance?.estimated_response}</Text>
            </View>

            {result.guidance?.immediate_steps && (
              <View style={styles.stepsCard}>
                <Text style={styles.stepsTitle}>Do This Now</Text>
                {result.guidance.immediate_steps.map((step: string, i: number) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={styles.stepNum}>
                      <Text style={styles.stepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {result.guidance?.call_emergency && (
              <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL("tel:999")}>
                <Phone size={20} color="#fff" />
                <Text style={styles.callBtnText}>CALL 999 NOW</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  closeBtn: { position: "absolute", top: 60, right: 20, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  iconWrap: { paddingTop: 80, alignItems: "center", marginBottom: 16 },
  title: { fontSize: 36, fontWeight: "900", color: "#F0FDF4", textAlign: "center", marginBottom: 8 },
  subtitle: { color: "#6B7280", fontSize: 14, textAlign: "center", marginBottom: 6 },
  emergencyNote: { color: "#6B7280", fontSize: 13, textAlign: "center", marginBottom: 28 },
  phone999: { color: "#EF4444", fontWeight: "800" },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  cardDanger: { backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { color: "#F0FDF4", fontSize: 15, fontWeight: "700", marginBottom: 2 },
  cardSub: { color: "#6B7280", fontSize: 12 },
  label: { color: "#6B7280", fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 },
  textarea: { color: "#F0FDF4", fontSize: 14, lineHeight: 22, minHeight: 80 },
  input: { color: "#F0FDF4", fontSize: 14, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10 },
  gpsBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", alignSelf: "flex-start" },
  gpsBtnText: { color: "#22C55E", fontSize: 13, fontWeight: "600" },
  submitBtn: { borderRadius: 20, overflow: "hidden", shadowColor: "#EF4444", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10, marginBottom: 20 },
  submitGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 18 },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 1.5 },
  resultContainer: { gap: 14 },
  successCard: { backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 24, padding: 24, alignItems: "center", borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", gap: 8 },
  successTitle: { color: "#F0FDF4", fontSize: 22, fontWeight: "800" },
  successId: { color: "#22C55E", fontSize: 14, fontWeight: "700", fontVariant: ["tabular-nums"] },
  successSub: { color: "#6B7280", fontSize: 12, textAlign: "center" },
  stepsCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  stepsTitle: { color: "#F0FDF4", fontSize: 15, fontWeight: "700", marginBottom: 14 },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 10, alignItems: "flex-start" },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(34,197,94,0.15)", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepNumText: { color: "#22C55E", fontSize: 11, fontWeight: "700" },
  stepText: { color: "#9CA3AF", fontSize: 13, lineHeight: 20, flex: 1 },
  callBtn: { backgroundColor: "#EF4444", borderRadius: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  callBtnText: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 1 },
  backBtn: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, paddingVertical: 14, alignItems: "center" },
  backBtnText: { color: "#6B7280", fontSize: 14, fontWeight: "600" },
});
