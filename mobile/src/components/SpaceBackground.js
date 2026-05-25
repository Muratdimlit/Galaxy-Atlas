import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function SpaceBackground({ children }) {
  return (
    <ImageBackground
      source={require("../../assets/space-bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(3, 8, 24, 0.58)"
  }
});