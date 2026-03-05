import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { BookOpen, Search, ChevronRight, Shield, Eye } from "lucide-react-native";

const SNAKES = [
  { id: "black-mamba", name: "Black Mamba", sci: "Dendroaspis polylepis", danger: "CRITICAL", accent: "#EF4444" },
  { id: "puff-adder", name: "Puff Adder", sci: "Bitis arietans", danger: "CRITICAL", accent: "#F59E0B" },
  { id: "mozambique-spitting-cobra", name: "Spitting Cobra", sci: "Naja mossambica", danger: "CRITICAL", accent: "#F59E0B" },
  { id: "boomslang", name: "Boomslang", sci: "Dispholidus typus", danger: "HIGH", accent: "#84CC16" },
  { id: "green-mamba", name: "Green Mamba", sci: "Dendroaspis angusticeps", danger: "HIGH", accent: "#4ADE80" },
  { id: "egyptian-cobra", name: "Egyptian Cobra", sci: "Naja haje", danger: "HIGH", accent: "#FB923C" },
  { id: "african-rock-python", name: "Rock Python", sci: "Python sebae", danger: "MEDIUM", accent: "#A78BFA" },
  { id: "rinkhals", name: "Rinkhals", sci: "Hemachatus haemachatus", danger: "HIGH", accent: "#F87171" },
];

const ARTICLES = [
  { id: "1", title: "What to Do If Bitten by a Puff Adder", author: "Dr. Tendai Moyo", views: 4821, type: "article" },
  { id: "2", title: "Black Mamba Identification Guide", author: "Dr. Tendai Moyo", views: 7234, type: "article" },
  { id: "3", title: "Snake Safety for Homeowners", author: "Sibongile Ncube", views: 2340, type: "tip" },
  { id: "4", title: "Spitting Cobra Eye Safety", author: "Marcus Fitzgerald", views: 3107, type: "tip" },
  { id: "5", title: "Boomslang: Most Underestimated Snake", author: "Ruvimbo Chikwanda", views: 1892, type: "article" },
];

export default function LibraryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredArticles = ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Library</Text>
          <Text style={styles.subtitle}>Learn. Prepare. Survive.</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search size={16} color="#4B5563" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search articles, tips..."
            placeholderTextColor="#4B5563"
            style={styles.searchInput}
          />
        </View>

        {/* Species encyclopedia */}
        <Text style={styles.sectionTitle}>8 Zimbabwe Species</Text>
        <FlatList
          data={SNAKES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item: s }) => (
            <TouchableOpacity
              style={[styles.snakeCard, { borderColor: `${s.accent}25` }]}
              onPress={() => router.push(`/snake/${s.id}` as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.snakeIcon, { backgroundColor: `${s.accent}15` }]}>
                <Shield size={26} color={s.accent} />
              </View>
              <Text style={styles.snakeName}>{s.name}</Text>
              <Text style={styles.snakeSci} numberOfLines={1}>{s.sci}</Text>
              <View style={[styles.dangerBadge, { backgroundColor: `${s.accent}20`, borderColor: `${s.accent}40` }]}>
                <Text style={[styles.dangerText, { color: s.accent }]}>{s.danger}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Articles */}
        <View style={styles.articlesHeader}>
          <Text style={styles.sectionTitle}>Articles & Tips</Text>
          <Text style={styles.articleCount}>{filteredArticles.length} items</Text>
        </View>

        <View style={styles.articlesList}>
          {filteredArticles.map((a) => (
            <TouchableOpacity key={a.id} style={styles.articleCard} activeOpacity={0.85}>
              <View style={[styles.articleType, { backgroundColor: a.type === "tip" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.12)" }]}>
                <BookOpen size={12} color={a.type === "tip" ? "#F59E0B" : "#22C55E"} />
                <Text style={[styles.articleTypeText, { color: a.type === "tip" ? "#F59E0B" : "#22C55E" }]}>
                  {a.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.articleTitle}>{a.title}</Text>
              <View style={styles.articleMeta}>
                <Text style={styles.articleAuthor}>{a.author}</Text>
                <View style={styles.articleViews}>
                  <Eye size={11} color="#4B5563" />
                  <Text style={styles.articleViewsText}>{a.views.toLocaleString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030A05" },
  header: { paddingTop: 64, paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "900", color: "#F0FDF4", marginBottom: 4 },
  subtitle: { color: "#4B5563", fontSize: 14 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 20, marginBottom: 24, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  searchInput: { flex: 1, color: "#F0FDF4", fontSize: 14 },
  sectionTitle: { color: "#F0FDF4", fontSize: 18, fontWeight: "700", paddingHorizontal: 20, marginBottom: 14 },
  snakeCard: { width: 130, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 14, alignItems: "center", borderWidth: 1 },
  snakeIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  snakeName: { color: "#F0FDF4", fontSize: 12, fontWeight: "700", textAlign: "center", marginBottom: 2 },
  snakeSci: { color: "#4B5563", fontSize: 9, fontStyle: "italic", textAlign: "center", marginBottom: 8 },
  dangerBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  dangerText: { fontSize: 9, fontWeight: "700" },
  articlesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 28, marginBottom: 14 },
  articleCount: { color: "#4B5563", fontSize: 12 },
  articlesList: { paddingHorizontal: 20, gap: 10 },
  articleCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  articleType: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  articleTypeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  articleTitle: { color: "#F0FDF4", fontSize: 14, fontWeight: "600", lineHeight: 20, marginBottom: 10 },
  articleMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  articleAuthor: { color: "#4B5563", fontSize: 12 },
  articleViews: { flexDirection: "row", alignItems: "center", gap: 4 },
  articleViewsText: { color: "#4B5563", fontSize: 11 },
});
