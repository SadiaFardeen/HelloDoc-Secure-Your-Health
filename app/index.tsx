import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import { api } from "../services/api";

export default function WelcomeScreen() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage("");
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail && !cleanPassword) {
      setErrorMessage("Please enter your email and password.");
      return;
    }
    if (!cleanEmail) {
      setErrorMessage("Email address cannot be empty.");
      return;
    }
    if (!cleanPassword) {
      setErrorMessage("Password cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.login({
        email: cleanEmail,
        password: cleanPassword,
        role,
      });

      if (role === "doctor") {
        router.push({
          pathname: "/doctorDashboard/dashboard",
          params: {
            doctorId: String(res.user.id),
            doctorName: res.user.name,
            doctorEmail: res.user.email,
            doctorSpecialty: res.user.specialty || "Specialist",
          },
        });
      } else {
        router.push({
          pathname: "/(tabs)",
          params: {
            userId: String(res.user.id),
            userName: res.user.name,
            userEmail: res.user.email,
          },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    setErrorMessage("");
    router.push({
      pathname: "/signup",
      params: { defaultRole: role },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Ionicons name="medical" size={32} color="#0d9488" />
          </View>
          <Text style={styles.brandTitle}>HelloDoc</Text>
          <Text style={styles.tagline}>Select your portal to continue</Text>

          <View style={styles.roleToggleContainer}>
            <TouchableOpacity
              style={[styles.roleTab, role === "patient" && styles.activeRoleTab]}
              onPress={() => {
                setRole("patient");
                setErrorMessage("");
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={18}
                color={role === "patient" ? COLORS.white : "#64748b"}
              />
              <Text
                style={[
                  styles.roleTabText,
                  role === "patient" && styles.activeRoleTabText,
                ]}
              >
                Patient Portal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, role === "doctor" && styles.activeRoleTab]}
              onPress={() => {
                setRole("doctor");
                setErrorMessage("");
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="medkit"
                size={18}
                color={role === "doctor" ? COLORS.white : "#64748b"}
              />
              <Text
                style={[
                  styles.roleTabText,
                  role === "doctor" && styles.activeRoleTabText,
                ]}
              >
                Doctor Portal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {role === "patient" ? "Patient Login" : "Doctor Portal Login"}
          </Text>

          {errorMessage !== "" && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.errorBoxText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={[styles.inputWrapper, errorMessage && !email.trim() ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. user@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.inputWrapper, errorMessage && !password.trim() ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Log In as {role === "patient" ? "Patient" : "Doctor"}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSignUp}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Ionicons name="shield-checkmark" size={14} color="#0d9488" />
          <Text style={styles.footerNoteText}>
            Secure PostgreSQL Authenticated System
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerArea: {
    alignItems: "center",
    marginTop: 10,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccfbf1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
    marginBottom: 16,
  },
  roleToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    padding: 4,
    borderRadius: 14,
    width: "100%",
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeRoleTab: {
    backgroundColor: "#0d9488",
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  activeRoleTabText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 14,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorBoxText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: "#f8fafc",
    marginBottom: 14,
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fff5f5",
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#0d9488",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
  footerNote: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  footerNoteText: {
    fontSize: 12,
    color: "#0f766e",
    fontWeight: "500",
  },
});