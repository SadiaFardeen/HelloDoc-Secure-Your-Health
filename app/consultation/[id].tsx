import { useEffect, useState } from "react";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "../../components/custom-button";
import { COLORS } from "../../constants/theme";
import { DOCTORS } from "../../data/doctors";

export default function ConsultationScreen() {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const doctor = DOCTORS.find(
    (item) => item.id === id
  );

  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(
        (previousSeconds) =>
          previousSeconds + 1
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const timer =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(remainingSeconds).padStart(2, "0")}`;

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFoundText}>
          Doctor not found.
        </Text>
      </SafeAreaView>
    );
  }

  const handleOpenChat = () => {
    router.push({
      pathname: "/consultation/chat/[id]",
      params: {
        id: doctor.id,
      },
    });
  };

  const handleEndConsultation = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>
          ● Consultation Active
        </Text>

        <Text style={styles.secureText}>
          Your consultation is private and secure.
        </Text>
      </View>

      <Text style={styles.title}>
        Active Consultation
      </Text>

      <Text style={styles.name}>
        {doctor.name}
      </Text>

      <Text style={styles.specialization}>
        {doctor.specialization}
      </Text>

      <View style={styles.timerBox}>
        <Text style={styles.timerLabel}>
          Session Time
        </Text>

        <Text style={styles.timer}>
          {timer}
        </Text>
      </View>

      <CustomButton
        title="Open Consultation Chat"
        onPress={handleOpenChat}
        style={styles.chatButton}
      />

      <CustomButton
        title="End Consultation"
        variant="danger"
        onPress={handleEndConsultation}
        style={styles.endButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },

  statusCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.success,
  },

  secureText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary,
    textAlign: "center",
    marginTop: 16,
  },

  specialization: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 4,
  },

  timerBox: {
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 20,
    marginTop: 24,
  },

  timerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primaryDark,
    textTransform: "uppercase",
  },

  timer: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginTop: 7,
  },

  chatButton: {
    marginTop: 28,
  },

  endButton: {
    marginTop: 10,
  },

  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});