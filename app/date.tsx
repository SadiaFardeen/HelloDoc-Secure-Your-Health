import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function DateScreen() {
  const router = useRouter();

  const { doctorId, doctorName } = useLocalSearchParams();

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <View style={styles.container}>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Book Appointment</Text>

      <Text style={styles.doctor}>{doctorName}</Text>

      <Text style={styles.label}>Select Appointment Date</Text>

      <Calendar
        minDate={today}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#0D9488",
          },
          [today]: {
            marked: true,
            dotColor: "#0D9488",
          },
        }}
        theme={{
          todayTextColor: "#0D9488",
          arrowColor: "#0D9488",
          selectedDayBackgroundColor: "#0D9488",
          selectedDayTextColor: "#FFFFFF",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "700",
        }}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Selected Date</Text>

        <Text style={styles.infoDate}>{selectedDate}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/slot",
            params: {
              doctorId,
              doctorName,
              date: selectedDate,
            },
          })
        }
      >
        <Text style={styles.buttonText}>Continue</Text>
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

  backButton: {
    width: 90,
    backgroundColor: "#E2F7F5",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  backText: {
    color: "#0D9488",
    fontWeight: "bold",
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 10,
  },

  doctor: {
    fontSize: 18,
    color: "#0D9488",
    fontWeight: "600",
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#334155",
  },

  infoBox: {
    backgroundColor: "#ECFEFF",
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
  },

  infoTitle: {
    fontSize: 14,
    color: "#64748B",
  },

  infoDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D9488",
    marginTop: 5,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#0D9488",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});