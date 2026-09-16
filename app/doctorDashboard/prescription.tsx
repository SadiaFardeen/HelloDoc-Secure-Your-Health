import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Medicine,
  Prescription,
  getPrescriptions,
  createPrescription,
} from "../../services/member2.api";

export default function DoctorPrescriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialPatient = (params.patientName as string) || "";
  const initialAppointmentId = (params.appointmentId as string) || "";

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [patientName, setPatientName] = useState<string>(initialPatient);
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", timing: "" },
  ]);

  const loadPrescriptions = useCallback(async () => {
    try {
      const data = await getPrescriptions();
      setPrescriptions(data);
    } catch (err: any) {
      console.error("Failed to load prescriptions:", err);
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPrescriptions();
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", timing: "" }]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) {
      Alert.alert("Notice", "Prescription must contain at least one medicine entry.");
      return;
    }
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async () => {
    if (!patientName.trim()) {
      Alert.alert("Validation Error", "Please provide a patient name.");
      return;
    }
    if (!diagnosis.trim()) {
      Alert.alert("Validation Error", "Please enter the diagnosis.");
      return;
    }

    const validMedicines = medicines.filter((m) => m.name.trim().length > 0);
    if (validMedicines.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please provide details for at least one medicine."
      );
      return;
    }

    try {
      setSubmitting(true);
      const newPrescription = await createPrescription({
        appointmentId: initialAppointmentId || undefined,
        patientName: patientName.trim(),
        diagnosis: diagnosis.trim(),
        medicines: validMedicines,
        notes: notes.trim(),
      });

      Alert.alert("Success", "Prescription has been created and saved.");
      setPrescriptions([newPrescription, ...prescriptions]);

      setPatientName("");
      setDiagnosis("");
      setNotes("");
      setMedicines([{ name: "", dosage: "", timing: "" }]);
    } catch (err: any) {
      console.error("Prescription create error:", err);
      Alert.alert(
        "Submission Error",
        err.response?.data?.error || "Could not save prescription."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Prescriptions</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.formTitle}>New Prescription</Text>

        <Text style={styles.label}>Patient Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Tanvir Ahmed"
          value={patientName}
          onChangeText={setPatientName}
        />

        <Text style={styles.label}>Diagnosis *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Acute Bronchitis"
          value={diagnosis}
          onChangeText={setDiagnosis}
        />

        <View style={styles.medicineSectionHeader}>
          <Text style={styles.label}>Medications *</Text>
          <TouchableOpacity style={styles.addMedBtn} onPress={handleAddMedicine}>
            <Text style={styles.addMedBtnText}>+ Add Medicine</Text>
          </TouchableOpacity>
        </View>

        {medicines.map((med, index) => (
          <View key={index} style={styles.medRowBox}>
            <View style={styles.medRowHeader}>
              <Text style={styles.medIndexText}>Medicine #{index + 1}</Text>
              {medicines.length > 1 && (
                <TouchableOpacity onPress={() => handleRemoveMedicine(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Medicine name"
              value={med.name}
              onChangeText={(text) => handleMedicineChange(index, "name", text)}
            />

            <View style={styles.inputTwoCol}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Dosage (e.g. 1 Tablet)"
                value={med.dosage}
                onChangeText={(text) => handleMedicineChange(index, "dosage", text)}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Timing (e.g. After meal)"
                value={med.timing}
                onChangeText={(text) => handleMedicineChange(index, "timing", text)}
              />
            </View>
          </View>
        ))}

        <Text style={styles.label}>Doctor Instructions & Advice</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="e.g. Drink warm water, rest 3 days."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Issue Prescription</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Issued Prescriptions</Text>

      {loadingList ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.stateText}>Loading prescription records...</Text>
        </View>
      ) : prescriptions.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No prescriptions issued yet.</Text>
        </View>
      ) : (
        prescriptions.map((p) => (
          <View key={p.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.patientName}>{p.patient_name || p.patientName}</Text>
              <Text style={styles.dateText}>📅 {p.date}</Text>
            </View>

            <Text style={styles.diagnosisText}>
              <Text style={styles.bold}>Diagnosis: </Text>
              {p.diagnosis}
            </Text>

            <View style={styles.medChipsContainer}>
              {(Array.isArray(p.medicines)
                ? p.medicines
                : typeof p.medicines === "string"
                ? JSON.parse(p.medicines)
                : []
              ).map((m: Medicine, idx: number) => (
                <View key={idx} style={styles.medChip}>
                  <Text style={styles.medChipName}>{m.name}</Text>
                  {(m.dosage || m.timing) && (
                    <Text style={styles.medChipDetails}>
                      {m.dosage} • {m.timing}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {p.notes ? (
              <Text style={styles.notesText}>
                <Text style={styles.bold}>Notes: </Text>
                {p.notes}
              </Text>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: { fontSize: 13, fontWeight: "600", color: "#334155" },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  formTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569", marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  multilineInput: { minHeight: 70, textAlignVertical: "top" },
  medicineSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 6,
  },
  addMedBtn: {
    backgroundColor: "#eff6ff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  addMedBtnText: { fontSize: 12, fontWeight: "600", color: "#2563eb" },
  medRowBox: { backgroundColor: "#f1f5f9", borderRadius: 8, padding: 10, marginBottom: 10 },
  medRowHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  medIndexText: { fontSize: 12, fontWeight: "700", color: "#64748b" },
  removeText: { fontSize: 12, fontWeight: "600", color: "#ef4444" },
  inputTwoCol: { flexDirection: "row", gap: 8, marginTop: 8 },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 18,
  },
  btnDisabled: { opacity: 0.6 },
  submitButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  sectionHeader: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 12 },
  centerBox: { padding: 24, alignItems: "center" },
  stateText: { fontSize: 13, color: "#64748b", marginTop: 8 },
  emptyBox: { padding: 24, backgroundColor: "#ffffff", borderRadius: 12, alignItems: "center" },
  emptyText: { color: "#94a3b8", fontSize: 14 },
  historyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  patientName: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  dateText: { fontSize: 12, color: "#64748b" },
  diagnosisText: { fontSize: 13, color: "#334155", marginBottom: 8 },
  bold: { fontWeight: "700" },
  medChipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  medChip: { backgroundColor: "#e0e7ff", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  medChipName: { fontSize: 12, fontWeight: "600", color: "#3730a3" },
  medChipDetails: { fontSize: 11, color: "#4338ca" },
  notesText: { fontSize: 12, color: "#64748b", fontStyle: "italic" },
});