import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import { api } from "../services/api";

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [role, setRole] = useState<"patient" | "doctor">(
    (params.defaultRole as "patient" | "doctor") || "patient"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [license, setLicense] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanSpecialty = specialty.trim();

    if (!cleanName && !cleanEmail && !cleanPassword) {
      setErrorMessage("Please fill out all the fields.");
      return;
    }
    if (!cleanName) {
      setErrorMessage("Full Name is required.");
      return;
    }
    if (!cleanEmail) {
      setErrorMessage("Email address is required.");
      return;
    }
    if (!cleanPassword) {
      setErrorMessage("Password is required.");
      return;
    }
    if (cleanPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (role === "doctor" && !cleanSpecialty) {
      setErrorMessage("Doctor specialization is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.register({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role,
        specialty: role === "doctor" ? cleanSpecialty : undefined,
        license: role === "doctor" ? license.trim() : undefined,
      });

      setSuccessMessage(`Account created successfully for ${res.user.name}! Redirecting to login...`);
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Create Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
              size={16}
              color={role === "patient" ? COLORS.white : "#64748b"}
            />
            <Text
              style={[
                styles.roleTabText,
                role === "patient" && styles.activeRoleTabText,
              ]}
            >
              Patient
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
              size={16}
              color={role === "doctor" ? COLORS.white : "#64748b"}
            />
            <Text
              style={[
                styles.roleTabText,
                role === "doctor" && styles.activeRoleTabText,
              ]}
            >
              Doctor
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          {errorMessage !== "" && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.errorBoxText}>{errorMessage}</Text>
            </View>
          )}

          {successMessage !== "" && (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
              <Text style={styles.successBoxText}>{successMessage}</Text>
            </View>
          )}

          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={[styles.inputWrapper, errorMessage && !name.trim() ? styles.inputError : null]}>
            <Ionicons name="person-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.textInput}
              placeholder={role === "doctor" ? "Dr. Full Name" : "Your Name"}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errorMessage) setErrorMessage("");
              }}
            />
          </View>

          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={[styles.inputWrapper, errorMessage && !email.trim() ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.textInput}
              placeholder="name@example.com"
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
              placeholder="Create password (min 6 characters)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
              secureTextEntry
            />
          </View>

          {role === "doctor" && (
            <>
              <Text style={styles.inputLabel}>Specialization</Text>
              <View style={[styles.inputWrapper, errorMessage && !specialty.trim() ? styles.inputError : null]}>
                <Ionicons name="fitness-outline" size={18} color="#94a3b8" />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Cardiologist, Dermatologist"
                  value={specialty}
                  onChangeText={(text) => {
                    setSpecialty(text);
                    if (errorMessage) setErrorMessage("");
                  }}
                />
              </View>

              <Text style={styles.inputLabel}>BMDC / Medical License No</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={18} color="#94a3b8" />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. A-12345"
                  value={license}
                  onChangeText={setLicense}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryButtonText}>
                Register as {role === "patient" ? "Patient" : "Doctor"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginRedirectBtn}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.loginRedirectText}>
              Already have an account? <Text style={styles.linkText}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  content: {
    padding: 20,
  },
  roleToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    padding: 4,
    borderRadius: 14,
    marginBottom: 20,
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
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  successBoxText: {
    color: "#16a34a",
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
    backgroundColor: "#0d9488",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  loginRedirectBtn: {
    marginTop: 16,
    alignItems: "center",
  },
  loginRedirectText: {
    fontSize: 13,
    color: "#64748b",
  },
  linkText: {
    color: "#0d9488",
    fontWeight: "bold",
  },
});