// src/components/Button.tsx
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export default function Button({ title, onPress, loading }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.disabled]}
      onPress={onPress}
      disabled={loading}
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});