
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Eksik Bilgi", "E-posta ve şifre alanlarını doldur.");
      return;
    }

    // REST API bağlantısını bir sonraki adımda buraya ekleyeceğiz.
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galaxy Atlas</Text>
      <Text style={styles.subtitle}>Giriş Yap</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt ol</Text>
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
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 20,
    color: "#b7c0d8",
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
