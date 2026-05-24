import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getSpaceObjects, filterSpaceObjects } from "../services/api";

export default function MapScreen() {
    const [objects, setObjects] = useState([]);
    const [selectedType, setSelectedType] = useState("ALL");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadObjects("ALL");
    }, []);

    const loadObjects = async (type) => {
        try {
            setSelectedType(type);
            setLoading(true);

            const data =
                type === "ALL" ? await getSpaceObjects() : await filterSpaceObjects(type);

            setObjects(data || []);
        } catch (error) {
            Alert.alert("Harita Hatası", error.message);
        } finally {
            setLoading(false);
        }
    };

    const getRequirementText = () => {
        if (selectedType === "ASTEROID") {
            return " Harita üzerinde asteroid gösterme";
        }

        if (selectedType === "SATELLITE") {
            return " Harita üzerinde uydu gösterme";
        }

        if (selectedType === "ROCKET") {
            return " Harita üzerinde roket gösterme";
        }

        return " Harita üzerinde uzay nesneleri";
    };

    const getMarkerTitle = (item) => {
        return `${item.name} (${item.type})`;
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f7cff" />
                <Text style={styles.loadingText}>Harita yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.title}>Berra - Harita</Text>
                <Text style={styles.subtitle}>{getRequirementText()}</Text>

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            selectedType === "ALL" && styles.activeButton
                        ]}
                        onPress={() => loadObjects("ALL")}
                    >
                        <Text style={styles.filterText}>Tümü</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            selectedType === "ASTEROID" && styles.activeButton
                        ]}
                        onPress={() => loadObjects("ASTEROID")}
                    >
                        <Text style={styles.filterText}>Asteroid</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            selectedType === "SATELLITE" && styles.activeButton
                        ]}
                        onPress={() => loadObjects("SATELLITE")}
                    >
                        <Text style={styles.filterText}>Uydu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            selectedType === "ROCKET" && styles.activeButton
                        ]}
                        onPress={() => loadObjects("ROCKET")}
                    >
                        <Text style={styles.filterText}>Roket</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 39.0,
                    longitude: 35.0,
                    latitudeDelta: 40,
                    longitudeDelta: 40
                }}
            >
                {objects.map((item) => (
                    <Marker
                        key={item.id}
                        coordinate={{
                            latitude: Number(item.latitude),
                            longitude: Number(item.longitude)
                        }}
                        title={getMarkerTitle(item)}
                        description={item.description || "Açıklama yok"}
                    />
                ))}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Gösterilen nesne sayısı: {objects.length}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0b1020"
    },
    center: {
        flex: 1,
        backgroundColor: "#0b1020",
        justifyContent: "center",
        alignItems: "center"
    },
    headerBox: {
        backgroundColor: "#0b1020",
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 12
    },
    title: {
        color: "#ffffff",
        fontSize: 26,
        fontWeight: "bold"
    },
    subtitle: {
        color: "#b7c0d8",
        marginTop: 4,
        marginBottom: 12
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    filterButton: {
        backgroundColor: "#161b2e",
        borderColor: "#2f3b5f",
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginRight: 8,
        marginBottom: 6
    },
    activeButton: {
        backgroundColor: "#4f7cff"
    },
    filterText: {
        color: "#ffffff",
        fontSize: 13
    },
    map: {
        flex: 1
    },
    footer: {
        backgroundColor: "#0b1020",
        padding: 12,
        borderTopColor: "#2f3b5f",
        borderTopWidth: 1
    },
    footerText: {
        color: "#ffffff",
        textAlign: "center"
    },
    loadingText: {
        color: "#b7c0d8",
        marginTop: 12
    }
});