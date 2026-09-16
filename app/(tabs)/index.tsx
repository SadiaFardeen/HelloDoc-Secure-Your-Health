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

const GENDER_OPTIONS = ["Male", "Female", "Others"];

export default function PatientDashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const userId = (params.userId as string) || "1";
  const [profile, setProfile] = useState<any>({
    name: (params.userName as string) || "Patient",
    email: (params.userEmail as string) || "patient@hellodoc.com",
    age: "24",
    gender: "Male",
    blood_group: "O+",
    height: "5'7\"",
    weight: "65 kg",
    image_url: "",
  });

  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(profile.age);
  const [editGender, setEditGender] = useState(profile.gender || "Male");
  const [editBloodGroup, setEditBloodGroup] = useState(profile.blood_group);
  const [editHeight, setEditHeight] = useState(profile.height);
  const [editWeight, setEditWeight] = useState(profile.weight);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      if (userId && api.getUserProfile) {
        const u = await api.getUserProfile(userId);
        if (u && !u.error) {
          setProfile({
            name: u.name || profile.name,
            email: u.email || profile.email,
            age: u.age ? String(u.age) : "24",
            gender: u.gender || "Male",
            blood_group: u.blood_group || "O+",
            height: u.height || "5'7\"",
            weight: u.weight || "65 kg",
            image_url: u.image_url || "",
          });
          setEditName(u.name || profile.name);
          setEditAge(u.age ? String(u.age) : "24");
          setEditGender(u.gender || "Male");
          setEditBloodGroup(u.blood_group || "O+");
          setEditHeight(u.height || "5'7\"");
          setEditWeight(u.weight || "65 kg");
          setEditImageUrl(u.image_url || "");
        }
      }
      const apts = await api.getAppointments();
      if (Array.isArray(apts)) setAppointments(apts);

      const rxs = await api.getPrescriptions();
      if (Array.isArray(rxs)) setPrescriptions(rxs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const res = await api.updateUserProfile(userId, {
        name: editName.trim(),
        age: Number(editAge) || null,
        gender: editGender,
        blood_group: editBloodGroup.trim(),
        height: editHeight.trim(),
        weight: editWeight.trim(),
        image_url: editImageUrl.trim(),
      });
      if (res && res.user) {
        setProfile(res.user);
        setEditGender(res.user.gender || editGender);
      }
      setEditModalVisible(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
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
                <Ionicons name="person" size={32} color={COLORS.white} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeText}>Hello, Patient 👋</Text>
              <Text style={styles.patientNameText}>{profile.name}</Text>
              <Text style={styles.emailText}>{profile.email}</Text>
            </View>
          </View>

          <View style={styles.vitalsRow}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Age</Text>
              <Text style={styles.vitalValue}>{profile.age || "--"} yrs</Text>
            </View>
            <View style={styles.vitalDivider} />
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Gender</Text>
              <Text style={styles.vitalValue}>{profile.gender || "Male"}</Text>
            </View>
            <View style={styles.vitalDivider} />
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Blood</Text>
              <Text style={styles.vitalValue}>{profile.blood_group || "--"}</Text>
            </View>
            <View style={styles.vitalDivider} />
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Weight</Text>
              <Text style={styles.vitalValue}>{profile.weight || "--"}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => {
              setEditGender(profile.gender || "Male");
              setEditModalVisible(true);
            }}
          >
            <Ionicons name="create-outline" size={16} color={COLORS.white} />
            <Text style={styles.editProfileBtnText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/doctor-discovery")}
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#ccfbf1" }]}>
              <Ionicons name="search" size={24} color="#0d9488" />
            </View>
            <Text style={styles.actionCardTitle}>Find a Doctor</Text>
            <Text style={styles.actionCardSubtitle}>Book consultation</Text>
          </TouchableOpacity>

          {/* প্রেসক্রিপশন কার্ডে ক্লিক করলে সরাসরি আপনার নতুন /patient/records পেজে যাবে */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push({
                pathname: "/patient/records",
                params: { patientName: profile.name },
              })
            }
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#e0e7ff" }]}>
              <Ionicons name="document-text" size={24} color="#4f46e5" />
            </View>
            <Text style={styles.actionCardTitle}>Prescriptions</Text>
            <Text style={styles.actionCardSubtitle}>View all ({prescriptions.length})</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.chatDoctorBanner}
          onPress={() =>
            router.push({
              pathname: "/consultation/chat/[id]",
              params: { id: "1", userName: profile.name, userRole: "patient" },
            })
          }
        >
          <View style={styles.chatIconBox}>
            <Ionicons name="chatbubbles" size={24} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.chatBannerTitle}>Chat with Doctor</Text>
            <Text style={styles.chatBannerSubtitle}>Select doctor & message in real-time</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#0d9488" />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/booking")}>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={40} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No upcoming appointments</Text>
            <Text style={styles.emptySubtitle}>Find a doctor and book your consultation slot.</Text>
            <TouchableOpacity
              style={styles.findDoctorMiniBtn}
              onPress={() => router.push("/(tabs)/doctor-discovery")}
            >
              <Text style={styles.findDoctorMiniBtnText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          appointments.map((apt) => (
            <View key={apt.id} style={styles.appointmentCard}>
              <View style={styles.aptTop}>
                <Ionicons name="medical" size={28} color="#0d9488" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.doctorName}>{apt.doctor_name}</Text>
                  <Text style={styles.specialty}>{apt.specialty}</Text>
                  <Text style={styles.aptMeta}>📅 {apt.date} • ⏰ {apt.time}</Text>
                </View>
                <TouchableOpacity
                  style={styles.chatNowBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/consultation/chat/[id]",
                      params: { id: String(apt.doctor_id || "1"), userName: profile.name, userRole: "patient" },
                    })
                  }
                >
                  <Text style={styles.chatNowBtnText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/")}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Update Patient Profile Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Patient Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} />

            <Text style={styles.label}>Select Gender</Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderChip,
                    editGender === g && styles.activeGenderChip,
                  ]}
                  onPress={() => setEditGender(g)}
                >
                  <Text
                    style={[
                      styles.genderChipText,
                      editGender === g && styles.activeGenderChipText,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Age</Text>
                <TextInput style={styles.modalInput} value={editAge} onChangeText={setEditAge} keyboardType="numeric" />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Blood Group</Text>
                <TextInput style={styles.modalInput} value={editBloodGroup} onChangeText={setEditBloodGroup} placeholder="e.g. O+, A+" />
              </View>
            </View>

            <View style={styles.modalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Height</Text>
                <TextInput style={styles.modalInput} value={editHeight} onChangeText={setEditHeight} placeholder="e.g. 5'7&quot;" />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Weight</Text>
                <TextInput style={styles.modalInput} value={editWeight} onChangeText={setEditWeight} placeholder="e.g. 65 kg" />
              </View>
            </View>

            <Text style={styles.label}>Profile Picture URL</Text>
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
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingBottom: 40 },
  headerCard: { backgroundColor: "#0f2137", padding: 20, borderRadius: 20, marginBottom: 18 },
  topProfileRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  avatarImg: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: "#fff" },
  avatarMini: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#1e3a5f", justifyContent: "center", alignItems: "center" },
  welcomeText: { color: "#94a3b8", fontSize: 13, fontWeight: "500" },
  patientNameText: { fontSize: 22, fontWeight: "bold", color: COLORS.white },
  emailText: { fontSize: 12, color: "#cbd5e1" },
  vitalsRow: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.08)", paddingVertical: 12, borderRadius: 12, marginTop: 16, alignItems: "center" },
  vitalItem: { flex: 1, alignItems: "center" },
  vitalLabel: { color: "#94a3b8", fontSize: 11 },
  vitalValue: { color: COLORS.white, fontSize: 13, fontWeight: "bold", marginTop: 2 },
  vitalDivider: { width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.15)" },
  editProfileBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.16)", paddingVertical: 9, borderRadius: 10, marginTop: 14 },
  editProfileBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  actionGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  actionCard: { flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  actionIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  actionCardTitle: { fontSize: 15, fontWeight: "bold", color: "#0f172a" },
  actionCardSubtitle: { fontSize: 12, color: "#64748b", marginTop: 2 },
  chatDoctorBanner: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", gap: 12, marginBottom: 20 },
  chatIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#0d9488", justifyContent: "center", alignItems: "center" },
  chatBannerTitle: { fontSize: 15, fontWeight: "bold", color: "#0f172a" },
  chatBannerSubtitle: { fontSize: 12, color: "#64748b" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  seeAllText: { fontSize: 13, color: "#0d9488", fontWeight: "bold" },
  emptyCard: { backgroundColor: COLORS.white, padding: 26, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", alignItems: "center", marginBottom: 20 },
  emptyTitle: { fontSize: 15, fontWeight: "bold", color: "#1e293b", marginTop: 10 },
  emptySubtitle: { fontSize: 12, color: "#64748b", textAlign: "center", marginTop: 4, marginBottom: 14 },
  findDoctorMiniBtn: { backgroundColor: "#0d9488", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  findDoctorMiniBtnText: { color: COLORS.white, fontWeight: "bold", fontSize: 12 },
  appointmentCard: { backgroundColor: COLORS.white, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0", marginBottom: 10 },
  aptTop: { flexDirection: "row", alignItems: "center" },
  doctorName: { fontSize: 15, fontWeight: "bold", color: "#0f172a" },
  specialty: { fontSize: 12, color: "#0d9488", marginTop: 1 },
  aptMeta: { fontSize: 12, color: "#64748b", marginTop: 4 },
  chatNowBtn: { backgroundColor: "#0d9488", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  chatNowBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  logoutButton: { backgroundColor: "#ef4444", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },
  logoutButtonText: { color: COLORS.white, fontWeight: "bold", fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 22, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  modalRow: { flexDirection: "row" },
  genderRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  genderChip: { flex: 1, paddingVertical: 9, borderRadius: 8, borderWidth: 1, borderColor: "#cbd5e1", alignItems: "center", backgroundColor: "#f8fafc" },
  activeGenderChip: { backgroundColor: "#0d9488", borderColor: "#0d9488" },
  genderChipText: { fontSize: 13, color: "#475569", fontWeight: "600" },
  activeGenderChipText: { color: COLORS.white, fontWeight: "bold" },
  label: { fontSize: 12, color: "#475569", fontWeight: "600", marginBottom: 4, marginTop: 8 },
  modalInput: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#f8fafc" },
  saveModalBtn: { backgroundColor: "#0d9488", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 16 },
  saveModalBtnText: { color: "#fff", fontWeight: "bold" },
});