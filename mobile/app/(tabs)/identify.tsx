import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Upload, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

const DANGER_COLORS: Record<string, string> = {
  CRITICAL: "#EF4444",
  HIGH: "#F59E0B",
  MEDIUM: "#A78BFA",
  LOW: "#22C55E",
};

export default function IdentifyScreen() {
  const [image, setImage] = useState<{ uri: string; base64?: string } | null>(null);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const pickImage = async (source: "camera" | "library") => {
    let res;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Camera access is required for identification.");
        return;
      }
      res = await ImagePicker.launchCameraAsync({ quality: 0.8, base64: false });
    } else {
      res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    }

    if (!res.canceled && res.assets[0]) {
      setImage({ uri: res.assets[0].uri });
      setResult(null);
    }
  };

  const handleIdentify = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      const filename = image.uri.split("/").pop() || "photo.jpg";
      const ext = filename.split(".").pop()?.toLowerCase();
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";
      formData.append("image", { uri: image.uri, name: filename, type: mimeType } as any);
      if (context) formData.append("context", context);

      const response = await fetch(`${API_BASE}/api/identify/`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = await response.json();
      setResult(data.result);
    } catch (e) {
      Alert.alert("Error", "Identification failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const dangerColor = result?.danger_level ? DANGER_COLORS[result.danger_level] : "#22C55E";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Identify a Snake</Text>
          <Text style={styles.subtitle}>Upload a photo for instant AI identification</Text>
        </View>

        {/* Upload area */}
        {!image ? (
          <View style={styles.uploadContainer}>
            <View style={styles.uploadBox}>
              <Camera size={36} color="rgba(34,197,94,0.4)" />
              <Text style={styles.uploadText}>Take or upload a photo</Text>
            </View>
            <View style={styles.uploadBtns}>
              <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage("camera")} activeOpacity={0.8}>
                <Camera size={20} color="#22C55E" />
                <Text style={styles.uploadBtnText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage("library")} activeOpacity={0.8}>
                <Upload size={20} color="#22C55E" />
                <Text style={styles.uploadBtnText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.changeImage}
              onPress={() => { setImage(null); setResult(null); }}
            >
              <Text style={styles.changeImageText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Context */}
        {image && (
          <View style={styles.contextBox}>
            <Text style={styles.label}>Additional Context (optional)</Text>
            <TextInput
              value={context}
              onChangeText={setContext}
              placeholder="e.g. Found in Harare garage, about 1m long..."
              placeholderTextColor="#4B5563"
              style={styles.contextInput}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* CTA */}
        {image && (
          <TouchableOpacity
            style={[styles.identifyBtn, !image && styles.disabledBtn]}
            onPress={handleIdentify}
            disabled={loading || !image}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#22C55E", "#15803D"]} style={styles.identifyGradient}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Camera size={18} color="#030A05" />
                  <Text style={styles.identifyBtnText}>Identify Snake</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Claude AI is analyzing key features...</Text>
          </View>
        )}

        {/* Result */}
        {result && !loading && (
          <View style={styles.resultContainer}>
            <View style={[styles.resultCard, { borderColor: `${dangerColor}30`, backgroundColor: `${dangerColor}08` }]}>
              {/* Confidence + name */}
              <View style={styles.resultHeader}>
                <View>
                  {result.identified ? (
                    <>
                      <View style={[styles.dangerBadge, { backgroundColor: `${dangerColor}20`, borderColor: `${dangerColor}40` }]}>
                        <Text style={[styles.dangerBadgeText, { color: dangerColor }]}>
                          {result.danger_level} — {result.confidence_label} Confidence
                        </Text>
                      </View>
                      <Text style={styles.snakeName}>{result.common_name}</Text>
                      <Text style={styles.snakeSci}>{result.scientific_name}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.snakeName}>
                        {result.is_snake ? "Unknown Species" : "No Snake Detected"}
                      </Text>
                    </>
                  )}
                </View>
                <Text style={[styles.confidence, { color: dangerColor }]}>
                  {Math.round(result.confidence * 100)}%
                </Text>
              </View>

              {/* Action */}
              <View style={styles.actionBox}>
                <Text style={styles.actionLabel}>IMMEDIATE ACTION</Text>
                <Text style={styles.actionText}>{result.immediate_action}</Text>
              </View>

              {/* Features */}
              {result.visible_features?.length > 0 && (
                <View style={styles.featuresContainer}>
                  {result.visible_features.map((f: string) => (
                    <View key={f} style={styles.featureTag}>
                      <Text style={styles.featureTagText}>{f}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Reasoning */}
            <View style={styles.reasoningBox}>
              <Text style={styles.reasoningLabel}>AI Reasoning</Text>
              <Text style={styles.reasoningText}>{result.reasoning}</Text>
            </View>

            {/* First aid */}
            {result.snake_data?.first_aid && (
              <View style={styles.firstAidBox}>
                <Text style={styles.firstAidLabel}>First Aid</Text>
                <Text style={styles.firstAidText}>{result.snake_data.first_aid}</Text>
              </View>
            )}

            {/* Emergency CTA */}
            {result.danger_level === "CRITICAL" && (
              <TouchableOpacity style={styles.emergencyCta} activeOpacity={0.85}>
                <AlertTriangle size={18} color="#fff" />
                <Text style={styles.emergencyCtaText}>ACTIVATE EMERGENCY</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030A05" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { paddingTop: 64, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "900", color: "#F0FDF4", marginBottom: 6 },
  subtitle: { color: "#4B5563", fontSize: 14 },
  uploadContainer: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 24, padding: 20, borderWidth: 2, borderStyle: "dashed", borderColor: "rgba(34,197,94,0.2)", marginBottom: 16, alignItems: "center" },
  uploadBox: { alignItems: "center", paddingVertical: 24, gap: 12 },
  uploadText: { color: "#6B7280", fontSize: 14 },
  uploadBtns: { flexDirection: "row", gap: 12, width: "100%" },
  uploadBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 16, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(34,197,94,0.2)" },
  uploadBtnText: { color: "#22C55E", fontSize: 14, fontWeight: "600" },
  imagePreview: { borderRadius: 24, overflow: "hidden", marginBottom: 16 },
  previewImage: { width: "100%", height: 240, borderRadius: 24 },
  changeImage: { position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  changeImageText: { color: "#F0FDF4", fontSize: 12, fontWeight: "600" },
  contextBox: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  label: { color: "#6B7280", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 },
  contextInput: { color: "#F0FDF4", fontSize: 14, lineHeight: 22 },
  identifyBtn: { marginBottom: 16, borderRadius: 20, overflow: "hidden", shadowColor: "#22C55E", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  identifyGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16 },
  identifyBtnText: { color: "#030A05", fontSize: 15, fontWeight: "800", letterSpacing: 0.5 },
  disabledBtn: { opacity: 0.5 },
  loadingBox: { alignItems: "center", paddingVertical: 16 },
  loadingText: { color: "#6B7280", fontSize: 13 },
  resultContainer: { gap: 12 },
  resultCard: { borderRadius: 24, padding: 18, borderWidth: 1 },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  dangerBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, alignSelf: "flex-start", marginBottom: 8 },
  dangerBadgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  snakeName: { fontSize: 24, fontWeight: "800", color: "#F0FDF4", marginBottom: 2 },
  snakeSci: { fontSize: 12, color: "#6B7280", fontStyle: "italic" },
  confidence: { fontSize: 28, fontWeight: "800" },
  actionBox: { backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 16, padding: 12, marginBottom: 12 },
  actionLabel: { color: "#6B7280", fontSize: 10, fontWeight: "700", letterSpacing: 1, marginBottom: 6 },
  actionText: { color: "#F0FDF4", fontSize: 13, lineHeight: 20 },
  featuresContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  featureTag: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  featureTagText: { color: "#D1FAE5", fontSize: 11 },
  reasoningBox: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  reasoningLabel: { color: "#6B7280", fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  reasoningText: { color: "#9CA3AF", fontSize: 13, lineHeight: 20 },
  firstAidBox: { backgroundColor: "rgba(34,197,94,0.06)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(34,197,94,0.15)" },
  firstAidLabel: { color: "#22C55E", fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 8 },
  firstAidText: { color: "#9CA3AF", fontSize: 13, lineHeight: 20 },
  emergencyCta: { backgroundColor: "#EF4444", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, shadowColor: "#EF4444", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  emergencyCtaText: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 1 },
});
