
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const objects = [
  { id: 1, name: "ISS", type: "Satellite" },
  { id: 2, name: "Apophis", type: "Asteroid" },
  { id: 3, name: "Falcon 9", type: "Rocket" },
  { id: 4, name: "Hubble", type: "Satellite" }
];

export default function FilterScreen() {
  const [selectedType, setSelectedType] = useState("All");

  const filteredObjects =
    selectedType === "All"
      ? objects
      : objects.filter((item) => item.type === selectedType);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtreleme</Text>
      <Text style={styles.subtitle}>
        R8 - Uzay nesnelerini belirli kriterlere göre filtreleme.
      </Text>

      <View style={styles.filterRow}>
        {["All", "Satellite", "Asteroid", "Rocket"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedType === type && styles.activeButton
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={styles.filterText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredObjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>{item.type}</Text>
          </View>
        )}
      />
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
  }
});
