import { useApp } from "@/Context/AppContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { verifyPassword } from "../utils/auth";

type LoginRole = "patient" | "doctor";

export default function LoginScreen() {
  const router = useRouter();
  const {
    isHydrated,
    patientAccounts,
    doctorAccounts,
    setCurrentDoctorId,
    setCurrentPatientId,
    setUserRole,
  } = useApp();

  const [role, setRole] = useState<LoginRole>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectRole = (nextRole: LoginRole) => {
    setRole(nextRole);
    setEmail("");
    setPassword("");
    setFeedback("");
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setFeedback("Please enter your email and password.");
      return;
    }

    setFeedback("");
    setIsSubmitting(true);

    try {
      if (role === "doctor") {
        const doctor = doctorAccounts.find(
          (account) => account.email.toLowerCase() === cleanEmail
        );

        if (!doctor || !(await verifyPassword(doctor, cleanPassword))) {
          setFeedback("Invalid doctor email or password.");
          return;
        }

        setUserRole("Doctor");
        setCurrentDoctorId(doctor.doctorId);
        setCurrentPatientId(null);
        router.replace({
          pathname: "/doctorDashboard/dashboard",
          params: { doctorId: doctor.doctorId },
        });
        return;
      }

      const patient = patientAccounts.find(
        (account) => account.email.toLowerCase() === cleanEmail
      );

      if (!patient || !(await verifyPassword(patient, cleanPassword))) {
        setFeedback("Invalid patient email or password.");
        return;
      }

      setUserRole("Patient");
      setCurrentPatientId(patient.id);
      setCurrentDoctorId(null);
      router.replace({
        pathname: "/patient/dashboard",
        params: { patientId: patient.id },
      });
    } catch (error) {
      console.error("Login failed:", error);
      setFeedback("Could not sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Loading saved data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>HelloDoc 🩺</Text>
          <Text style={styles.subtitle}>Select your account type and sign in</Text>
        </View>

        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, role === "patient" && styles.activeTabPatient]}
            onPress={() => selectRole("patient")}
          >
            <Text
              style={[styles.tabText, role === "patient" && styles.activeTabText]}
            >
              Patient Portal
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, role === "doctor" && styles.activeTabDoctor]}
            onPress={() => selectRole("doctor")}
          >
            <Text
              style={[styles.tabText, role === "doctor" && styles.activeTabText]}
            >
              Doctor Portal
            </Text>
          </Pressable>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formHeader}>
            {role === "doctor" ? "Doctor Login" : "Patient Login"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder={role === "doctor" ? "doc1@hello.com" : "pat1@hello.com"}
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => void handleLogin()}
            />
          </View>

          {feedback ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          ) : null}

          <Pressable
            style={[
              styles.loginButton,
              role === "doctor"
                ? styles.doctorLoginButton
                : styles.patientLoginButton,
              isSubmitting && styles.disabledButton,
            ]}
            onPress={() => void handleLogin()}
            disabled={isSubmitting}
          >
            <Text style={styles.loginButtonText}>
              {isSubmitting
                ? "Signing in..."
                : `Login as ${role === "doctor" ? "Doctor" : "Patient"}`}
            </Text>
          </Pressable>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>No account yet?</Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text style={styles.signupLink}> Create a new account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: { marginTop: 12, color: "#64748B" },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { flexGrow: 1, justifyContent: "center", padding: 20 },
  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "bold", color: "#0284C7" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 6, textAlign: "center" },
  tabContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center", borderRadius: 12, backgroundColor: "#E2E8F0" },
  activeTabPatient: { backgroundColor: "#0284C7" },
  activeTabDoctor: { backgroundColor: "#0F766E" },
  tabText: { fontSize: 14, fontWeight: "bold", color: "#475569" },
  activeTabText: { color: "#FFFFFF" },
  formCard: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", gap: 16 },
  formHeader: { fontSize: 18, fontWeight: "bold", color: "#0F172A", marginBottom: 4 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#334155" },
  input: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10, padding: 14, fontSize: 15, color: "#0F172A" },
  feedbackBox: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: 10, padding: 12 },
  feedbackText: { color: "#B91C1C", fontSize: 13 },
  loginButton: { padding: 16, borderRadius: 12, alignItems: "center", marginTop: 2 },
  doctorLoginButton: { backgroundColor: "#0F766E" },
  patientLoginButton: { backgroundColor: "#0284C7" },
  disabledButton: { opacity: 0.65 },
  loginButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  signupRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap" },
  signupText: { color: "#64748B", fontSize: 14 },
  signupLink: { color: "#0284C7", fontWeight: "800", fontSize: 14 },
});
