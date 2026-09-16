import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { api } from "../../services/api";

export default function DoctorDashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const doctorId = (params.doctorId as string) || "1";
  const [profile, setProfile] = useState<any>({
    name: (params.doctorName as string) || "Doctor",
    email: (params.doctorEmail as string) || "doctor@hellodoc.com",
    specialty: (params.doctorSpecialty as string) || "Specialist",
    hospital: "City Medical Hospital",
    fee: "800",
    image_url: "",
  });

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [rxModalVisible, setRxModalVisible] = useState(false);

  const [editName, setEditName] = useState(profile.name);
  const [editHospital, setEditHospital] = useState(profile.hospital);
  const [editFee, setEditFee] = useState(String(profile.fee));
  const [editImageUrl, setEditImageUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  const [rxPatientName, setRxPatientName] = useState("");
  const [rxDiagnosis, setRxDiagnosis] = useState("");
  const [rxMedicines, setRxMedicines] = useState("");
  const [rxInstructions, setRxInstructions] = useState("");
  const [creatingRx, setCreatingRx] = useState(false);

  const fetchProfileAndData = async () => {
    try {
      setLoading(true);
      if (doctorId && api.getUserProfile) {
        const uProfile = await api.getUserProfile(doctorId);
        setProfile({
          name: uProfile.name || profile.name,
          email: uProfile.email || profile.email,
          specialty: uProfile.specialty || profile.specialty,
          hospital: uProfile.hospital || "City Medical Hospital",
          fee: String(uProfile.fee || "800"),
          image_url: uProfile.image_url || "",
        });
        setEditName(uProfile.name || profile.name);
        setEditHospital(uProfile.hospital || "City Medical Hospital");
        setEditFee(String(uProfile.fee || "800"));
        setEditImageUrl(uProfile.image_url || "");
      }
      const data = await api.getAppointments();
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndData();
  }, [doctorId]);

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const res = await api.updateUserProfile(doctorId, {
        name: editName.trim(),
        hospital: editHospital.trim(),
        fee: Number(editFee) || 500,
        image_url: editImageUrl.trim(),
      });
      setProfile(res.user);
      setEditModalVisible(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreatePrescription = async () => {
    if (!rxPatientName.trim() || !rxMedicines.trim()) {
      alert("Please provide patient name and medicines");
      return;
    }
    try {
      setCreatingRx(true);
      await api.createPrescription({
        doctor_id: doctorId,
        doctor_name: profile.name,
        patient_name: rxPatientName.trim(),
        diagnosis: rxDiagnosis.trim(),
        medicines: rxMedicines.trim(),
        instructions: rxInstructions.trim(),
      });
      alert("Prescription generated successfully!");
      setRxPatientName("");
      setRxDiagnosis("");
      setRxMedicines("");
      setRxInstructions("");
      setRxModalVisible(false);
    } catch (e: any) {
      alert(e.message || "Failed to create prescription");
    } finally {
      setCreatingRx(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.topProfileRow}>
            {profile.image_url ? (
              <Image source={{ uri: profile.image_url }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarMini}>
                <Ionicons name="medical" size={32} color={COLORS.white} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeText}>Welcome back 👨‍⚕️</Text>
              <Text style={styles.doctorNameText}>{profile.name}</Text>
              <Text style={styles.specialtyText}>{profile.specialty}</Text>
              <Text style={styles.hospitalText}>📍 {profile.hospital || "City Hospital"}</Text>
              <Text style={styles.feeText}>Fee: ৳{profile.fee || 500}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="create-outline" size={16} color={COLORS.white} />
            <Text style={styles.editProfileBtnText}>Edit Profile & Fee</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              if (router.canGoBack) {
                router.push("/doctorDashboard/prescription");
              } else {
                setRxModalVisible(true);
              }
            }}
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#ccfbf1" }]}>
              <Ionicons name="create" size={24} color="#0d9488" />
            </View>
            <Text style={styles.actionCardTitle}>Create Prescription</Text>
            <Text style={styles.actionCardSubtitle}>Write Rx for patient</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push(`/consultation/${doctorId}`)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#e0e7ff" }]}>
              <Ionicons name="chatbubbles" size={24} color="#4f46e5" />
            </View>
            <Text style={styles.actionCardTitle}>Chat with Patient</Text>
            <Text style={styles.actionCardSubtitle}>Open consultation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>Assigned Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>৳{profile.fee || 500}</Text>
            <Text style={styles.statLabel}>Visiting Fee</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Appointments & Patients</Text>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={40} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No patient appointments yet</Text>
            <Text style={styles.emptySubtitle}>A patient will appear here after booking you.</Text>
          </View>
        ) : (
          appointments.map((apt) => (
            <View key={apt.id} style={styles.appointmentCard}>
              <View style={styles.aptTop}>
                <Ionicons name="person-circle" size={36} color={COLORS.primary} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.patientName}>{apt.patient_name}</Text>
                  <Text style={styles.aptMeta}>📅 {apt.date} • ⏰ {apt.time}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  <TouchableOpacity
                    style={styles.chatActionBtn}
                    onPress={() => router.push(`/consultation/${doctorId}`)}
                  >
                    <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rxQuickBtn}
                    onPress={() => {
                      setRxPatientName(apt.patient_name);
                      setRxModalVisible(true);
                    }}
                  >
                    <Text style={styles.rxQuickBtnText}>Rx</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/")}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Doctor Profile Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Doctor Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Doctor Name</Text>
            <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} />

            <Text style={styles.label}>Hospital / Chamber</Text>
            <TextInput style={styles.modalInput} value={editHospital} onChangeText={setEditHospital} />

            <Text style={styles.label}>Visiting Fee (BDT)</Text>
            <TextInput style={styles.modalInput} value={editFee} onChangeText={setEditFee} keyboardType="numeric" />

            <Text style={styles.label}>Profile Image URL</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://..."
              value={editImageUrl}
              onChangeText={setEditImageUrl}
            />

            <TouchableOpacity
              style={[styles.saveModalBtn, updating && { opacity: 0.7 }]}
              onPress={handleUpdateProfile}
              disabled={updating}
            >
              <Text style={styles.saveModalBtnText}>{updating ? "Saving..." : "Save Changes"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Prescription Modal */}
      <Modal visible={rxModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Prescription</Text>
              <TouchableOpacity onPress={() => setRxModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Patient Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Farhana"
              value={rxPatientName}
              onChangeText={setRxPatientName}
            />

            <Text style={styles.label}>Diagnosis</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Seasonal flu, Hypertension"
              value={rxDiagnosis}
              onChangeText={setRxDiagnosis}
            />

            <Text style={styles.label}>Medicines & Dosage</Text>
            <TextInput
              style={[styles.modalInput, { height: 70, textAlignVertical: "top" }]}
              placeholder="1. Tab Napa Extra (1+0+1)&#10;2. Cap Seclo 20mg (1+0+1)"
              multiline
              value={rxMedicines}
              onChangeText={setRxMedicines}
            />

            <Text style={styles.label}>Special Advice / Instructions</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Drink plenty of water and rest"
              value={rxInstructions}
              onChangeText={setRxInstructions}
            />

            <TouchableOpacity
              style={[styles.saveModalBtn, creatingRx && { opacity: 0.7 }]}
              onPress={handleCreatePrescription}
              disabled={creatingRx}
            >
              <Text style={styles.saveModalBtnText}>{creatingRx ? "Saving Rx..." : "Submit Prescription"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingBottom: 40 },
  headerCard: { backgroundColor: "#0d9488", padding: 20, borderRadius: 20, marginBottom: 16 },
  topProfileRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  avatarImg: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "#fff" },
  avatarMini: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#115e59", justifyContent: "center", alignItems: "center" },
  welcomeText: { color: "#ccfbf1", fontSize: 13, fontWeight: "600" },
  doctorNameText: { fontSize: 20, fontWeight: "bold", color: COLORS.white },
  specialtyText: { fontSize: 13, color: "#e6fffa" },
  hospitalText: { fontSize: 12, color: "#ccfbf1", marginTop: 2 },
  feeText: { fontSize: 12, color: "#fef08a", fontWeight: "bold", marginTop: 2 },
  editProfileBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.2)", paddingVertical: 8, borderRadius: 8, marginTop: 14 },
  editProfileBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  actionGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
  actionCard: { flex: 1, backgroundColor: COLORS.white, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  actionIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  actionCardTitle: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  actionCardSubtitle: { fontSize: 11, color: "#64748b", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 14, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#0f766e", marginBottom: 2 },
  statLabel: { fontSize: 12, color: "#64748b" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a", marginBottom: 12 },
  emptyCard: { backgroundColor: COLORS.white, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", alignItems: "center", marginBottom: 20 },
  emptyTitle: { fontSize: 15, fontWeight: "bold", color: "#1e293b", marginTop: 8 },
  emptySubtitle: { fontSize: 12, color: "#64748b", textAlign: "center", marginTop: 4 },
  appointmentCard: { backgroundColor: COLORS.white, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", marginBottom: 10 },
  aptTop: { flexDirection: "row", alignItems: "center" },
  patientName: { fontSize: 15, fontWeight: "bold", color: "#0f172a" },
  aptMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },
  chatActionBtn: { backgroundColor: "#4f46e5", padding: 8, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  rxQuickBtn: { backgroundColor: "#0d9488", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  rxQuickBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  logoutButton: { backgroundColor: "#ef4444", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },
  logoutButtonText: { color: COLORS.white, fontWeight: "bold", fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 22, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  label: { fontSize: 12, color: "#475569", fontWeight: "600", marginBottom: 4, marginTop: 8 },
  modalInput: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: "#f8fafc" },
  saveModalBtn: { backgroundColor: "#0d9488", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 16 },
  saveModalBtnText: { color: "#fff", fontWeight: "bold" },
});