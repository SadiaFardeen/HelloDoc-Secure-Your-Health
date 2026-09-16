import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/custom-button";
import { COLORS } from "../../constants/theme";
import { DOCTORS } from "../../data/doctors";

export default function ConsultationScreen() {
  const params = useLocalSearchParams<{
    id: string;
    type?: string;
  }>();
  const [countdown, setCountdown] = useState(15);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "connected" | "ended"
  >("connecting");

  const doctor = DOCTORS.find((d) => d.id === params.id) || DOCTORS[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus("connected");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callStatus !== "connected") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCallStatus("ended");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus]);

  const handleEndCall = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {doctor.name.charAt(0)}
          </Text>
        </View>

        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <View style={styles.statusContainer}>
          {callStatus === "connecting" && (
            <Text style={styles.statusText}>Connecting call...</Text>
          )}
          {callStatus === "connected" && (
            <View style={styles.connectedContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.countdownText}>
                Session ends in: {Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, "0")}
              </Text>
            </View>
          )}
          {callStatus === "ended" && (
            <Text style={styles.endedText}>Consultation Ended</Text>
          )}
        </View>

        <View style={styles.controls}>
          <CustomButton
            title={callStatus === "ended" ? "Done" : "End Call"}
            onPress={handleEndCall}
            variant="danger"
            style={styles.endButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 48,
    color: COLORS.white,
    fontWeight: "bold",
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  specialty: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 32,
  },
  statusContainer: {
    marginBottom: 48,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  connectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
  },
  countdownText: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: "600",
  },
  endedText: {
    fontSize: 18,
    color: COLORS.error,
    fontWeight: "bold",
  },
  controls: {
    width: "100%",
    maxWidth: 200,
  },
  endButton: {
    width: "100%",
  },
});