import { AuthContext } from "@/contexts/AuthContext";
import { db } from "@/services/firebaseConnection";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Feedback {
  id: string;
  comment: string;
  createdAt: Timestamp;
  rating: number;
  userId: string;
  userName: string;
}

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchFeedbacks = async () => {
      const feedbacksRef = collection(db, "feedbacks");
      const q = query(feedbacksRef, where("userId", "==", user.uid));

      const snapshot = await getDocs(q);
      const data: Feedback[] = snapshot.docs.map((doc) => {
        const docData = doc.data() as Omit<Feedback, "id" | "createdAt"> & {
          createdAt: Timestamp | null;
        };

        return {
          id: doc.id,
          comment: docData.comment,
          rating: docData.rating,
          userId: docData.userId,
          userName: docData.userName,
          createdAt: docData.createdAt ?? Timestamp.now(),
        };
      });

      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, [user?.uid]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={i <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </Text>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Feedbacks</Text>

      {feedbacks.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum feedback enviado ainda.</Text>
      ) : (
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.userName}>
                  {item.userName || "Anônimo"}
                </Text>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.comment}>{item.comment}</Text>
              <Text style={styles.feedbackDate}>
                {item.createdAt.toDate().toLocaleString("pt-BR")}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/Feedback")}
      >
        <Text style={styles.addButtonText}>+ Novo Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#999",
  },
  feedbackItem: {
    backgroundColor: "#f8f8f8",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  userName: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
  },
  starContainer: {
    flexDirection: "row",
  },
  starFilled: {
    color: "#f59e0b",
    fontSize: 18,
    marginRight: 2,
  },
  starEmpty: {
    color: "#ccc",
    fontSize: 18,
    marginRight: 2,
  },
  comment: {
    fontSize: 16,
    color: "#555",
  },
  feedbackDate: {
    marginTop: 10,
    fontSize: 13,
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "right",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#4f46e5",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
