
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const sampleObjects = [
  { id: 1, name: "ISS", type: "Satellite", description: "Uluslararası Uzay İstasyonu" },
  { id: 2, name: "Apophis", type: "Asteroid", description: "Yakın geçiş yapan asteroid" },
  { id: 3, name: "Falcon 9", type: "Rocket", description: "SpaceX roket sistemi" }
];

export default function SpaceObjectsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uzay Nesneleri</Text>

      <FlatList
        data={sampleObjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SpaceObjectDetail", { object: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
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
  }
});
