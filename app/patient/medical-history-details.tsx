import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { INITIAL_MEDICAL_HISTORY } from "../../data/medicalHistory";

export default function MedicalHistoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const record = INITIAL_MEDICAL_HISTORY.find(
    (item) => item.id === id
  );

  if (!record) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Medical record not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Medical History Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Diagnosis: {record.diagnosis}
        </Text>

        <Text style={styles.text}>
          Prescription: {record.prescription}
        </Text>

        <Text style={styles.text}>
          Visit Date: {record.visitDate}
        </Text>

        <Text style={styles.text}>
          Patient ID: {record.patientId}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  text: {
    marginBottom: 8,
    fontSize: 16,
  },
});