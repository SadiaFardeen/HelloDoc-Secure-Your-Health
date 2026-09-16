import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { api } from "../../services/api";

export default function BookingScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = (id: number) => {
    Alert.alert("Cancel Appointment", "Are you sure you want to cancel this appointment?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await api.cancelAppointment(id);
            Alert.alert("Cancelled", "Appointment has been cancelled successfully.");
            fetchBookings();
          } catch (err: any) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <Text style={styles.headerSubtitle}>Manage and track your doctor visits</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchBookings}>
          <Ionicons name="refresh-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={64} color={COLORS.grayLight} />
          <Text style={styles.emptyTitle}>No appointments found</Text>
          <Text style={styles.emptySubtitle}>You have not booked any appointments yet.</Text>
          <TouchableOpacity
            style={styles.findDocBtn}
            onPress={() => router.push("/(tabs)/doctor-discovery")}
          >
            <Text style={styles.findDocBtnText}>Book an Appointment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {appointments.map((item: any) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatarMini}>
                  <Ionicons name="person" size={22} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{item.doctor_name || "Specialist Doctor"}</Text>
                  <Text style={styles.specialty}>{item.specialty || "General Consultation"}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status || "Upcoming"}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{item.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.patientRow}>
                <Text style={styles.patientLabel}>Patient: </Text>
                <Text style={styles.patientName}>{item.patient_name}</Text>
              </View>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
                <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.grayDark,
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: "center",
  },
  findDocBtn: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  findDocBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 20,
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  docName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  specialty: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 1,
  },
  statusBadge: {
    backgroundColor: COLORS.success + "15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.grayDark,
  },
  patientRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  patientLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  patientName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.black,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.error + "10",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.error,
  },
});