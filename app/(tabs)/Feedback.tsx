import { AuthContext } from "@/contexts/AuthContext";
import { db } from "@/services/firebaseConnection";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

const schema = yup.object({
  comment: yup
    .string()
    .required("Comentário é obrigatório")
    .min(5, "Mínimo 5 caracteres"),
  rating: yup
    .number()
    .typeError("Nota precisa ser um número")
    .required("Nota é obrigatória")
    .min(1, "Nota mínima é 1")
    .max(5, "Nota máxima é 5"),
});

type FormData = {
  comment: string;
  rating: number;
};

type FeedbackFormProps = {
  onSuccess?: () => void;
};

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      comment: "",
      rating: undefined,
    },
  });

  useEffect(() => {
    register("comment");
    register("rating");
  }, [register]);

  const onSubmit = async (data: FormData) => {
    if (!user?.uid) return Alert.alert("Erro", "Usuário não autenticado");

    try {
      await addDoc(collection(db, "feedbacks"), {
        comment: data.comment,
        rating: Number(data.rating),
        userId: user.uid,
        userName: user.name || "Anônimo",
        createdAt: serverTimestamp(),
      });

      reset();
      router.replace("/Home");

      Alert.alert("Sucesso", "Feedback enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      Alert.alert("Erro", "Não foi possível enviar o feedback.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Feedback</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Comentário</Text>
          <TextInput
            placeholder="Digite seu comentário"
            style={styles.input}
            multiline
            numberOfLines={4}
            onChangeText={(text) => setValue("comment", text)}
            value={watch("comment")}
          />
          {errors.comment && (
            <Text style={styles.errorText}>{errors.comment.message}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nota (1 a 5)</Text>
          <TextInput
            placeholder="Digite a nota"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setValue("rating", Number(text))}
            value={watch("rating")?.toString() || ""}
          />
          {errors.rating && (
            <Text style={styles.errorText}>{errors.rating.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar</Text>
          )}
        </TouchableOpacity>
        <Text onPress={() => router.push("/Home")} style={styles.buttonReturn}>
          Cancelar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1a1a1a",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    gap: 20,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#e63946",
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonReturn: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
