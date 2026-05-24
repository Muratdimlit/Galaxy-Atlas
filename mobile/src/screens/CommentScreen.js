import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getSpaceObjects,
    getCommentsBySpaceObject,
    addComment,
    updateComment,
    deleteComment
} from "../services/api";

export default function CommentsScreen() {
    const [user, setUser] = useState(null);
    const [objects, setObjects] = useState([]);
    const [selectedObject, setSelectedObject] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            return parsedUser;
        }

        // Berra branch'te auth dosyaları yoksa ekran test edilebilsin diye geçici demo user.
        // Main birleşiminde Murat auth sistemi gelince gerçek kullanıcı kullanılacak.
        const demoUser = {
            id: 1,
            name: "Demo Kullanıcı",
            email: "demo@example.com"
        };

        setUser(demoUser);
        return demoUser;
    };

    const loadObjects = async () => {
        try {
            setLoading(true);
            await loadUser();

            const data = await getSpaceObjects();
            setObjects(data || []);

            if (data && data.length > 0) {
                setSelectedObject(data[0]);
                await loadComments(data[0].id);
            }
        } catch (error) {
            Alert.alert("Yorum Ekranı Hatası", error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async (spaceObjectId) => {
        try {
            const data = await getCommentsBySpaceObject(spaceObjectId);
            setComments(data || []);
        } catch (error) {
            Alert.alert("Yorum Listeleme Hatası", error.message);
        }
    };

    const handleSelectObject = async (object) => {
        setSelectedObject(object);
        setContent("");
        setEditingCommentId(null);
        await loadComments(object.id);
    };

    const handleSubmitComment = async () => {
        if (!selectedObject) {
            Alert.alert("Hata", "Önce bir uzay nesnesi seç.");
            return;
        }

        if (!content.trim()) {
            Alert.alert("Eksik Bilgi", "Yorum içeriği boş olamaz.");
            return;
        }

        try {
            if (editingCommentId) {
                await updateComment(editingCommentId, content);
                Alert.alert("Başarılı", " Yorum güncellendi.");
            } else {
                await addComment(user.id, selectedObject.id, content);
                Alert.alert("Başarılı", " Yorum eklendi.");
            }

            setContent("");
            setEditingCommentId(null);
            await loadComments(selectedObject.id);
        } catch (error) {
            Alert.alert("Yorum İşlem Hatası", error.message);
        }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setContent(comment.content);
    };

    const handleDeleteComment = async (commentId) => {
        Alert.alert(
            "Yorumu Sil",
            "Bu yorumu silmek istediğine emin misin?",
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
                            await deleteComment(commentId);
                            Alert.alert("Başarılı", " Yorum silindi.");
                            await loadComments(selectedObject.id);
                        } catch (error) {
                            Alert.alert("Yorum Silme Hatası", error.message);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f7cff" />
                <Text style={styles.loadingText}>Yorum ekranı yükleniyor...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Berra - Yorumlar</Text>
            <Text style={styles.subtitle}>
                yorum yapma, yorum güncelleme ve silme.
            </Text>

            <Text style={styles.sectionTitle}>Uzay Nesnesi Seç</Text>

            {objects.map((object) => (
                <TouchableOpacity
                    key={object.id}
                    style={[
                        styles.objectCard,
                        selectedObject?.id === object.id && styles.selectedCard
                    ]}
                    onPress={() => handleSelectObject(object)}
                >
                    <Text style={styles.objectName}>{object.name}</Text>
                    <Text style={styles.objectType}>{object.type}</Text>
                </TouchableOpacity>
            ))}

            {selectedObject && (
                <>
                    <Text style={styles.sectionTitle}>
                        Seçilen Nesne: {selectedObject.name}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Yorum yaz..."
                        placeholderTextColor="#8b949e"
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSubmitComment}>
                        <Text style={styles.buttonText}>
                            {editingCommentId ? "R16 - Yorumu Güncelle" : "R15 - Yorum Ekle"}
                        </Text>
                    </TouchableOpacity>

                    {editingCommentId && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setEditingCommentId(null);
                                setContent("");
                            }}
                        >
                            <Text style={styles.buttonText}>Düzenlemeyi İptal Et</Text>
                        </TouchableOpacity>
                    )}

                    <Text style={styles.sectionTitle}>Yorumlar</Text>

                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Bu nesne için yorum yok.</Text>
                        }
                        renderItem={({ item }) => (
                            <View style={styles.commentCard}>
                                <Text style={styles.commentText}>{item.content}</Text>
                                <Text style={styles.commentMeta}>
                                    User ID: {item.userId} | SpaceObject ID: {item.spaceObjectId}
                                </Text>

                                <View style={styles.commentActions}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => handleEditComment(item)}
                                    >
                                        <Text style={styles.smallButtonText}>Güncelle</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteComment(item.id)}
                                    >
                                        <Text style={styles.smallButtonText}>Sil</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                </>
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
        marginTop: 16,
        marginBottom: 10
    },
    objectCard: {
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
    objectName: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "bold"
    },
    objectType: {
        color: "#8fb3ff",
        marginTop: 4
    },
    input: {
        backgroundColor: "#161b2e",
        color: "#ffffff",
        borderWidth: 1,
        borderColor: "#2f3b5f",
        borderRadius: 12,
        padding: 14,
        minHeight: 90,
        textAlignVertical: "top"
    },
    button: {
        backgroundColor: "#4f7cff",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12
    },
    cancelButton: {
        backgroundColor: "#6b7280",
        padding: 13,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    emptyText: {
        color: "#b7c0d8"
    },
    commentCard: {
        backgroundColor: "#161b2e",
        borderColor: "#2f3b5f",
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10
    },
    commentText: {
        color: "#ffffff",
        fontSize: 16
    },
    commentMeta: {
        color: "#8fb3ff",
        marginTop: 8,
        fontSize: 12
    },
    commentActions: {
        flexDirection: "row",
        marginTop: 12
    },
    editButton: {
        backgroundColor: "#4f7cff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8
    },
    deleteButton: {
        backgroundColor: "#ef4444",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    smallButtonText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    loadingText: {
        color: "#b7c0d8",
        marginTop: 12
    }
});