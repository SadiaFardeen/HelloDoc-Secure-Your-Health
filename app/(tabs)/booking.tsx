
import { useApp } from "@/context/AppContext";
import {
    router,
    useLocalSearchParams,
} from "expo-router";
import React, { useState } from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";


export default function BookingScreen() {
  const params = useLocalSearchParams();

  const doctorId = Array.isArray(params.doctorId)
    ? params.doctorId[0]
    : params.doctorId;

  const doctorName = Array.isArray(params.doctorName)
    ? params.doctorName[0]
    : params.doctorName;

  const specialty = Array.isArray(params.specialty)
    ? params.specialty[0]
    : params.specialty;

  const fee = Array.isArray(params.fee)
    ? params.fee[0]
    : params.fee;

  const { setAppointments } = useApp();

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const availableDates = [
    "2026-07-20",
    "2026-07-21",
    "2026-07-22",
  ];

  const availableTimes = [
    "10:00 AM",
    "11:30 AM",
    "3:00 PM",
    "5:30 PM",
  ];

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

setAppointments((previousAppointments) => [
  ...previousAppointments,
  {
    id: Date.now().toString(),
    patientName: "Sadia Fardeen",
    doctorName: doctorName,
    specialty: specialty,
    date: selectedDate,
    time: selectedTime,
    status: "Upcoming",
  },
]);

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Book Appointment
      </Text>

      <View style={styles.doctorCard}>
        <Text style={styles.doctorName}>
          {doctorName ?? "Selected Doctor"}
        </Text>

        <Text style={styles.specialty}>
          {specialty ?? ""}
        </Text>

        {fee ? (
          <Text style={styles.fee}>
            Consultation Fee: ৳{fee}
          </Text>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>
        Select Date
      </Text>

      <View style={styles.optionContainer}>
        {availableDates.map((date) => (
          <Pressable
            key={date}
            style={[
              styles.optionButton,
              selectedDate === date &&
                styles.selectedOption,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.optionText,
                selectedDate === date &&
                  styles.selectedOptionText,
              ]}
            >
              {date}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Select Time
      </Text>

      <View style={styles.optionContainer}>
        {availableTimes.map((time) => (
          <Pressable
            key={time}
            style={[
              styles.optionButton,
              selectedTime === time &&
                styles.selectedOption,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.optionText,
                selectedTime === time &&
                  styles.selectedOptionText,
              ]}
            >
              {time}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[
          styles.confirmButton,
          (!selectedDate || !selectedTime) &&
            styles.disabledButton,
        ]}
        onPress={handleConfirmBooking}
        disabled={!selectedDate || !selectedTime}
      >
        <Text style={styles.confirmButtonText}>
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
    marginBottom: 20,
  },

  doctorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  doctorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },

  specialty: {
    fontSize: 14,
    color: "#0D9488",
    marginTop: 4,
  },

  fee: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
    marginTop: 8,
  },

  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  optionButton: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  selectedOption: {
    backgroundColor: "#0D9488",
  },

  optionText: {
    color: "#334155",
    fontWeight: "600",
  },

  selectedOptionText: {
    color: "#FFFFFF",
  },

  confirmButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: "#CBD5E1",
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});