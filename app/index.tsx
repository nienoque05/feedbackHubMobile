// src/screens/LoginScreen.tsx
import { auth } from "@/services/firebaseConnection";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      Alert.alert("Sucesso", "Bem-vindo de volta!");
      router.replace("/Home");
    } catch {
      Alert.alert("Erro", "E-mail ou senha inválidos.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.header}>
          <Ionicons name="log-in-outline" size={32} color="#4f46e5" />
          <Text style={styles.title}>Acessar Plataforma</Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                textContentType="emailAddress"
                accessibilityLabel="Campo de e-mail"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Digite sua senha"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                textContentType="password"
                accessibilityLabel="Campo de senha"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          style={[styles.button, (!isValid || isSubmitting) && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          disabled={!isValid || isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Ainda não possui uma conta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => router.push("/(auth)/register")}
            accessibilityRole="link"
          >
            Cadastre-se
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    shadowColor: "#4f46e5",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#222",
  },
  label: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
    marginTop: 20,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    color: "#222",
    backgroundColor: "#f9fafb",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
  },
  button: {
    marginTop: 32,
    backgroundColor: "#4f46e5",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#a5b4fc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  registerText: {
    marginTop: 28,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
  },
  registerLink: {
    color: "#4f46e5",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
