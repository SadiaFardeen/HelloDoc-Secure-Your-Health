import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useApp } from "../Context/AppContext";
import { Appointment, DOCTORS } from "../Data/mockData";

export default function ConfirmationScreen() {
  const router = useRouter();

  const { addAppointment } = useApp();

  const { doctorId, doctorName, date, time } = useLocalSearchParams();

  const doctor = DOCTORS.find((d) => d.id === doctorId);

  const confirmAppointment = () => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: "Current Patient",
      doctorName: String(doctorName),
      specialty: doctor?.specialty || "",
      date: String(date),
      time: String(time),
      status: "Upcoming",
    };

    addAppointment(newAppointment);

    Alert.alert(
      "Appointment Confirmed",
      "Your appointment has been booked successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Summary</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Doctor</Text>
        <Text style={styles.value}>{doctorName}</Text>

        <Text style={styles.label}>Hospital</Text>
        <Text style={styles.value}>{doctor?.hospital}</Text>

        <Text style={styles.label}>Specialty</Text>
        <Text style={styles.value}>{doctor?.specialty}</Text>

        <Text style={styles.label}>Appointment Date</Text>
        <Text style={styles.value}>{date}</Text>

        <Text style={styles.label}>Time Slot</Text>
        <Text style={styles.value}>{time}</Text>

        <Text style={styles.label}>Consultation Fee</Text>
        <Text style={styles.value}>৳ {doctor?.fee}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={confirmAppointment}
      >
        <Text style={styles.buttonText}>
          Confirm Appointment
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 15,
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },

  button: {
    marginTop: 35,
    backgroundColor: "#0D9488",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});