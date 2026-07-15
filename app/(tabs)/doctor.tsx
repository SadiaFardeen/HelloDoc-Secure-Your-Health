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

export default function DoctorDashboard() {
  const router = useRouter();

  const { appointments } = useApp();

  const upcomingAppointments = appointments.filter(
    (item) => item.status === "Upcoming"
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Dashboard</Text>
        <Text style={styles.subtitle}>
          Today's Appointments
        </Text>
      </View>

      <FlatList
        data={upcomingAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.patient}>
              {item.patientName}
            </Text>

            <Text style={styles.info}>
              Doctor: {item.doctorName}
            </Text>

            <Text style={styles.info}>
              {item.specialty}
            </Text>

            <Text style={styles.info}>
              📅 {item.date}
            </Text>

            <Text style={styles.info}>
              🕒 {item.time}
            </Text>

            <Pressable
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/prescription",
                  params: {
                    appointmentId: item.id,
                    patientName: item.patientName,
                  },
                })
              }
            >
              <Text style={styles.buttonText}>
                Write Prescription
              </Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No Appointments Today
          </Text>
        }
      />
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
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#CCFBF1",
    marginTop: 5,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },

  patient: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 10,
  },

  info: {
    color: "#475569",
    marginBottom: 5,
  },

  button: {
    marginTop: 15,
    backgroundColor: "#0D9488",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },
});