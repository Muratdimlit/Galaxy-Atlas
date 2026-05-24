
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { filterSpaceObjects } from "../services/api";

export default function FilterScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState("ALL");
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async (type) => {
    try {
      setSelectedType(type);
      setLoading(true);

      const data = await filterSpaceObjects(type);
      setObjects(data || []);
    } catch (error) {
      Alert.alert("Filtreleme Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderObject = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SpaceObjectDetail", { id: item.id })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.description}>
        {item.description || "Açıklama bulunmuyor."}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>R8 - Filtreleme</Text>
      <Text style={styles.subtitle}>
        Uzay nesneleri türlerine göre backend üzerinden filtrelenir.
      </Text>

      <View style={styles.filterRow}>
        {[
          { label: "Tümü", value: "ALL" },
          { label: "Asteroid", value: "ASTEROID" },
          { label: "Uydu", value: "SATELLITE" },
          { label: "Roket", value: "ROCKET" }
        ].map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.filterButton,
              selectedType === type.value && styles.activeButton
            ]}
            onPress={() => handleFilter(type.value)}
          >
            <Text style={styles.filterText}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f7cff" />
      ) : (
        <FlatList
          data={objects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderObject}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Filtrelemek için yukarıdan bir tür seç.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
    padding: 20,
    paddingTop: 55
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold"
  },
  subtitle: {
    color: "#b7c0d8",
    marginTop: 8,
    marginBottom: 18
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18
  },
  filterButton: {
    backgroundColor: "#161b2e",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  activeButton: {
    backgroundColor: "#4f7cff"
  },
  filterText: {
    color: "#ffffff"
  },
  card: {
    backgroundColor: "#161b2e",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12
  },
  name: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold"
  },
  type: {
    color: "#8fb3ff",
    marginTop: 4
  },
  description: {
    color: "#b7c0d8",
    marginTop: 6
  },
  emptyText: {
    color: "#b7c0d8",
    textAlign: "center",
    marginTop: 25
  }
});
