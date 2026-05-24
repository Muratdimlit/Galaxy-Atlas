
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SpaceObjectDetailScreen({ route }) {
  const { object } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{object.name}</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Tür</Text>
        <Text style={styles.value}>{object.type}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Açıklama</Text>
        <Text style={styles.value}>{object.description}</Text>
      </View>

      <Text style={styles.note}>
        R6 - Uzay nesnesi detay görüntüleme ekranı.
      </Text>
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
    fontWeight: "bold",
    marginBottom: 25
  },
  box: {
    backgroundColor: "#161b2e",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14
  },
  label: {
    color: "#8fb3ff",
    fontSize: 14,
    marginBottom: 5
  },
  value: {
    color: "#ffffff",
    fontSize: 17
  },
  note: {
    color: "#b7c0d8",
    marginTop: 20
  }
});
