import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays, Star, MapPin, CheckCircle } from "lucide-react-native";

const EXPERTS = [
  { id: "exp-001", name: "Dr. Tendai Moyo", title: "Senior Herpetologist", rating: 4.9, location: "Harare", available: true, initials: "TM" },
  { id: "exp-002", name: "Sibongile Ncube", title: "Wildlife Rescue", rating: 4.8, location: "Bulawayo", available: true, initials: "SN" },
  { id: "exp-003", name: "Marcus Fitzgerald", title: "Emergency Toxicologist", rating: 4.95, location: "Harare", available: false, initials: "MF" },
  { id: "exp-004", name: "Ruvimbo Chikwanda", title: "Conservation Educator", rating: 4.7, location: "Mutare", available: true, initials: "RC" },
];

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

function getNext7Days() {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(d);
  }
  return days;
}

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export default function BookScreen() {
  const [selectedExpert, setSelectedExpert] = useState<typeof EXPERTS[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);
  const days = getNext7Days();

  const handleBook = async () => {
    if (!selectedExpert || !selectedDate || !selectedSlot || !form.name || !form.email || !form.reason) {
      Alert.alert("Incomplete", "Please fill in all fields and select an expert, date, and time.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: form.name,
          user_email: form.email,
          user_phone: form.phone,
          expert_id: selectedExpert.id,
          date: selectedDate.toISOString().split("T")[0],
          time_slot: selectedSlot,
          reason: form.reason,
        }),
      });
      const data = await res.json();
      setBooked(data.booking_id);
    } catch {
      Alert.alert("Error", "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <CheckCircle size={52} color="#22C55E" />
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <View style={styles.bookingIdBox}>
          <Text style={styles.bookingIdLabel}>Your Booking ID</Text>
          <Text style={styles.bookingId}>{booked}</Text>
        </View>
        <Text style={styles.successNote}>
          {selectedExpert?.name} will confirm within 2 hours.
        </Text>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => { setBooked(null); setSelectedExpert(null); setSelectedDate(null); setSelectedSlot(""); }}
        >
          <Text style={styles.resetBtnText}>Book Another Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Book Expert</Text>
          <Text style={styles.subtitle}>Schedule with Zimbabwe's top herpetologists</Text>
        </View>

        {/* Experts */}
        <Text style={styles.stepLabel}>1. Choose Expert</Text>
        <View style={styles.expertList}>
          {EXPERTS.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={[styles.expertCard, selectedExpert?.id === e.id && styles.expertSelected, !e.available && styles.expertUnavailable]}
              onPress={() => e.available && setSelectedExpert(e)}
              activeOpacity={0.85}
            >
              <View style={styles.expertAvatar}>
                <Text style={styles.expertInitials}>{e.initials}</Text>
              </View>
              <View style={styles.expertInfo}>
                <Text style={styles.expertName}>{e.name}</Text>
                <Text style={styles.expertTitle}>{e.title}</Text>
                <View style={styles.expertMeta}>
                  <Star size={10} color="#F59E0B" />
                  <Text style={styles.expertRating}>{e.rating}</Text>
                  <MapPin size={10} color="#4B5563" />
                  <Text style={styles.expertLocation}>{e.location}</Text>
                </View>
              </View>
              <View style={[styles.availBadge, e.available ? styles.availGreen : styles.availGrey]}>
                <Text style={[styles.availText, { color: e.available ? "#22C55E" : "#6B7280" }]}>
                  {e.available ? "Available" : "Busy"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        {selectedExpert && (
          <>
            <Text style={styles.stepLabel}>2. Pick a Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d.toISOString()}
                  style={[styles.dateChip, selectedDate?.toDateString() === d.toDateString() && styles.dateChipSelected]}
                  onPress={() => { setSelectedDate(d); setSelectedSlot(""); }}
                >
                  <Text style={[styles.dateDay, selectedDate?.toDateString() === d.toDateString() && styles.dateTextSelected]}>
                    {d.toLocaleDateString("en", { weekday: "short" })}
                  </Text>
                  <Text style={[styles.dateNum, selectedDate?.toDateString() === d.toDateString() && styles.dateTextSelected]}>
                    {d.getDate()}
                  </Text>
                  <Text style={[styles.dateMon, selectedDate?.toDateString() === d.toDateString() && styles.dateTextSelected]}>
                    {d.toLocaleDateString("en", { month: "short" })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Time */}
        {selectedDate && (
          <>
            <Text style={styles.stepLabel}>3. Select Time</Text>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.timeChip, selectedSlot === slot && styles.timeChipSelected]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text style={[styles.timeText, selectedSlot === slot && styles.timeTextSelected]}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Form */}
        <Text style={styles.stepLabel}>4. Your Details</Text>
        <View style={styles.formCard}>
          {[
            { key: "name", label: "Full Name", placeholder: "Your name", keyboard: "default" },
            { key: "email", label: "Email", placeholder: "you@example.com", keyboard: "email-address" },
            { key: "phone", label: "Phone", placeholder: "+263 7X XXX XXXX", keyboard: "phone-pad" },
          ].map((f) => (
            <View key={f.key} style={styles.formField}>
              <Text style={styles.formLabel}>{f.label}</Text>
              <TextInput
                value={form[f.key as keyof typeof form]}
                onChangeText={(v) => setForm({ ...form, [f.key]: v })}
                placeholder={f.placeholder}
                placeholderTextColor="#4B5563"
                keyboardType={f.keyboard as any}
                style={styles.formInput}
              />
            </View>
          ))}
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Reason for Consultation</Text>
            <TextInput
              value={form.reason}
              onChangeText={(v) => setForm({ ...form, reason: v })}
              placeholder="I found a snake in my garden..."
              placeholderTextColor="#4B5563"
              style={[styles.formInput, styles.formTextarea]}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook} disabled={loading} activeOpacity={0.85}>
          <LinearGradient colors={["#22C55E", "#15803D"]} style={styles.bookGradient}>
            {loading ? (
              <ActivityIndicator color="#030A05" />
            ) : (
              <>
                <CalendarDays size={18} color="#030A05" />
                <Text style={styles.bookBtnText}>Confirm Booking</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030A05" },
  centerContent: { alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 40 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { paddingTop: 64, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "900", color: "#F0FDF4", marginBottom: 4 },
  subtitle: { color: "#4B5563", fontSize: 14 },
  stepLabel: { color: "#6B7280", fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, marginTop: 20 },
  expertList: { gap: 10 },
  expertCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  expertSelected: { borderColor: "rgba(34,197,94,0.4)", backgroundColor: "rgba(34,197,94,0.06)" },
  expertUnavailable: { opacity: 0.5 },
  expertAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(34,197,94,0.1)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(34,197,94,0.2)" },
  expertInitials: { color: "#22C55E", fontSize: 16, fontWeight: "800" },
  expertInfo: { flex: 1 },
  expertName: { color: "#F0FDF4", fontSize: 13, fontWeight: "700", marginBottom: 2 },
  expertTitle: { color: "#6B7280", fontSize: 11, marginBottom: 4 },
  expertMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  expertRating: { color: "#F59E0B", fontSize: 11, marginRight: 6 },
  expertLocation: { color: "#4B5563", fontSize: 11 },
  availBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  availGreen: { backgroundColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.25)" },
  availGrey: { backgroundColor: "rgba(107,114,128,0.1)", borderColor: "rgba(107,114,128,0.25)" },
  availText: { fontSize: 10, fontWeight: "600" },
  dateRow: { gap: 10, paddingBottom: 4 },
  dateChip: { width: 62, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  dateChipSelected: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
  dateDay: { color: "#6B7280", fontSize: 10, fontWeight: "600", marginBottom: 2 },
  dateNum: { color: "#F0FDF4", fontSize: 20, fontWeight: "800" },
  dateMon: { color: "#6B7280", fontSize: 10, marginTop: 2 },
  dateTextSelected: { color: "#030A05" },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  timeChip: { width: "22%", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  timeChipSelected: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
  timeText: { color: "#9CA3AF", fontSize: 13, fontWeight: "600" },
  timeTextSelected: { color: "#030A05" },
  formCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", gap: 14 },
  formField: {},
  formLabel: { color: "#6B7280", fontSize: 11, fontWeight: "600", letterSpacing: 0.5, marginBottom: 6 },
  formInput: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: "#F0FDF4", fontSize: 14 },
  formTextarea: { minHeight: 72 },
  bookBtn: { marginTop: 20, borderRadius: 20, overflow: "hidden", shadowColor: "#22C55E", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  bookGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16 },
  bookBtnText: { color: "#030A05", fontSize: 15, fontWeight: "800" },
  successTitle: { fontSize: 26, fontWeight: "800", color: "#F0FDF4", textAlign: "center" },
  bookingIdBox: { backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 20, padding: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", width: "100%" },
  bookingIdLabel: { color: "#6B7280", fontSize: 11, fontWeight: "600", marginBottom: 6 },
  bookingId: { color: "#22C55E", fontSize: 28, fontWeight: "800", fontVariant: ["tabular-nums"] },
  successNote: { color: "#6B7280", fontSize: 13, textAlign: "center" },
  resetBtn: { backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 20, paddingVertical: 14, paddingHorizontal: 32, borderWidth: 1, borderColor: "rgba(34,197,94,0.2)" },
  resetBtnText: { color: "#22C55E", fontSize: 14, fontWeight: "700" },
});
