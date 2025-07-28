import { auth } from "@/services/firebaseConnection";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

type RegisterFormData = yup.InferType<typeof schema>;

export default function TabRegister() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/Home");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a conta.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.header}>
          <Ionicons name="person-add-outline" size={28} color="#4f46e5" />
          <Text style={styles.title}>Crie sua conta</Text>
        </View>

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Nome completo"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                autoCapitalize="words"
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </>
          )}
        />

        <Text style={styles.label}>E-mail</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </>
          )}
        />

        <Text style={styles.label}>Senha</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Digite sua senha"
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Já tem uma conta?{" "}
          <Text onPress={() => router.push("/")} style={styles.loginLink}>
            Acesse
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
    padding: 20,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    marginTop: 14,
    fontWeight: "500",
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    color: "#222",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  button: {
    marginTop: 28,
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loginText: {
    marginTop: 18,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
  },
  loginLink: {
    color: "#4f46e5",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
