
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SpaceObjectsScreen from "./src/screens/SpaceObjectsScreen";
import SpaceObjectDetailScreen from "./src/screens/SpaceObjectDetailScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CompareScreen from "./src/screens/CompareScreen";
import FilterScreen from "./src/screens/FilterScreen";
import FavoritesScreen from "./src/screens/FavoriteScreen";
import CommentsScreen from "./src/screens/CommentScreen";
import MapScreen from "./src/screens/MapScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#0b1020",
            },
            headerTintColor: "#ffffff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              backgroundColor: "#0b1020",
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Kayıt Ol" }}
          />

          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SpaceObjects"
            component={SpaceObjectsScreen}
            options={{ title: "Uzay Nesneleri" }}
          />

          <Stack.Screen
            name="SpaceObjectDetail"
            component={SpaceObjectDetailScreen}
            options={{ title: "Nesne Detayı" }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profil" }}
          />

          <Stack.Screen
            name="Compare"
            component={CompareScreen}
            options={{ title: "Karşılaştırma" }}
          />

          <Stack.Screen
            name="Filter"
            component={FilterScreen}
            options={{ title: "Filtreleme" }}
          />

          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ title: "Favoriler" }}
          />
          <Stack.Screen
            name="Comments"
            component={CommentsScreen}
            options={{ title: "Yorumlar" }}
          />

          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: "Harita" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
