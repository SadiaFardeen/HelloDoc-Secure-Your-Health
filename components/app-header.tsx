// components/app-header.tsx

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        ) : null}

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>

          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    marginRight: 12,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 34,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 12,
    color: "#CCFBF1",
    marginTop: 3,
  },
});