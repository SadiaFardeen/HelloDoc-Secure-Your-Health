import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApp } from "../../Context/AppContext";

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

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedTime, setSelectedTime] = useState("");

  const availableTimes = [
    "10:00 AM",
    "11:30 AM",
    "3:00 PM",
    "5:30 PM",
  ];

  const monthNames = [
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

  const dayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const totalDays = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();

    const month = String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0");

    const date = String(day).padStart(2, "0");

    return `${year}-${month}-${date}`;
  };

  const isPastDate = (day: number) => {
    const selectedCalendarDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return selectedCalendarDate < todayDate;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() ===
        today.getFullYear()
    );
  };

  const handleDateSelect = (day: number) => {
    if (isPastDate(day)) {
      return;
    }

    const date = formatDate(day);

    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );

    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (previousMonth < currentMonthStart) {
      return;
    }

    setCurrentMonth(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );

    setCurrentMonth(nextMonth);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert(
        "Incomplete Booking",
        "Please select both a date and a time slot."
      );

      return;
    }

    const appointmentId =
      "a" + Date.now().toString();

    const newAppointment = {
      id: appointmentId,
      patientName: "Sadia Fardeen",
      doctorName:
        doctorName || "Selected Doctor",
      specialty: specialty || "General",
      date: selectedDate,
      time: selectedTime,
      status: "Upcoming" as const,
    };

    setAppointments(
      (previousAppointments) => [
        ...previousAppointments,
        newAppointment,
      ]
    );

    Alert.alert(
      "Appointment Confirmed",
      "Your appointment with " +
        (doctorName || "the doctor") +
        " has been booked successfully.",
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

  const days = getDaysInMonth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            ← Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Book Appointment
        </Text>

        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}>
            {doctorName || "Selected Doctor"}
          </Text>

          {specialty ? (
            <Text style={styles.specialty}>
              {specialty}
            </Text>
          ) : null}

          {doctorId ? (
            <Text style={styles.doctorId}>
              Doctor ID: {doctorId}
            </Text>
          ) : null}

          {fee ? (
            <Text style={styles.fee}>
              Consultation Fee: ৳{fee}
            </Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>
          Select Appointment Date
        </Text>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable
              style={styles.monthButton}
              onPress={handlePreviousMonth}
            >
              <Text style={styles.monthButtonText}>
                ‹
              </Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {monthNames[
                currentMonth.getMonth()
              ]}{" "}
              {currentMonth.getFullYear()}
            </Text>

            <Pressable
              style={styles.monthButton}
              onPress={handleNextMonth}
            >
              <Text style={styles.monthButtonText}>
                ›
              </Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {dayNames.map((day) => (
              <View
                key={day}
                style={styles.weekDay}
              >
                <Text style={styles.weekDayText}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return (
                  <View
                    key={`empty-${index}`}
                    style={styles.dayContainer}
                  />
                );
              }

              const date = formatDate(day);

              const selected =
                selectedDate === date;

              const past = isPastDate(day);

              const todayDate = isToday(day);

              return (
                <Pressable
                  key={date}
                  style={[
                    styles.dayContainer,
                    selected &&
                      styles.selectedDay,
                    todayDate &&
                      !selected &&
                      styles.todayDay,
                    past &&
                      styles.pastDay,
                  ]}
                  onPress={() =>
                    handleDateSelect(day)
                  }
                  disabled={past}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected &&
                        styles.selectedDayText,
                      past &&
                        styles.pastDayText,
                      todayDate &&
                        !selected &&
                        styles.todayDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {selectedDate ? (
          <View style={styles.selectedDateCard}>
            <Text style={styles.selectedDateTitle}>
              Selected Date
            </Text>

            <Text style={styles.selectedDateText}>
              📅 {selectedDate}
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>
          Select Available Time Slot
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
              onPress={() =>
                setSelectedTime(time)
              }
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

        {selectedDate || selectedTime ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Selected Appointment
            </Text>

            <Text style={styles.summaryText}>
              Date:{" "}
              {selectedDate || "Not selected"}
            </Text>

            <Text style={styles.summaryText}>
              Time:{" "}
              {selectedTime || "Not selected"}
            </Text>
          </View>
        ) : null}

        <Pressable
          style={[
            styles.confirmButton,
            (!selectedDate || !selectedTime) &&
              styles.disabledButton,
          ]}
          onPress={handleConfirmBooking}
          disabled={
            !selectedDate || !selectedTime
          }
        >
          <Text style={styles.confirmButtonText}>
            Confirm Appointment
          </Text>
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
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
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

  doctorId: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
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

  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  monthButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  monthButtonText: {
    fontSize: 28,
    color: "#0F172A",
    lineHeight: 30,
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekDay: {
    flex: 1,
    alignItems: "center",
  },

  weekDayText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayContainer: {
    width: "14.2857%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  dayText: {
    width: 36,
    height: 36,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    borderRadius: 18,
    paddingTop: 8,
  },

  selectedDay: {
    backgroundColor: "#0D9488",
    borderRadius: 18,
  },

  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  todayDay: {
    borderWidth: 1,
    borderColor: "#0D9488",
    borderRadius: 18,
  },

  todayDayText: {
    color: "#0D9488",
    fontWeight: "700",
  },

  pastDay: {
    opacity: 0.35,
  },

  pastDayText: {
    color: "#94A3B8",
  },

  selectedDateCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  selectedDateTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065F46",
  },

  selectedDateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#047857",
    marginTop: 5,
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

  summaryCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 8,
  },

  summaryText: {
    fontSize: 14,
    color: "#047857",
    marginTop: 4,
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