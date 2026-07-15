import { useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const { setUserRole } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  useEffect(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    let emailErr = "";
    let passErr = "";

    if (touched.email && !emailRegex.test(formData.email)) {
      emailErr = "Please enter a valid email address.";
    }
    if (touched.password && formData.password.length < 6) {
      passErr = "Password must be at least 6 characters long.";
    }

    setErrors({ email: emailErr, password: passErr });
  }, [formData, touched]);

  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitForm = (role: "Patient" | "Doctor") => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email) || formData.password.length < 6) {
      setTouched({ email: true, password: true });
      return;
    }

    setUserRole(role);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.logoText}>🩺 HelloDoc</Text>
        <Text style={styles.tagline}>We secure your health</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.welcomeText}>Login & Select Role</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="Enter email"
          value={formData.email}
          onChangeText={(val) => handleInputChange("email", val)}
          onBlur={() => handleBlur("email")}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, errors.password ? styles.inputError : null]}
          placeholder="Min 6 characters"
          value={formData.password}
          onChangeText={(val) => handleInputChange("password", val)}
          onBlur={() => handleBlur("password")}
          secureTextEntry
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <View style={styles.divider} />

        <Pressable style={[styles.button, styles.patientButton]} onPress={() => submitForm("Patient")}>
          <Text style={styles.buttonText}>Login as Patient</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.doctorButton]} onPress={() => submitForm("Doctor")}>
          <Text style={styles.buttonText}>Login as Doctor</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", justifyContent: "center", padding: 24 },
  brandContainer: { alignItems: "center", marginBottom: 32 },
  logoText: { fontSize: 36, fontWeight: "bold", color: "#0D1F4E" },
  tagline: { fontSize: 14, color: "#0D9488", fontWeight: "600", marginTop: 4 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  welcomeText: { fontSize: 20, fontWeight: "700", color: "#1E293B", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: "#F1F5F9", padding: 12, borderRadius: 8, fontSize: 15, color: "#1E293B", borderWidth: 1, borderColor: "#E2E8F0" },
  inputError: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 4, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 20 },
  button: { paddingVertical: 14, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  patientButton: { backgroundColor: "#0D1F4E" },
  doctorButton: { backgroundColor: "#0D9488" },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" }
});