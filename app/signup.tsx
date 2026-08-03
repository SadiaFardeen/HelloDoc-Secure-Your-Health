import { useApp } from "@/Context/AppContext";
import { router } from "expo-router";
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

type SignupRole = "patient" | "doctor";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialization: string;
  qualification: string;
  hospital: string;
  location: string;
  fee: string;
  about: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  specialization: "",
  qualification: "",
  hospital: "",
  location: "",
  fee: "",
  about: "",
};

export default function SignupScreen() {
  const {
    registerDoctor,
    registerPatient,
    setCurrentDoctorId,
    setCurrentPatientId,
    setUserRole,
  } = useApp();

  const [role, setRole] = useState<SignupRole>("patient");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFeedback("");
  };

  const selectRole = (nextRole: SignupRole) => {
    setRole(nextRole);
    setForm(INITIAL_FORM);
    setFeedback("");
  };

  const validate = (): string | null => {
    const email = form.email.trim().toLowerCase();

    if (!form.name.trim() || !email || !form.password || !form.confirmPassword) {
      return "Name, email and password fields are required.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (form.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (role === "doctor") {
      if (
        !form.specialization.trim() ||
        !form.qualification.trim() ||
        !form.hospital.trim() ||
        !form.location.trim() ||
        !form.fee.trim()
      ) {
        return "Doctor specialty, qualification, hospital, location and fee are required.";
      }

      const fee = Number(form.fee);
      if (!Number.isFinite(fee) || fee < 0) {
        return "Consultation fee must be a valid non-negative number.";
      }
    }

    return null;
  };

  const handleSignup = async () => {
    const validationError = validate();

    if (validationError) {
      setFeedback(validationError);
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    try {
      if (role === "patient") {
        const patient = await registerPatient({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        setUserRole("Patient");
        setCurrentPatientId(patient.id);
        setCurrentDoctorId(null);
        router.replace({
          pathname: "/patient/dashboard",
          params: { patientId: patient.id },
        });
        return;
      }

      const { account } = await registerDoctor({
        name: form.name,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
        qualification: form.qualification,
        hospital: form.hospital,
        location: form.location,
        fee: Number(form.fee),
        about: form.about,
      });

      setUserRole("Doctor");
      setCurrentDoctorId(account.doctorId);
      setCurrentPatientId(null);
      router.replace({
        pathname: "/doctorDashboard/dashboard",
        params: { doctorId: account.doctorId },
      });
    } catch (error) {
      console.error("Signup failed:", error);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Could not create the account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
          <Text style={styles.backButtonText}>← Back to Login</Text>
        </Pressable>

        <Text style={styles.title}>Create HelloDoc Account</Text>
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, role === "patient" && styles.patientTab]}
            onPress={() => selectRole("patient")}
          >
            <Text style={[styles.tabText, role === "patient" && styles.activeTabText]}>
              Patient Signup
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, role === "doctor" && styles.doctorTab]}
            onPress={() => selectRole("doctor")}
          >
            <Text style={[styles.tabText, role === "doctor" && styles.activeTabText]}>
              Doctor Signup
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Field
            label="Full Name *"
            value={form.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder={role === "doctor" ? "Dr. Your Name" : "Your full name"}
          />
          <Field
            label="Email Address *"
            value={form.email}
            onChangeText={(value) => updateField("email", value)}
            placeholder="name@example.com"
            keyboardType="email-address"
          />

          {role === "doctor" ? (
            <>
              <Field
                label="Specialization *"
                value={form.specialization}
                onChangeText={(value) => updateField("specialization", value)}
                placeholder="Cardiology"
              />
              <Field
                label="Qualification *"
                value={form.qualification}
                onChangeText={(value) => updateField("qualification", value)}
                placeholder="MBBS, FCPS"
              />
              <Field
                label="Hospital / Chamber *"
                value={form.hospital}
                onChangeText={(value) => updateField("hospital", value)}
                placeholder="Hospital name"
              />
              <Field
                label="Location *"
                value={form.location}
                onChangeText={(value) => updateField("location", value)}
                placeholder="Area, City"
              />
              <Field
                label="Consultation Fee *"
                value={form.fee}
                onChangeText={(value) => updateField("fee", value.replace(/[^0-9.]/g, ""))}
                placeholder="1000"
                keyboardType="numeric"
              />
              <View style={styles.inputGroup}>
                <Text style={styles.label}>About</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={form.about}
                  onChangeText={(value) => updateField("about", value)}
                  placeholder="Short professional introduction"
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </>
          ) : null}

          <Field
            label="Password *"
            value={form.password}
            onChangeText={(value) => updateField("password", value)}
            placeholder="At least 6 characters"
            secureTextEntry
          />
          <Field
            label="Confirm Password *"
            value={form.confirmPassword}
            onChangeText={(value) => updateField("confirmPassword", value)}
            placeholder="Enter password again"
            secureTextEntry
          />

          {feedback ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          ) : null}

          <Pressable
            style={[
              styles.submitButton,
              role === "doctor" ? styles.doctorButton : styles.patientButton,
              isSubmitting && styles.disabledButton,
            ]}
            onPress={() => void handleSignup()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                Create {role === "doctor" ? "Doctor" : "Patient"} Account
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
}: FieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={
          keyboardType === "email-address" || secureTextEntry
            ? "none"
            : "sentences"
        }
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 20, paddingBottom: 50 },
  backButton: { alignSelf: "flex-start", marginBottom: 16 },
  backButtonText: { color: "#0284C7", fontWeight: "800" },
  title: { fontSize: 28, fontWeight: "900", color: "#0F172A" },
  subtitle: { color: "#64748B", fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 20 },
  tabContainer: { flexDirection: "row", gap: 10, marginBottom: 16 },
  tab: { flex: 1, backgroundColor: "#E2E8F0", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  patientTab: { backgroundColor: "#0284C7" },
  doctorTab: { backgroundColor: "#0F766E" },
  tabText: { color: "#475569", fontSize: 14, fontWeight: "800" },
  activeTabText: { color: "#FFFFFF" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", padding: 18, gap: 14 },
  inputGroup: { gap: 6 },
  label: { color: "#334155", fontSize: 14, fontWeight: "700" },
  input: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: "#0F172A", fontSize: 15 },
  multilineInput: { minHeight: 90 },
  feedbackBox: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: 10, padding: 12 },
  feedbackText: { color: "#B91C1C", fontSize: 13, lineHeight: 19 },
  submitButton: { minHeight: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 4 },
  patientButton: { backgroundColor: "#0284C7" },
  doctorButton: { backgroundColor: "#0F766E" },
  disabledButton: { opacity: 0.65 },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
