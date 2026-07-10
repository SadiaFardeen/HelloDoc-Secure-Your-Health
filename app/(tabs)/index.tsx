import { useApp } from "@/context/AppContext";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function PatientDashboard() {
  const { appointments, userRole } = useApp();

  const patientAppointments = appointments.filter(
    (app) => app.status === "Upcoming"
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello, Patient 👋</Text>
        <Text style={styles.roleText}>Role: {userRole}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Upcoming Appointments</Text>

        <FlatList
          data={patientAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.doctorName}>{item.doctorName}</Text>
                <Text style={styles.statusBadge}>{item.status}</Text>
              </View>
              <Text style={styles.specialty}>{item.specialty}</Text>
              <View style={styles.divider} />
              <Text style={styles.dateTime}>
                📅 {item.date}  |  🕒 {item.time}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No upcoming appointments found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { backgroundColor: "#0D1F4E", padding: 24, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  roleText: { fontSize: 14, color: "#0D9488", marginTop: 4, fontWeight: "600" },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 16 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  doctorName: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  statusBadge: { backgroundColor: "#CCFBF1", color: "#0F766E", fontSize: 12, fontWeight: "600", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: "hidden" },
  specialty: { fontSize: 14, color: "#64748B", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 12 },
  dateTime: { fontSize: 13, color: "#475569", fontWeight: "500" },
  emptyText: { textAlign: "center", color: "#64748B", marginTop: 40, fontSize: 14 }
});