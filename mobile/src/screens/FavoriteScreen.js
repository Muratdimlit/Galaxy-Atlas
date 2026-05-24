import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getSpaceObjects,
    addFavorite,
    removeFavorite,
    getFavoritesByUser
} from "../services/api";

export default function FavoritesScreen() {
    const [user, setUser] = useState(null);
    const [objects, setObjects] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            const storedUser = await AsyncStorage.getItem("user");

            if (!storedUser) {
                Alert.alert("Hata", "Kullanıcı bilgisi bulunamadı. Önce giriş yap.");
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            const objectData = await getSpaceObjects();
            const favoriteData = await getFavoritesByUser(parsedUser.id);

            setObjects(objectData || []);
            setFavorites(favoriteData || []);
        } catch (error) {
            Alert.alert("Favori Hatası", error.message);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (spaceObjectId) => {
        return favorites.some((fav) => fav.spaceObjectId === spaceObjectId);
    };

    const handleAddFavorite = async (spaceObjectId) => {
        if (!user) return;

        try {
            await addFavorite(user.id, spaceObjectId);
            Alert.alert("Başarılı", "Uzay nesnesi favorilere eklendi.");
            loadInitialData();
        } catch (error) {
            Alert.alert("Favori Ekleme Hatası", error.message);
        }
    };

    const handleRemoveFavorite = async (spaceObjectId) => {
        if (!user) return;

        try {
            await removeFavorite(user.id, spaceObjectId);
            Alert.alert("Başarılı", " Uzay nesnesi favorilerden çıkarıldı.");
            loadInitialData();
        } catch (error) {
            Alert.alert("Favori Silme Hatası", error.message);
        }
    };

    const favoriteObjects = objects.filter((object) => isFavorite(object.id));

    const renderObject = ({ item }) => {
        const favorite = isFavorite(item.id);

        return (
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.type}>{item.type}</Text>
                        <Text style={styles.description}>
                            {item.description || "Açıklama bulunmuyor."}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.favoriteButton, favorite && styles.removeButton]}
                        onPress={() =>
                            favorite
                                ? handleRemoveFavorite(item.id)
                                : handleAddFavorite(item.id)
                        }
                    >
                        <Text style={styles.buttonText}>
                            {favorite ? "R10 Çıkar" : "R9 Ekle"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f7cff" />
                <Text style={styles.loadingText}>Favoriler yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Berra - Favoriler</Text>
            <Text style={styles.subtitle}>
                R9 favoriye ekleme, R10 favoriden çıkarma, R11 favori listesini görüntüleme.
            </Text>

            <Text style={styles.sectionTitle}> Favori Listesi</Text>

            {favoriteObjects.length === 0 ? (
                <Text style={styles.emptyText}>Henüz favori nesne yok.</Text>
            ) : (
                favoriteObjects.map((item) => (
                    <View key={item.id} style={styles.favoriteBox}>
                        <Text style={styles.favoriteName}>{item.name}</Text>
                        <Text style={styles.favoriteType}>{item.type}</Text>
                    </View>
                ))
            )}

            <Text style={styles.sectionTitle}>Tüm Uzay Nesneleri</Text>

            <FlatList
                data={objects}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderObject}
                onRefresh={loadInitialData}
                refreshing={loading}
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
        marginBottom: 8
    },
    subtitle: {
        color: "#b7c0d8",
        marginBottom: 18
    },
    sectionTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 10
    },
    card: {
        backgroundColor: "#161b2e",
        borderColor: "#2f3b5f",
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginBottom: 12
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    info: {
        flex: 1
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
    description: {
        color: "#b7c0d8",
        marginTop: 6
    },
    favoriteButton: {
        backgroundColor: "#4f7cff",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10
    },
    removeButton: {
        backgroundColor: "#ef4444"
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    favoriteBox: {
        backgroundColor: "#111827",
        borderColor: "#4f7cff",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8
    },
    favoriteName: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    favoriteType: {
        color: "#8fb3ff",
        marginTop: 4
    },
    emptyText: {
        color: "#b7c0d8",
        marginBottom: 10
    },
    loadingText: {
        color: "#b7c0d8",
        marginTop: 12
    }
});