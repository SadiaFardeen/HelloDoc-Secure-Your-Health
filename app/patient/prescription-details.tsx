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

export default function PrescriptionDetailsScreen() {
  const {
    doctorName,
    patientName,
    patientEmail,
    medicines,
    notes,
    createdAt,
  } = useLocalSearchParams();

  const medicineList = medicines
    ? JSON.parse(medicines as string)
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>My Prescription Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Doctor</Text>
          <Text style={styles.value}>{doctorName}</Text>

          <Text style={styles.label}>Patient</Text>
          <Text style={styles.value}>{patientName}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{patientEmail}</Text>

          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>
            {new Date(createdAt as string).toLocaleDateString()}
          </Text>

          <Text style={styles.label}>Medicines</Text>

          {medicineList.map((item: string, index: number) => (
            <Text key={index} style={styles.medicine}>
              • {item}
            </Text>
          ))}

          <Text style={styles.label}>Doctor's Notes</Text>
          <Text style={styles.value}>{notes}</Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to My Prescriptions</Text>
        </Pressable>

        <Pressable
          style={styles.dashboardButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D9488",
    marginTop: 14,
  },

  value: {
    fontSize: 15,
    color: "#334155",
    marginTop: 4,
  },

  medicine: {
    fontSize: 15,
    color: "#334155",
    marginTop: 5,
  },

  button: {
    backgroundColor: "#0D9488",
    marginTop: 25,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  dashboardButton: {
    backgroundColor: "#2563EB",
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});