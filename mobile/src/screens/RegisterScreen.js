
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert("Eksik Bilgi", "Ad, e-posta ve şifre alanlarını doldur.");
      return;
    }

    // REST API bağlantısını bir sonraki adımda buraya ekleyeceğiz.
    Alert.alert("Başarılı", "Kayıt ekranı çalışıyor.");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hesap Oluştur</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        placeholderTextColor="#8b949e"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#8b949e"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#8b949e"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
    justifyContent: "center",
    padding: 24
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 30
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
    marginTop: 8
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold"
  },
  link: {
    color: "#8fb3ff",
    textAlign: "center",
    marginTop: 18
  }
});
