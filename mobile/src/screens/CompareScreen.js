
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { getSpaceObjects, compareSpaceObjects } from "../services/api";

export default function CompareScreen() {
  const [objects, setObjects] = useState([]);
  const [firstObject, setFirstObject] = useState(null);
  const [secondObject, setSecondObject] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const selectObject = (object) => {
    if (!firstObject) {
      setFirstObject(object);
      return;
    }

    if (!secondObject && firstObject.id !== object.id) {
      setSecondObject(object);
      return;
    }

    setFirstObject(object);
    setSecondObject(null);
    setCompareResult(null);
  };

  const handleCompare = async () => {
    if (!firstObject || !secondObject) {
      Alert.alert("Eksik Seçim", "Karşılaştırmak için iki farklı nesne seç.");
      return;
    }

    try {
      setLoading(true);
      const data = await compareSpaceObjects(firstObject.id, secondObject.id);
      setCompareResult(data);
    } catch (error) {
      Alert.alert("Karşılaştırma Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (object) => {
    return firstObject?.id === object.id || secondObject?.id === object.id;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}> Karşılaştırma</Text>
      <Text style={styles.subtitle}>
        İki uzay nesnesi seçilir ve backend compare endpointi ile karşılaştırılır.
      </Text>

      <Text style={styles.sectionTitle}>Nesne Seç</Text>

      {objects.map((object) => (
        <TouchableOpacity
          key={object.id}
          style={[styles.card, isSelected(object) && styles.selectedCard]}
          onPress={() => selectObject(object)}
        >
          <Text style={styles.name}>{object.name}</Text>
          <Text style={styles.type}>{object.type}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.selectionBox}>
        <Text style={styles.selectionText}>
          1. Nesne: {firstObject ? firstObject.name : "Seçilmedi"}
        </Text>
        <Text style={styles.selectionText}>
          2. Nesne: {secondObject ? secondObject.name : "Seçilmedi"}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCompare}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Karşılaştır</Text>
        )}
      </TouchableOpacity>

      {compareResult && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>
            {compareResult.message || "Karşılaştırma sonucu"}
          </Text>

          <View style={styles.compareRow}>
            <View style={styles.compareColumn}>
              <Text style={styles.compareName}>
                {compareResult.firstObject.name}
              </Text>
              <Text style={styles.compareText}>
                Tür: {compareResult.firstObject.type}
              </Text>
              <Text style={styles.compareText}>
                Enlem: {compareResult.firstObject.latitude}
              </Text>
              <Text style={styles.compareText}>
                Boylam: {compareResult.firstObject.longitude}
              </Text>
            </View>

            <View style={styles.compareColumn}>
              <Text style={styles.compareName}>
                {compareResult.secondObject.name}
              </Text>
              <Text style={styles.compareText}>
                Tür: {compareResult.secondObject.type}
              </Text>
              <Text style={styles.compareText}>
                Enlem: {compareResult.secondObject.latitude}
              </Text>
              <Text style={styles.compareText}>
                Boylam: {compareResult.secondObject.longitude}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020"
  },
  content: {
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
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  card: {
    backgroundColor: "#161b2e",
    borderColor: "#2f3b5f",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10
  },
  selectedCard: {
    borderColor: "#4f7cff",
    borderWidth: 2
  },
  name: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold"
  },
  type: {
    color: "#8fb3ff",
    marginTop: 4
  },
  selectionBox: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    marginBottom: 14
  },
  selectionText: {
    color: "#ffffff",
    marginBottom: 6
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
    marginBottom: 12
  },
  compareRow: {
    flexDirection: "row",
    gap: 10
  },
  compareColumn: {
    flex: 1,
    backgroundColor: "#0b1020",
    borderRadius: 10,
    padding: 10
  },
  compareName: {
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 8
  },
  compareText: {
    color: "#b7c0d8",
    marginBottom: 5,
    fontSize: 13
  }
});
