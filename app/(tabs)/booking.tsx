import { useApp } from "@/Context/AppContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Appointment } from "../../data/mockData";

const AVAILABLE_TIMES = ["10:00 AM", "11:30 AM", "3:00 PM", "5:30 PM"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingScreen() {
  const params = useLocalSearchParams<{
    doctorId?: string;
    patientId?: string;
  }>();
  const {
    addAppointment,
    appointments,
    currentPatientId,
    patientAccounts,
    doctors,
  } = useApp();

  // The patient ID was set when this exact patient email logged in.
  const patientId = params.patientId ?? currentPatientId ?? undefined;
  const patient = patientAccounts.find((item) => item.id === patientId);
  const doctor = doctors.find((item) => item.id === params.doctorId);

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const result: (number | null)[] = [];

    for (let index = 0; index < firstDay; index += 1) {
      result.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      result.push(day);
    }

    return result;
  }, [currentMonth]);

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${String(day).padStart(2, "0")}`;
  };

  const isPastDate = (day: number) => {
    const candidate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return candidate < todayOnly;
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const handlePreviousMonth = () => {
    const previous = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const currentStart = new Date(today.getFullYear(), today.getMonth(), 1);

    if (previous >= currentStart) {
      setCurrentMonth(previous);
    }
  };

  const handleConfirm = async () => {
    setFeedback("");

    if (!patient || !doctor) {
      setFeedback("Patient or doctor information is missing. Please sign in again.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setFeedback("Please select both a date and a time slot.");
      return;
    }

    const duplicate = appointments.some(
      (appointment) =>
        appointment.patientId === patient.id &&
        appointment.doctorId === doctor.id &&
        appointment.date === selectedDate &&
        appointment.time === selectedTime &&
        appointment.status !== "Cancelled"
    );

    if (duplicate) {
      setFeedback("You already booked this doctor for the selected slot.");
      return;
    }

    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      patientEmail: patient.email,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialization,
      date: selectedDate,
      time: selectedTime,
      status: "Upcoming",
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      await addAppointment(newAppointment);

      // Do not depend on Alert button callbacks; React Native Web does not
      // provide the native Alert API consistently.
      router.replace({
        pathname: "/patient/dashboard",
        params: {
          patientId: patient.id,
          bookingStatus: "success",
        },
      });
    } catch (error) {
      console.error("Failed to save appointment:", error);
      setFeedback("Could not save the appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!patient || !doctor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorBox}>
          <Text style={styles.title}>Booking information missing</Text>
          <Text style={styles.feedbackText}>
            Open booking from a doctor profile after logging in as a patient.
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Book Appointment</Text>

        <View style={styles.patientCard}>
          <Text style={styles.cardLabel}>Booking for</Text>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientEmail}>{patient.email}</Text>
        </View>

        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialization}</Text>
          <Text style={styles.fee}>Consultation Fee: ৳{doctor.fee}</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Appointment Date</Text>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable style={styles.monthButton} onPress={handlePreviousMonth}>
              <Text style={styles.monthButtonText}>‹</Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>

            <Pressable
              style={styles.monthButton}
              onPress={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                )
              }
            >
              <Text style={styles.monthButtonText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {DAY_NAMES.map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayContainer} />;
              }

              const date = formatDate(day);
              const selected = selectedDate === date;
              const past = isPastDate(day);
              const todayDate = isToday(day);

              return (
                <Pressable
                  key={date}
                  style={[
                    styles.dayContainer,
                    selected && styles.selectedDay,
                    todayDate && !selected && styles.todayDay,
                    past && styles.pastDay,
                  ]}
                  disabled={past}
                  onPress={() => {
                    setSelectedDate(date);
                    setFeedback("");
                  }}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected && styles.selectedDayText,
                      todayDate && !selected && styles.todayDayText,
                      past && styles.pastDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Available Time Slot</Text>
        <View style={styles.optionContainer}>
          {AVAILABLE_TIMES.map((time) => (
            <Pressable
              key={time}
              style={[
                styles.optionButton,
                selectedTime === time && styles.selectedOption,
              ]}
              onPress={() => {
                setSelectedTime(time);
                setFeedback("");
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedTime === time && styles.selectedOptionText,
                ]}
              >
                {time}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Selected Appointment</Text>
          <Text style={styles.summaryText}>
            Date: {selectedDate || "Not selected"}
          </Text>
          <Text style={styles.summaryText}>
            Time: {selectedTime || "Not selected"}
          </Text>
        </View>

        {feedback ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.confirmButton, isSubmitting && styles.disabledButton]}
          onPress={() => void handleConfirm()}
          disabled={isSubmitting}
        >
          <Text style={styles.confirmButtonText}>
            {isSubmitting ? "Saving Appointment..." : "Confirm Appointment"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 20, paddingBottom: 50 },
  errorBox: { flex: 1, justifyContent: "center", padding: 24 },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  backButtonText: { fontSize: 16, fontWeight: "600", color: "#0F172A" },
  title: { fontSize: 28, fontWeight: "bold", color: "#0F172A", marginBottom: 20 },
  patientCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: { fontSize: 12, fontWeight: "800", color: "#1D4ED8", textTransform: "uppercase" },
  patientName: { fontSize: 18, fontWeight: "800", color: "#1E3A8A", marginTop: 5 },
  patientEmail: { fontSize: 13, color: "#2563EB", marginTop: 3 },
  doctorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  doctorName: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  specialty: { fontSize: 14, color: "#0D9488", marginTop: 4 },
  fee: { fontSize: 13, color: "#64748B", marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#1E293B", marginBottom: 12, marginTop: 8 },
  calendarCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 16 },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  monthTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  monthButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
  monthButtonText: { fontSize: 28, color: "#0F172A", lineHeight: 30 },
  weekRow: { flexDirection: "row", marginBottom: 8 },
  weekDayText: { width: "14.2857%", textAlign: "center", fontSize: 12, fontWeight: "700", color: "#64748B" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayContainer: { width: "14.2857%", height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21 },
  dayText: { fontSize: 14, fontWeight: "600", color: "#334155" },
  selectedDay: { backgroundColor: "#0D9488" },
  selectedDayText: { color: "#FFFFFF", fontWeight: "700" },
  todayDay: { borderWidth: 1, borderColor: "#0D9488" },
  todayDayText: { color: "#0D9488", fontWeight: "700" },
  pastDay: { opacity: 0.35 },
  pastDayText: { color: "#94A3B8" },
  optionContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 18 },
  optionButton: { backgroundColor: "#E2E8F0", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  selectedOption: { backgroundColor: "#0D9488" },
  optionText: { color: "#334155", fontWeight: "600" },
  selectedOptionText: { color: "#FFFFFF" },
  summaryCard: { backgroundColor: "#ECFDF5", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#A7F3D0" },
  summaryTitle: { fontSize: 16, fontWeight: "700", color: "#065F46", marginBottom: 8 },
  summaryText: { fontSize: 14, color: "#047857", marginTop: 4 },
  feedbackBox: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: 10, padding: 12, marginBottom: 14 },
  feedbackText: { color: "#B91C1C", fontSize: 13, lineHeight: 19 },
  confirmButton: { backgroundColor: "#0D9488", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 4 },
  disabledButton: { opacity: 0.65 },
  confirmButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
