
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

export default function ProfileScreen() {
  const [name, setName] = useState("Murat");
  const [email, setEmail] = useState("murat@example.com");

  const updateProfile = () => {
    Alert.alert("Profil Güncelleme", "R3 profil güncelleme ekranı çalışıyor.");
  };

  const deleteAccount = () => {
    Alert.alert("Hesap Silme", "R4 hesap silme ekranı çalışıyor.");
  };

  return (
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
      />

      <TouchableOpacity style={styles.button} onPress={updateProfile}>
        <Text style={styles.buttonText}>R3 - Profili Güncelle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
        <Text style={styles.buttonText}>R4 - Hesabı Sil</Text>
      </TouchableOpacity>
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
