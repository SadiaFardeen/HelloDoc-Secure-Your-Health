import { useApp } from "@/Context/AppContext";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Appointment } from "../../data/mockData";

export default function DoctorDashboard() {
  const {
    doctorId: doctorIdParam,
    prescriptionStatus,
    assignedPatient,
  } = useLocalSearchParams<{
    doctorId?: string;
    prescriptionStatus?: string;
    assignedPatient?: string;
  }>();
  const {
    appointments,
    currentDoctorId,
    prescriptions,
    doctorAccounts,
    doctors,
    setCurrentDoctorId,
    signOut,
  } = useApp();

  const doctorId = doctorIdParam ?? currentDoctorId ?? undefined;
  const doctorProfile = doctors.find((doctor) => doctor.id === doctorId);
  const doctorAccount = doctorAccounts.find(
    (account) => account.doctorId === doctorId
  );

  const doctorAppointments = appointments
    .filter(
      (appointment) =>
        appointment.doctorId === doctorId &&
        appointment.status !== "Cancelled"
    )
    .sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );

  React.useEffect(() => {
    if (doctorId) {
      setCurrentDoctorId(doctorId);
    }
  }, [doctorId, setCurrentDoctorId]);

  const openChat = (appointment: Appointment) => {
    router.push({
      pathname: "/consultation/chat/[id]",
      params: {
        id: `${appointment.doctorId}_${appointment.patientId}`,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        currentUserId: `doctor:${appointment.doctorId}`,
        targetName: appointment.patientName,
      },
    });
  };

  const createPrescription = (appointment: Appointment) => {
    router.push({
      pathname: "/doctorDashboard/prescription",
      params: {
        appointmentId: appointment.id,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
      },
    });
  };

  const prescriptionCountFor = (appointmentId: string) =>
    prescriptions.filter(
      (prescription) => prescription.appointmentId === appointmentId
    ).length;

  const handleLogout = () => {
    signOut();
    router.replace("/");
  };

  if (!doctorProfile || !doctorAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Doctor account not found</Text>
          <Text style={styles.errorText}>Please sign in again.</Text>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Back to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back 👨‍⚕️</Text>
          <Text style={styles.doctorName}>{doctorProfile.name}</Text>
          <Text style={styles.specialty}>{doctorProfile.specialization}</Text>
          <Text style={styles.email}>{doctorAccount.email}</Text>
        </View>

        {prescriptionStatus === "success" ? (
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>Prescription assigned</Text>
            <Text style={styles.successText}>
              {assignedPatient || "The patient"} will see it after logging in
              with the linked patient email.
            </Text>
          </View>
        ) : null}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{doctorAppointments.length}</Text>
            <Text style={styles.statLabel}>Assigned Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {prescriptions.filter((item) => item.doctorId === doctorId).length}
            </Text>
            <Text style={styles.statLabel}>Prescriptions</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Appointments & Patients</Text>

        {doctorAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No patient appointments yet</Text>
            <Text style={styles.emptyText}>
              A patient will appear here after booking you.
            </Text>
          </View>
        ) : (
          doctorAppointments.map((appointment) => {
            const assignedPrescriptionCount = prescriptionCountFor(
              appointment.id
            );

            return (
              <View key={appointment.id} style={styles.patientCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleArea}>
                    <Text style={styles.patientName}>
                      {appointment.patientName}
                    </Text>
                    <Text style={styles.patientEmail}>
                      {appointment.patientEmail || "Patient email unavailable"}
                    </Text>
                    <Text style={styles.appointmentInfo}>
                      📅 {appointment.date} · 🕒 {appointment.time}
                    </Text>
                  </View>
                  <Text style={styles.statusBadge}>{appointment.status}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <Pressable
                    style={[styles.cardButton, styles.chatButton]}
                    onPress={() => openChat(appointment)}
                  >
                    <Text style={styles.cardButtonText}>💬 Chat</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.cardButton, styles.prescriptionButton]}
                    onPress={() => createPrescription(appointment)}
                  >
                    <Text style={styles.cardButtonText}>
                      📝 Prescription
                      {assignedPrescriptionCount > 0
                        ? ` (${assignedPrescriptionCount})`
                        : ""}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    backgroundColor: "#0F766E",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  greeting: { color: "#99F6E4", fontSize: 14, fontWeight: "500" },
  doctorName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  specialty: { color: "#CCFBF1", fontSize: 14, marginTop: 3 },
  email: { color: "#D1FAE5", fontSize: 12, marginTop: 8 },
  successCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  successTitle: { color: "#065F46", fontWeight: "800", fontSize: 15 },
  successText: { color: "#047857", fontSize: 13, lineHeight: 19, marginTop: 4 },
  statsContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#0F766E" },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardTitleArea: { flex: 1 },
  patientName: { fontSize: 17, fontWeight: "700", color: "#0F172A" },
  patientEmail: { color: "#0284C7", fontSize: 12, marginTop: 4 },
  appointmentInfo: { color: "#64748B", fontSize: 13, marginTop: 6 },
  statusBadge: {
    color: "#0F766E",
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
    fontSize: 11,
    fontWeight: "700",
  },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  cardButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: "center",
  },
  chatButton: { backgroundColor: "#0F766E" },
  prescriptionButton: { backgroundColor: "#0284C7" },
  cardButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#0F172A" },
  emptyText: { color: "#64748B", marginTop: 7, textAlign: "center" },
  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  logoutButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: "center", padding: 24 },
  errorTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
  },
});
