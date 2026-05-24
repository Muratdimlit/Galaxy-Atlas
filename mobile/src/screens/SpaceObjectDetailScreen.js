
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { getSpaceObjectById } from "../services/api";

export default function SpaceObjectDetailScreen({ route }) {
  const { id } = route.params;
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const data = await getSpaceObjectById(id);
      setObject(data);
    } catch (error) {
      Alert.alert("Detay Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f7cff" />
        <Text style={styles.loadingText}>Detay bilgisi yükleniyor...</Text>
      </View>
    );
  }

  if (!object) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Uzay nesnesi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{object.name}</Text>
      <Text style={styles.requirement}> Detay Görüntüleme</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Tür</Text>
        <Text style={styles.value}>{object.type}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Açıklama</Text>
        <Text style={styles.value}>
          {object.description || "Açıklama bulunmuyor."}
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Konum Bilgisi</Text>
        <Text style={styles.value}>Enlem: {object.latitude}</Text>
        <Text style={styles.value}>Boylam: {object.longitude}</Text>
      </View>
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
  center: {
    flex: 1,
    backgroundColor: "#0b1020",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8
  },
  requirement: {
    color: "#8fb3ff",
    marginBottom: 20
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
    fontSize: 17,
    marginBottom: 4
  },
  loadingText: {
    color: "#b7c0d8",
    marginTop: 12
  },
  emptyText: {
    color: "#b7c0d8"
  }
});
