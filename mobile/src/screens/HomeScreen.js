import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SpaceBackground from "../components/SpaceBackground";

export default function HomeScreen({ navigation, route }) {
  const [user, setUser] = useState(route?.params?.user || null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Kullanıcı okunamadı:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabından çıkmak istediğine emin misin?",
      [
        {
          text: "Vazgeç",
          style: "cancel"
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      title: "Uzay Nesneleri",
      description: "Asteroid, uydu ve roketleri listele; detaylarını görüntüle.",
      icon: "🛰️",
      screen: "SpaceObjects"
    },
    {
      title: "Akıllı Filtreleme",
      description: "Uzay nesnelerini türlerine göre hızlıca filtrele.",
      icon: "🔎",
      screen: "Filter"
    },
    {
      title: "Nesne Karşılaştırma",
      description: "İki farklı uzay nesnesini yan yana karşılaştır.",
      icon: "⚖️",
      screen: "Compare"
    },
    {
      title: "Favorilerim",
      description: "Beğendiğin uzay nesnelerini favorilerine ekle ve takip et.",
      icon: "⭐",
      screen: "Favorites"
    },
    {
      title: "Canlı Harita",
      description: "Asteroid, uydu ve roketleri harita üzerinde görüntüle.",
      icon: "🗺️",
      screen: "Map"
    },
    {
      title: "Yorumlar",
      description: "Uzay nesneleri hakkında yorum yap, düzenle veya sil.",
      icon: "💬",
      screen: "Comments"
    }
  ];

  return (
    <SpaceBackground>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
  <View style={styles.titleArea}>
    <Text style={styles.appName}>Galaxy Atlas</Text>
    <Text style={styles.welcomeText}>
      {user?.name ? `Hoş geldin, ${user.name}` : "Uzay takip paneline hoş geldin"}
    </Text>
  </View>

  <View style={styles.topActions}>
    <TouchableOpacity
      style={styles.profileButton}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("Profile")}
    >
      <Text style={styles.profileIcon}>👤</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutText}>Çıkış</Text>
    </TouchableOpacity>
  </View>
</View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <Text style={styles.heroIcon}>🚀</Text>
          </View>

          <Text style={styles.heroTitle}>Roket, Uydu ve Göktaşı Takip Sistemi</Text>
          <Text style={styles.heroText}>
            Uzay nesnelerini keşfet, karşılaştır, favorilerine ekle ve harita üzerinde takip et.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kontrol Paneli</Text>
          <Text style={styles.sectionSubtitle}>
            Kullanmak istediğin özelliği seç
          </Text>
        </View>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>{item.description}</Text>
              </View>
            </View>

            <View style={styles.arrowBox}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomInfo}>
          <Text style={styles.bottomTitle}>Galaxy Atlas Mobil</Text>
          <Text style={styles.bottomText}>
            Tüm işlemler mobil arayüz üzerinden Spring Boot REST API ile bağlantılı çalışır.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent"
  },
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35
  },
  topBar: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 20
},
titleArea: {
  flex: 1,
  paddingRight: 12
},
topActions: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginTop: 5
},
profileButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#172033",
  borderWidth: 1,
  borderColor: "#2c395b",
  justifyContent: "center",
  alignItems: "center"
},
profileIcon: {
  fontSize: 20
},
  appName: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.3
  },
  welcomeText: {
    color: "#9ca8c7",
    fontSize: 15,
    marginTop: 5
  },
  logoutButton: {
  backgroundColor: "#172033",
  borderWidth: 1,
  borderColor: "#2c395b",
  paddingVertical: 10,
  paddingHorizontal: 13,
  borderRadius: 999
},
logoutText: {
  color: "#ff6b6b",
  fontWeight: "800",
  fontSize: 12
},
  heroCard: {
  backgroundColor: "rgba(16, 23, 42, 0.82)",
  borderWidth: 1,
  borderColor: "rgba(110, 143, 255, 0.35)",
  borderRadius: 24,
  padding: 20,
  marginBottom: 24
},
  heroIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#1a2a4a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#314878"
  },
  heroIcon: {
    fontSize: 27
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 31
  },
  heroText: {
    color: "#b3bdd8",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900"
  },
  sectionSubtitle: {
    color: "#8f9aba",
    fontSize: 14,
    marginTop: 3
  },
 card: {
  backgroundColor: "rgba(16, 23, 42, 0.78)",
  borderWidth: 1,
  borderColor: "rgba(110, 143, 255, 0.28)",
  borderRadius: 20,
  padding: 16,
  marginBottom: 13,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
},
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#18233a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#2c395b"
  },
  icon: {
    fontSize: 23
  },
  cardInfo: {
    flex: 1
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "900"
  },
  cardText: {
    color: "#aeb8d4",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7
  },
  arrowBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#18233a",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8
  },
  arrow: {
    color: "#8fa3d1",
    fontSize: 26,
    fontWeight: "300",
    marginTop: -2
  },
  bottomInfo: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#263455",
    borderRadius: 18,
    padding: 16,
    marginTop: 8
  },
  bottomTitle: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 6
  },
  bottomText: {
    color: "#aeb8d4",
    fontSize: 14,
    lineHeight: 20
  }
});