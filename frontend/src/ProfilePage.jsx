import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { designTokens } from "./theme/tokens";
import { dataService } from "./dataService";

const ProfilePage = ({ onLogout, onGoBack }) => {
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Carrega o usuário salvo no AsyncStorage
  useEffect(() => {
    loadProfessor();
  }, []);

  const loadProfessor = async () => {
    try {
      const saved = await dataService.getSavedUser();

      if (saved && saved.id) {
        setProfessor(saved);
        setLoading(false);
        return;
      }

      console.log("Nenhum usuário salvo encontrado.");

    } catch (error) {
      console.error("Erro ao carregar professor:", error);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await dataService.logout();
    onLogout();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={designTokens.colors.primary[500]} />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!professor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Não foi possível carregar os dados do professor.</Text>
        <TouchableOpacity onPress={loadProfessor} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={designTokens.colors.neutral[700]} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meu Perfil</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={designTokens.colors.semantic.error} />
        </TouchableOpacity>
      </View>

      {/* Card de Informações */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={90} color={designTokens.colors.primary[500]} />

        <Text style={styles.name}>
          {professor.nome} {professor.sobrenome}
        </Text>
        <Text style={styles.role}>{professor.especialidade}</Text>
      </View>

      {/* Detalhes */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações pessoais</Text>

        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color={designTokens.colors.neutral[600]} />
          <Text style={styles.infoText}>{professor.email}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color={designTokens.colors.neutral[600]} />
          <Text style={styles.infoText}>{professor.telefone || "Não informado"}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color={designTokens.colors.neutral[600]} />
          <Text style={styles.infoText}>{professor.data_nascimento}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="document-text-outline" size={20} color={designTokens.colors.neutral[600]} />
          <Text style={styles.infoText}>CPF: {professor.cpf}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="book-outline" size={20} color={designTokens.colors.neutral[600]} />
          <Text style={styles.infoText}>
            Disciplinas: {professor.disciplinas || "Nenhuma"}
          </Text>
        </View>
      </View>

      {/* Admin */}
      {professor.admin && (
        <View style={styles.adminTag}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
          <Text style={styles.adminText}>Administrador</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: designTokens.spacing.lg,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: designTokens.spacing.xl,
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: designTokens.typography.fontSizes["2xl"],
    fontWeight: "700",
    color: designTokens.colors.neutral[900],
  },
  logoutButton: { padding: 4 },

  profileCard: {
    alignItems: "center",
    paddingVertical: designTokens.spacing.xl,
    backgroundColor: designTokens.colors.neutral[50],
    borderRadius: designTokens.borderRadius["2xl"],
    marginBottom: designTokens.spacing.xl,
  },
  name: {
    fontSize: designTokens.typography.fontSizes["2xl"],
    fontWeight: "700",
    color: designTokens.colors.neutral[900],
    marginTop: designTokens.spacing.md,
  },
  role: {
    fontSize: designTokens.typography.fontSizes.md,
    color: designTokens.colors.neutral[600],
    marginTop: 4,
  },

  infoSection: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.neutral[50],
    borderRadius: designTokens.borderRadius.xl,
  },
  sectionTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: "600",
    marginBottom: designTokens.spacing.md,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: designTokens.spacing.sm,
  },
  infoText: {
    marginLeft: designTokens.spacing.sm,
    fontSize: designTokens.typography.fontSizes.md,
    color: designTokens.colors.neutral[700],
  },

  adminTag: {
    marginTop: designTokens.spacing.xl,
    padding: designTokens.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: designTokens.colors.primary[600],
    borderRadius: designTokens.borderRadius.xl,
  },
  adminText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "600",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, color: designTokens.colors.neutral[600] },

  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: {
    fontSize: 16,
    color: designTokens.colors.semantic.error,
    marginBottom: 10,
  },
  retryButton: {
    padding: 12,
    backgroundColor: designTokens.colors.primary[500],
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});

export default ProfilePage;
