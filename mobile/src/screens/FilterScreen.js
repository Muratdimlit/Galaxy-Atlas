import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { getSpaceObjects } from "../services/api";
import SpaceBackground from "../components/SpaceBackground";


export default function FilterScreen({ navigation }) {
  const [allObjects, setAllObjects] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
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
      setFilteredObjects(safeData);
      setSelectedType("ALL");
    } catch (error) {
      Alert.alert("Filtreleme Hatası", error.message);
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

  const handleFilter = (type) => {
    setSelectedType(type);

    if (type === "ALL") {
      setFilteredObjects(allObjects);
      return;
    }

    const result = allObjects.filter(
      (item) => normalizeType(item.type) === type
    );

    setFilteredObjects(result);
  };

  const getSubtitle = () => {
    if (selectedType === "ASTEROID") {
      return "Asteroid türündeki uzay nesneleri listeleniyor.";
    }

    if (selectedType === "SATELLITE") {
      return "Uydu türündeki uzay nesneleri listeleniyor.";
    }

    if (selectedType === "ROCKET") {
      return "Roket türündeki uzay nesneleri listeleniyor.";
    }

    return "Tüm uzay nesneleri listeleniyor.";
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
  navigation.navigate("SpaceObjectDetail", {
    id: item.id,
    objectId: item.id,
    spaceObject: item
  })
}
    >
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.objectName}>{item.name}</Text>
          <Text style={styles.objectType}>{item.type}</Text>
        </View>

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.type}</Text>
        </View>
      </View>

      <Text style={styles.description}>
        {item.description || "Açıklama bulunmuyor."}
      </Text>

      <View style={styles.locationBox}>
        <Text style={styles.locationText}>
          Konum: {item.latitude}, {item.longitude}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f7cff" />
        <Text style={styles.loadingText}>Filtreleme ekranı yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SpaceBackground>
    <View style={styles.container}>
      <Text style={styles.title}>Filtreleme</Text>
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

      <Text style={styles.countText}>
        Gösterilen nesne sayısı: {filteredObjects.length}
      </Text>

      <FlatList
        data={filteredObjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nesne bulunamadı</Text>
            <Text style={styles.emptyText}>
              Seçilen tür için kayıtlı uzay nesnesi yok.
            </Text>
          </View>
        }
      />
    </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: 55
  },
  center: {
    flex: 1,
    backgroundColor: "#070b18",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8
  },
  subtitle: {
    color: "#aeb8d4",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14
  },
  filterButton: {
    backgroundColor: "#111827",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 9,
    marginBottom: 9
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
  countText: {
    color: "#8fb3ff",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12
  },
  listContent: {
    paddingBottom: 30
  },
  card: {
    backgroundColor: "#10172a",
    borderColor: "#263455",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 13
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10
  },
  objectName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900"
  },
  objectType: {
    color: "#8fb3ff",
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800"
  },
  typeBadge: {
    backgroundColor: "#1a2a4a",
    borderColor: "#314878",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999
  },
  typeBadgeText: {
    color: "#dbe7ff",
    fontSize: 11,
    fontWeight: "900"
  },
  description: {
    color: "#b7c0d8",
    fontSize: 15,
    lineHeight: 22
  },
  locationBox: {
    backgroundColor: "#172033",
    borderColor: "#263455",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 12
  },
  locationText: {
    color: "#aeb8d4",
    fontSize: 13
  },
  emptyBox: {
    backgroundColor: "#10172a",
    borderColor: "#263455",
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginTop: 30
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6
  },
  emptyText: {
    color: "#aeb8d4",
    textAlign: "center",
    lineHeight: 20
  },
  loadingText: {
    color: "#b7c0d8",
    marginTop: 12
  }
});