import { useApp } from "@/Context/AppContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Prescription } from "../../data/mockData";

interface PrescriptionForm {
  medicineName: string;
  dosage: string;
  instructions: string;
  notes: string;
}

export default function PrescriptionScreen() {
  const params = useLocalSearchParams<{
    appointmentId?: string;
    doctorId?: string;
    patientId?: string;
  }>();
  const {
    addPrescription,
    appointments,
    currentDoctorId,
    patientAccounts,
    doctors,
  } = useApp();

  const doctorId = params.doctorId ?? currentDoctorId ?? undefined;
  const appointment = appointments.find(
    (item) =>
      item.id === params.appointmentId &&
      item.doctorId === doctorId &&
      item.patientId === params.patientId
  );
  const patient = patientAccounts.find(
    (account) => account.id === appointment?.patientId
  );
  const doctor = doctors.find((item) => item.id === doctorId);

  const [form, setForm] = useState<PrescriptionForm>({
    medicineName: "",
    dosage: "",
    instructions: "",
    notes: "",
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(
    () =>
      form.medicineName.trim().length > 0 &&
      form.dosage.trim().length > 0 &&
      form.instructions.trim().length > 0 &&
      form.notes.length <= 500,
    [form]
  );

  const updateField = (field: keyof PrescriptionForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFeedback("");
  };

  const handleSave = async () => {
    setFeedback("");

    if (!appointment || !patient || !doctor) {
      setFeedback(
        "This prescription is not linked to a valid doctor-patient appointment."
      );
      return;
    }

    if (!isFormValid) {
      setFeedback("Medicine, dosage and instructions are required.");
      return;
    }

    // This is the exact account email that the patient uses to log in.
    const patientEmail = patient.email.toLowerCase();

    const newPrescription: Prescription = {
      id: `prescription-${Date.now()}`,
      appointmentId: appointment.id,
      patientId: patient.id,
      patientName: patient.name,
      patientEmail,
      doctorId: doctor.id,
      doctorName: doctor.name,
      medicines: [`${form.medicineName.trim()} — ${form.dosage.trim()}`],
      notes: `${form.instructions.trim()}\n\nAdditional notes: ${
        form.notes.trim() || "None"
      }`,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      await addPrescription(newPrescription);

      // Navigate directly instead of waiting for an Alert callback on web.
      router.replace({
        pathname: "/doctorDashboard/dashboard",
        params: {
          doctorId: doctor.id,
          prescriptionStatus: "success",
          assignedPatient: patient.name,
        },
      });
    } catch (error) {
      console.error("Failed to save prescription:", error);
      setFeedback("Could not assign the prescription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment || !patient || !doctor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.title}>No patient appointment selected</Text>
          <Text style={styles.errorText}>
            Open this screen from a patient card on the doctor dashboard.
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Create Prescription</Text>

        <View style={styles.assignmentCard}>
          <Text style={styles.assignmentLabel}>Assigned Patient</Text>
          <Text style={styles.assignmentName}>{patient.name}</Text>
          <Text style={styles.assignmentText}>{patient.email}</Text>
          <Text style={styles.assignmentText}>
            Appointment: {appointment.date} at {appointment.time}
          </Text>
          <Text style={styles.assignmentText}>Doctor: {doctor.name}</Text>
        </View>

        <Text style={styles.infoText}>
          This prescription will be visible only when {patient.email} logs in.
        </Text>

        <Text style={styles.label}>Medicine Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter medicine name"
          placeholderTextColor="#94A3B8"
          value={form.medicineName}
          onChangeText={(value: string) => updateField("medicineName", value)}
        />

        <Text style={styles.label}>Dosage *</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 1+0+1 for 5 days"
          placeholderTextColor="#94A3B8"
          value={form.dosage}
          onChangeText={(value: string) => updateField("dosage", value)}
        />

        <Text style={styles.label}>Instructions *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Example: Take after meals"
          placeholderTextColor="#94A3B8"
          value={form.instructions}
          onChangeText={(value: string) => updateField("instructions", value)}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Optional notes"
          placeholderTextColor="#94A3B8"
          value={form.notes}
          onChangeText={(value: string) => updateField("notes", value.slice(0, 500))}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={styles.counter}>{form.notes.length}/500</Text>

        {feedback ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.saveButton, isSubmitting && styles.disabledButton]}
          onPress={() => void handleSave()}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Assigning..." : "Assign Prescription"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 20, paddingBottom: 50 },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  backButtonText: { fontSize: 16, fontWeight: "600", color: "#0F172A" },
  title: { fontSize: 28, fontWeight: "bold", color: "#0F172A", marginBottom: 20 },
  assignmentCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  assignmentLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#047857",
    textTransform: "uppercase",
  },
  assignmentName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#065F46",
    marginTop: 6,
  },
  assignmentText: { fontSize: 13, color: "#047857", marginTop: 4 },
  infoText: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    color: "#1D4ED8",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
  },
  multilineInput: { minHeight: 90 },
  notesInput: { minHeight: 110 },
  counter: { textAlign: "right", fontSize: 12, color: "#64748B", marginTop: 5 },
  feedbackBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  feedbackText: { color: "#B91C1C", fontSize: 13, lineHeight: 19 },
  saveButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  disabledButton: { opacity: 0.65 },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
