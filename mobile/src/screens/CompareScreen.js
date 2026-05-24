
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CompareScreen() {
  const [compared, setCompared] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karşılaştırma</Text>
      <Text style={styles.subtitle}>
        R7 - İki veya daha fazla uzay nesnesini karşılaştırma ekranı.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => setCompared(true)}>
        <Text style={styles.buttonText}>ISS ve Apophis Karşılaştır</Text>
      </TouchableOpacity>

      {compared && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Karşılaştırma Sonucu</Text>
          <Text style={styles.resultText}>ISS türü: Satellite</Text>
          <Text style={styles.resultText}>Apophis türü: Asteroid</Text>
          <Text style={styles.resultText}>
            Biri yapay uydu, diğeri doğal gök cismidir.
          </Text>
        </View>
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
    marginBottom: 20
  },
  button: {
    backgroundColor: "#4f7cff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  resultBox: {
    backgroundColor: "#161b2e",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 20
  },
  resultTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  resultText: {
    color: "#b7c0d8",
    marginBottom: 6
  }
});
