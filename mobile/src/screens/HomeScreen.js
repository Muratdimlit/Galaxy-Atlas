
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Galaxy Atlas</Text>
      <Text style={styles.subtitle}>Murat Gereksinimleri</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("SpaceObjects")}>
        <Text style={styles.cardTitle}>R5 - Uzay Nesnelerini Listeleme</Text>
        <Text style={styles.cardText}>Asteroid, uydu ve roketleri listele.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Filter")}>
        <Text style={styles.cardTitle}>R8 - Filtreleme</Text>
        <Text style={styles.cardText}>Uzay nesnelerini türe göre filtrele.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Compare")}>
        <Text style={styles.cardTitle}>R7 - Karşılaştırma</Text>
        <Text style={styles.cardText}>İki uzay nesnesini karşılaştır.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.cardTitle}>R3 / R4 - Profil İşlemleri</Text>
        <Text style={styles.cardText}>Profil güncelleme ve hesap silme.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace("Login")}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020"
  },
  content: {
    padding: 20,
    paddingTop: 55
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6
  },
  subtitle: {
    fontSize: 16,
    color: "#b7c0d8",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#161b2e",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6
  },
  cardText: {
    color: "#b7c0d8",
    fontSize: 14
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "bold"
  }
});
