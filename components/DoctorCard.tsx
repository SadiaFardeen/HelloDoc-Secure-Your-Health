import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  fee: number;
  onPress: () => void;
}

export default function DoctorCard({
  name,
  specialty,
  hospital,
  fee,
  onPress,
}: DoctorCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>

      <Text style={styles.specialty}>{specialty}</Text>

      <Text style={styles.hospital}>{hospital}</Text>

      <Text style={styles.fee}>Consultation Fee: ৳{fee}</Text>

      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  specialty: {
    color: "#0D9488",
    marginTop: 5,
    fontWeight: "600",
  },

  hospital: {
    marginTop: 5,
    color: "#555",
  },

  fee: {
    marginTop: 8,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#0D9488",
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});