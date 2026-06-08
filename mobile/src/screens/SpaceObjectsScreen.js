import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getSpaceObjects,
  addFavorite,
  removeFavorite,
  getFavoritesByUser
} from "../services/api";
import SpaceBackground from "../components/SpaceBackground";

export default function SpaceObjectsScreen({ navigation }) {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      setUser(parsedUser);

      const objectData = await getSpaceObjects();
      setObjects(Array.isArray(objectData) ? objectData : []);

      if (parsedUser?.id) {
        const favoriteData = await getFavoritesByUser(parsedUser.id);
        setFavorites(Array.isArray(favoriteData) ? favoriteData : []);
      }
    } catch (error) {
      Alert.alert("Listeleme Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadObjects = async () => {
    try {
      setLoading(true);

      const data = await getSpaceObjects();
      setObjects(Array.isArray(data) ? data : []);

      if (user?.id) {
        const favoriteData = await getFavoritesByUser(user.id);
        setFavorites(Array.isArray(favoriteData) ? favoriteData : []);
      }
    } catch (error) {
      Alert.alert("Listeleme Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  const normalizeType = (type) => {
    const value = String(type || "").trim().toUpperCase();

    if (value === "UYDU" || value === "SATELLITE") {
      return "SATELLITE";
    }

    if (value === "ROKET" || value === "ROCKET") {
      return "ROCKET";
    }

    if (value === "ASTEROID" || value === "ASTEROİD" || value === "ASTEROIT") {
      return "ASTEROID";
    }

    return value;
  };

  const getTypeIcon = (type) => {
    const normalizedType = normalizeType(type);

    if (normalizedType === "SATELLITE") {
      return "🛰️";
    }

    if (normalizedType === "ROCKET") {
      return "🚀";
    }

    if (normalizedType === "ASTEROID") {
      return "☄️";
    }

    return "🌌";
  };

  const getTypeTheme = (type) => {
    const normalizedType = normalizeType(type);

    if (normalizedType === "SATELLITE") {
      return {
        card: styles.satelliteCard,
        badge: styles.satelliteBadge,
        glow: styles.satelliteGlow,
        location: styles.satelliteLocation,
        label: "UYDU"
      };
    }

    if (normalizedType === "ROCKET") {
      return {
        card: styles.rocketCard,
        badge: styles.rocketBadge,
        glow: styles.rocketGlow,
        location: styles.rocketLocation,
        label: "ROKET"
      };
    }

    if (normalizedType === "ASTEROID") {
      return {
        card: styles.asteroidCard,
        badge: styles.asteroidBadge,
        glow: styles.asteroidGlow,
        location: styles.asteroidLocation,
        label: "ASTEROID"
      };
    }

    return {
      card: styles.defaultCard,
      badge: styles.defaultBadge,
      glow: styles.defaultGlow,
      location: styles.defaultLocation,
      label: type || "NESNE"
    };
  };

  const isFavorite = (spaceObjectId) => {
    return favorites.some(
      (fav) => Number(fav.spaceObjectId) === Number(spaceObjectId)
    );
  };

  const handleToggleFavorite = async (spaceObjectId) => {
    if (!user?.id) {
      Alert.alert("Giriş Gerekli", "Favori eklemek için giriş yapmalısın.");
      return;
    }

    try {
      if (isFavorite(spaceObjectId)) {
        await removeFavorite(user.id, spaceObjectId);
        Alert.alert("Favoriler", "Uzay nesnesi favorilerden çıkarıldı.");
      } else {
        await addFavorite(user.id, spaceObjectId);
        Alert.alert("Favoriler", "Uzay nesnesi favorilere eklendi.");
      }

      const favoriteData = await getFavoritesByUser(user.id);
      setFavorites(Array.isArray(favoriteData) ? favoriteData : []);
    } catch (error) {
      Alert.alert("Favori Hatası", error.message);
    }
  };

  const handleGoComments = (item) => {
    navigation.navigate("Comments", {
      spaceObjectId: item.id,
      spaceObject: item
    });
  };

  const renderObject = ({ item }) => {
    const favorite = isFavorite(item.id);
    const theme = getTypeTheme(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, theme.card]}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("SpaceObjectDetail", {
            id: item.id,
            objectId: item.id,
            spaceObject: item
          })
        }
      >
        <View style={[styles.glowBar, theme.glow]} />

        <View style={styles.cardHeader}>
          <View style={styles.cardTitleArea}>
            <View style={styles.nameRow}>
              <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>

            <Text style={styles.description}>
              {item.description || "Açıklama bulunmuyor."}
            </Text>
          </View>

          <Text style={[styles.badge, theme.badge]}>{theme.label}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.location, theme.location]}>
            📍 Enlem: {item.latitude} | Boylam: {item.longitude}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              favorite && styles.favoriteActiveButton
            ]}
            activeOpacity={0.85}
            onPress={(event) => {
              event.stopPropagation();
              handleToggleFavorite(item.id);
            }}
          >
            <Text style={styles.actionIcon}>{favorite ? "★" : "☆"}</Text>
            <Text style={styles.actionText}>
              {favorite ? "Favorilerde" : "Favorile"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.commentButton}
            activeOpacity={0.85}
            onPress={(event) => {
              event.stopPropagation();
              handleGoComments(item);
            }}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Yorum Yap</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SpaceBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4f7cff" />
          <Text style={styles.loadingText}>Uzay nesneleri yükleniyor...</Text>
        </View>
      </SpaceBackground>
    );
  }

  return (
    <SpaceBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Uzay Nesneleri</Text>
        <Text style={styles.subtitle}>
          Çeşitli uzay nesnelerinin takibi yapılıyor...
        </Text>

        <FlatList
          data={objects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderObject}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz uzay nesnesi bulunamadı.</Text>
          }
          refreshing={loading}
          onRefresh={loadObjects}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    paddingTop: 55
  },
  center: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 6
  },
  subtitle: {
    color: "#c6d0ea",
    marginBottom: 18,
    fontSize: 15
  },
  loadingText: {
    color: "#b7c0d8",
    marginTop: 12
  },
  listContent: {
    paddingBottom: 35
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
    marginBottom: 15,
    overflow: "hidden",
    position: "relative"
  },
  satelliteCard: {
    backgroundColor: "rgba(11, 18, 48, 0.88)",
    borderColor: "rgba(91, 141, 255, 0.75)"
  },
  rocketCard: {
    backgroundColor: "rgba(47, 14, 24, 0.88)",
    borderColor: "rgba(255, 88, 88, 0.8)"
  },
  asteroidCard: {
    backgroundColor: "rgba(45, 30, 9, 0.9)",
    borderColor: "rgba(255, 176, 59, 0.85)"
  },
  defaultCard: {
    backgroundColor: "rgba(16, 23, 42, 0.82)",
    borderColor: "rgba(110, 143, 255, 0.35)"
  },
  glowBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 7
  },
  satelliteGlow: {
    backgroundColor: "#4f7cff"
  },
  rocketGlow: {
    backgroundColor: "#ff3b3b"
  },
  asteroidGlow: {
    backgroundColor: "#ffad32"
  },
  defaultGlow: {
    backgroundColor: "#8b5cf6"
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10
  },
  cardTitleArea: {
    flex: 1,
    paddingRight: 10
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 8
  },
  name: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "900",
    flexShrink: 1
  },
  badge: {
    color: "#ffffff",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 12,
    overflow: "hidden",
    fontWeight: "900",
    letterSpacing: 1
  },
  satelliteBadge: {
    backgroundColor: "rgba(79, 124, 255, 0.95)"
  },
  rocketBadge: {
    backgroundColor: "rgba(255, 59, 59, 0.95)"
  },
  asteroidBadge: {
    backgroundColor: "rgba(255, 173, 50, 0.95)"
  },
  defaultBadge: {
    backgroundColor: "#4f7cff"
  },
  description: {
    color: "#d8e0f5",
    fontSize: 15,
    lineHeight: 22
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 4,
    marginBottom: 14
  },
  location: {
    fontSize: 14,
    fontWeight: "800"
  },
  satelliteLocation: {
    color: "#9dbdff"
  },
  rocketLocation: {
    color: "#ffaaaa"
  },
  asteroidLocation: {
    color: "#ffd38a"
  },
  defaultLocation: {
    color: "#8fb3ff"
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4
  },
  actionButton: {
    flex: 1,
    backgroundColor: "rgba(24, 35, 58, 0.9)",
    borderWidth: 1,
    borderColor: "#2c395b",
    borderRadius: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  favoriteActiveButton: {
    backgroundColor: "rgba(255, 193, 7, 0.18)",
    borderColor: "#ffc107"
  },
  commentButton: {
    flex: 1,
    backgroundColor: "rgba(79, 124, 255, 0.22)",
    borderWidth: 1,
    borderColor: "#4f7cff",
    borderRadius: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  actionIcon: {
    fontSize: 17,
    marginRight: 7
  },
  actionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900"
  },
  emptyText: {
    color: "#b7c0d8",
    textAlign: "center",
    marginTop: 30
  }
});