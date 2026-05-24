
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
import { getSpaceObjects } from "../services/api";

export default function SpaceObjectsScreen({ navigation }) {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      setLoading(true);
      const data = await getSpaceObjects();
      setObjects(data || []);
    } catch (error) {
      Alert.alert("Listeleme Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderObject = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SpaceObjectDetail", { id: item.id })}
    >
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.badge}>{item.type}</Text>
      </View>

      <Text style={styles.description}>
        {item.description || "Açıklama bulunmuyor."}
      </Text>

      <Text style={styles.location}>
        Enlem: {item.latitude} | Boylam: {item.longitude}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f7cff" />
        <Text style={styles.loadingText}>Uzay nesneleri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>R5 - Uzay Nesneleri</Text>
      <Text style={styles.subtitle}>
        Veriler Spring Boot REST API üzerinden getiriliyor.
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
  center: {
    flex: 1,
    backgroundColor: "#0b1020",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6
  },
  subtitle: {
    color: "#b7c0d8",
    marginBottom: 18
  },
  loadingText: {
    color: "#b7c0d8",
    marginTop: 12
  },
  card: {
    backgroundColor: "#161b2e",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  name: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1
  },
  badge: {
    color: "#ffffff",
    backgroundColor: "#4f7cff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
    overflow: "hidden"
  },
  description: {
    color: "#b7c0d8",
    marginTop: 8
  },
  location: {
    color: "#8fb3ff",
    marginTop: 8,
    fontSize: 13
  },
  emptyText: {
    color: "#b7c0d8",
    textAlign: "center",
    marginTop: 30
  }
});
