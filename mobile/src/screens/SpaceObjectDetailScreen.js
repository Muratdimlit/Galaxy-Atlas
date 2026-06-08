import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal
} from "react-native";
import { getSpaceObjectById } from "../services/api";
import { getObjectImages } from "../data/objectImages";
import SpaceBackground from "../components/SpaceBackground";

export default function SpaceObjectDetailScreen({ route, navigation }) {
  const [spaceObject, setSpaceObject] = useState(
    route?.params?.spaceObject || null
  );
  const [loading, setLoading] = useState(!route?.params?.spaceObject);
  const [selectedImage, setSelectedImage] = useState(null);

  const objectId =
    route?.params?.objectId ||
    route?.params?.id ||
    route?.params?.spaceObject?.id;

  useEffect(() => {
    if (!spaceObject) {
      loadDetail();
    }
  }, []);

  const loadDetail = async () => {
    if (!objectId) {
      Alert.alert("Detay Hatası", "Nesne bilgisi alınamadı.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getSpaceObjectById(objectId);
      setSpaceObject(data);
    } catch (error) {
      Alert.alert("Detay Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SpaceBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#5b8cff" />
          <Text style={styles.loadingText}>Nesne detayı yükleniyor...</Text>
        </View>
      </SpaceBackground>
    );
  }

  if (!spaceObject) {
    return (
      <SpaceBackground>
        <View style={styles.center}>
          <Text style={styles.errorText}>Nesne detayı bulunamadı.</Text>
        </View>
      </SpaceBackground>
    );
  }

  const images = getObjectImages(spaceObject.name, spaceObject.type);

  return (
    <SpaceBackground>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{spaceObject.name}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{spaceObject.type}</Text>
        </View>

        {images.length > 0 && (
          <>
            <Image source={images[0]} style={styles.heroImage} />

            <Text style={styles.sectionTitle}>Fotoğraflar</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryRow}
            >
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(img)}
                  activeOpacity={0.85}
                >
                  <Image source={img} style={styles.thumbnail} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Açıklama</Text>
          <Text style={styles.cardText}>
            {spaceObject.description || "Açıklama bulunmuyor."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Konum Bilgileri</Text>
          <Text style={styles.cardText}>Enlem: {spaceObject.latitude}</Text>
          <Text style={styles.cardText}>Boylam: {spaceObject.longitude}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kimlik Bilgisi</Text>
          <Text style={styles.cardText}>ID: {spaceObject.id}</Text>
        </View>

        <Modal visible={!!selectedImage} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalCloseArea}
              onPress={() => setSelectedImage(null)}
              activeOpacity={1}
            >
              <Image
                source={{selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <Text style={styles.closeText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 22,
    paddingTop: 60,
    paddingBottom: 40
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: 12,
    color: "#b9c4de",
    fontSize: 15
  },
  errorText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700"
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 18
  },
  backText: {
    color: "#d9e3ff",
    fontSize: 18,
    fontWeight: "600"
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 12
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#5b8cff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 18
  },
  badgeText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14
  },
  heroImage: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    marginBottom: 20
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14
  },
  galleryRow: {
    paddingBottom: 10
  },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#2d4378"
  },
  card: {
    backgroundColor: "rgba(17, 24, 39, 0.92)",
    borderWidth: 1,
    borderColor: "#24365f",
    borderRadius: 22,
    padding: 18,
    marginTop: 16
  },
  cardTitle: {
    color: "#84a8ff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8
  },
  cardText: {
    color: "#e8eeff",
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalCloseArea: {
    width: "100%",
    alignItems: "center"
  },
  fullImage: {
    width: "100%",
    height: "80%",
    borderRadius: 18
  },
  closeText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 18
  }
});