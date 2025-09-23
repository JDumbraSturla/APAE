import React, { useState } from "react";
import { Alert, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Sucesso", "Login realizado!");
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo ao App</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email"
          keyboardType="email-address"
          accessibilityLabel="Campo de email"
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
          secureTextEntry
          accessibilityLabel="Campo de senha"
        />
        <Button title="Entrar" onPress={handleLogin} loading={loading} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {`Dica: Pressione ${Platform.select({ ios: "cmd + d", android: "cmd + m", web: "F12" })} para abrir as ferramentas de desenvolvedor.`}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#007bff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  form: {
    gap: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
});
