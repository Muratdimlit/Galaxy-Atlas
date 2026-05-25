
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUser, deleteUser } from "../services/api";
import SpaceBackground from "../components/SpaceBackground";


export default function ProfileScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setName(user.name || "");
      setEmail(user.email || "");
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      Alert.alert("Hata", "Kullanıcı bilgisi bulunamadı. Tekrar giriş yap.");
      return;
    }

    if (!name || !email) {
      Alert.alert("Eksik Bilgi", "Ad ve e-posta alanları boş bırakılamaz.");
      return;
    }

    try {
      setLoading(true);

      const data = await updateUser(userId, name, email, password);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Başarılı", data.message || "Profil güncellendi.");
      setPassword("");
    } catch (error) {
      Alert.alert("Güncelleme Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      Alert.alert("Hata", "Kullanıcı bilgisi bulunamadı.");
      return;
    }

    Alert.alert(
      "Hesabı Sil",
      "Hesabını silmek istediğine emin misin?",
      [
        {
          text: "Vazgeç",
          style: "cancel"
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              const data = await deleteUser(userId);

              await AsyncStorage.removeItem("user");

              Alert.alert("Başarılı", data.message || "Hesap silindi.");
              navigation.replace("Login");
            } catch (error) {
              Alert.alert("Silme Hatası", error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SpaceBackground>
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ad Soyad"
        placeholderTextColor="#8b949e"
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        placeholderTextColor="#8b949e"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Yeni şifre boş bırakılabilir"
        placeholderTextColor="#8b949e"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}> Profili Güncelle</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        <Text style={styles.buttonText}> Hesabı Sil</Text>
      </TouchableOpacity>
    </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    paddingTop: 55
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25
  },
  input: {
    backgroundColor: "#161b2e",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#2f3b5f",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14
  },
  button: {
    backgroundColor: "#4f7cff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold"
  }
});
