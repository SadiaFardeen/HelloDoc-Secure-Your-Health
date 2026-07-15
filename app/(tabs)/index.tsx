import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApp } from "../../Context/AppContext";

export default function PatientDashboard() {
  const router = useRouter();

  const { appointments, userRole } = useApp();

  const upcomingAppointments = appointments.filter(
    (item) => item.status === "Upcoming"
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HelloDoc</Text>

        <Text style={styles.subtitle}>
          Welcome Patient 👋
        </Text>

        <Text style={styles.role}>
          Role: {userRole}
        </Text>
      </View>

      <View style={styles.content}>

        <Pressable
          style={styles.bookButton}
          onPress={() => router.push("/booking")}
        >
          <Text style={styles.bookButtonText}>
            Book Appointment
          </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>
          Upcoming Appointments
        </Text>

        <FlatList
          data={upcomingAppointments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.doctor}>
                {item.doctorName}
              </Text>

              <Text style={styles.specialty}>
                {item.specialty}
              </Text>

              <Text style={styles.info}>
                📅 {item.date}
              </Text>

              <Text style={styles.info}>
                🕒 {item.time}
              </Text>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No upcoming appointments.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    backgroundColor: "#0D9488",
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#E6FFFB",
    marginTop: 5,
    fontSize: 18,
  },

  role: {
    marginTop: 10,
    color: "#CCFBF1",
    fontWeight: "600",
  },

  content: {
    flex: 1,
    padding: 20,
  },

  bookButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  doctor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },

  specialty: {
    color: "#64748B",
    marginTop: 4,
    marginBottom: 10,
  },

  info: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 5,
  },

  badge: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#15803D",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
    fontSize: 16,
  },
});