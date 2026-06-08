import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getSpaceObjects } from "../services/api";

export default function MapScreen() {
  const [allObjects, setAllObjects] = useState([]);
  const [visibleObjects, setVisibleObjects] = useState([]);
  const [selectedType, setSelectedType] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      setLoading(true);

      const data = await getSpaceObjects();
      const safeData = Array.isArray(data) ? data : [];

      setAllObjects(safeData);
      setVisibleObjects(safeData);
      setSelectedType("ALL");
    } catch (error) {
      Alert.alert("Harita Hatası", error.message);
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

  const getMarkerColor = (type) => {
    const normalizedType = normalizeType(type);

    if (normalizedType === "SATELLITE") {
      return "blue";
    }

    if (normalizedType === "ASTEROID") {
      return "orange";
    }

    if (normalizedType === "ROCKET") {
      return "red";
    }

    return "purple";
  };

  const handleFilter = (type) => {
    setSelectedType(type);

    if (type === "ALL") {
      setVisibleObjects(allObjects);
      return;
    }

    const filtered = allObjects.filter(
      (item) => normalizeType(item.type) === type
    );

    setVisibleObjects(filtered);
  };

  const getSubtitle = () => {
    if (selectedType === "ASTEROID") {
      return "Harita üzerinde asteroid gösterme";
    }

    if (selectedType === "SATELLITE") {
      return "Harita üzerinde uydu gösterme";
    }

    if (selectedType === "ROCKET") {
      return "Harita üzerinde roket gösterme";
    }

    return "Harita üzerinde uzay nesneleri";
  };

  const getMarkerTitle = (item) => {
    return `${getTypeIcon(item.type)} ${item.name} (${item.type})`;
  };

  const getValidObjects = () => {
    return visibleObjects.filter(
      (item) =>
        item.latitude !== null &&
        item.longitude !== null &&
        !Number.isNaN(Number(item.latitude)) &&
        !Number.isNaN(Number(item.longitude))
    );
  };

  const validObjects = getValidObjects();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f7cff" />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Canlı Harita</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === "ALL" && styles.activeButton
            ]}
            onPress={() => handleFilter("ALL")}
          >
            <Text style={styles.filterText}>Tümü</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === "ASTEROID" && styles.activeButton
            ]}
            onPress={() => handleFilter("ASTEROID")}
          >
            <Text style={styles.filterText}>Asteroid</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === "SATELLITE" && styles.activeButton
            ]}
            onPress={() => handleFilter("SATELLITE")}
          >
            <Text style={styles.filterText}>Uydu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedType === "ROCKET" && styles.activeButton
            ]}
            onPress={() => handleFilter("ROCKET")}
          >
            <Text style={styles.filterText}>Roket</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "orange" }]} />
            <Text style={styles.legendText}>Asteroid</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "blue" }]} />
            <Text style={styles.legendText}>Uydu</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "red" }]} />
            <Text style={styles.legendText}>Roket</Text>
          </View>
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 25.0,
          longitude: 20.0,
          latitudeDelta: 90,
          longitudeDelta: 90
        }}
      >
        {validObjects.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: Number(item.latitude),
              longitude: Number(item.longitude)
            }}
            title={getMarkerTitle(item)}
            description={item.description || "Açıklama yok"}
            pinColor={getMarkerColor(item.type)}
          />
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Gösterilen nesne sayısı: {validObjects.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070b18"
  },
  center: {
    flex: 1,
    backgroundColor: "#070b18",
    justifyContent: "center",
    alignItems: "center"
  },
  headerBox: {
    backgroundColor: "#070b18",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 14
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: "#b7c0d8",
    marginTop: 6,
    marginBottom: 16,
    fontSize: 15
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  filterButton: {
    backgroundColor: "#111827",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 9,
    marginBottom: 6
  },
  activeButton: {
    backgroundColor: "#4f7cff",
    borderColor: "#6f8fff"
  },
  filterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800"
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 2
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6
  },
  legendText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700"
  },
  map: {
    flex: 1
  },
  footer: {
    backgroundColor: "#070b18",
    padding: 14,
    borderTopColor: "#263455",
    borderTopWidth: 1
  },
  footerText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800"
  },
  loadingText: {
    color: "#b7c0d8",
    marginTop: 12
  }
});