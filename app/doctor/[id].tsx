import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/custom-button";
import { COLORS } from "../../constants/theme";
import { api } from "../../services/api";

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("2026-09-25");
  const [time, setTime] = useState("10:30 AM");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      api.getDoctorById(id as string)
        .then((data) => setDoctor(data))
        .catch((err) => Alert.alert("Error", err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBooking = async () => {
    if (!patientName.trim()) {
      Alert.alert("Validation Error", "Please enter patient name");
      return;
    }

    try {
      setSubmitting(true);
      await api.bookAppointment({
        patient_id: "P-101",
        patient_name: patientName,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        specialty: doctor.specialization,
        date,
        time,
      });

      setModalVisible(false);
      Alert.alert("Success", "Appointment booked successfully!", [
        { text: "View Appointments", onPress: () => router.push("/(tabs)/booking") }
      ]);
    } catch (err: any) {
      Alert.alert("Booking Failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.notFoundText}>Doctor details not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBackBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Doctor Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={54} color={COLORS.primary} />
          </View>
          <Text style={styles.docName}>{doctor.name}</Text>
          <Text style={styles.docSpecialty}>{doctor.specialization}</Text>
          <Text style={styles.docQual}>{doctor.qualification}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{doctor.experience} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>⭐ {doctor.rating || "5.0"}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>৳{doctor.fee}</Text>
              <Text style={styles.statLabel}>Fee</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hospital & Location</Text>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{doctor.hospital}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{doctor.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.aboutText}>{doctor.about || "Experienced specialist doctor available for consultations."}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.infoText}>{doctor.languages || "English, Bangla"}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerFeeLabel}>Consultation Fee</Text>
          <Text style={styles.footerFeeVal}>৳{doctor.fee}</Text>
        </View>
        <TouchableOpacity style={styles.bookNowBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.bookNowBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Appointment</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Patient Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter full name"
              value={patientName}
              onChangeText={setPatientName}
            />

            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.textInput}
              value={date}
              onChangeText={setDate}
            />

            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={styles.textInput}
              value={time}
              onChangeText={setTime}
            />

            <CustomButton
              title={submitting ? "Booking..." : "Confirm Booking"}
              onPress={handleBooking}
              disabled={submitting}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navBackBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight + "30",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  docName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
  },
  docSpecialty: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  docQual: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statVal: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.grayDark,
  },
  aboutText: {
    fontSize: 13,
    color: COLORS.grayDark,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerFeeLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  footerFeeVal: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.success,
  },
  bookNowBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  bookNowBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.grayDark,
    marginBottom: 4,
    marginTop: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLORS.background,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.grayDark,
  },
  backButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.white,
  },
});