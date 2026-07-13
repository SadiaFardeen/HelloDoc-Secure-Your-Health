// components/doctor-card.tsx

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { COLORS, RADIUS } from "../constants/theme";
import { Doctor } from "../data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
}

export default function DoctorCard({
  doctor,
  onPress,
}: DoctorCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(doctor)}
    >
      {/* Doctor image */}
      <Image
        source={{ uri: doctor.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Doctor information */}
      <View style={styles.information}>
        <Text style={styles.name} numberOfLines={1}>
          {doctor.name}
        </Text>

        <Text style={styles.specialization}>
          {doctor.specialization}
        </Text>

        <Text style={styles.qualification} numberOfLines={1}>
          {doctor.qualification}
        </Text>

        <View style={styles.detailsRow}>
          <Text style={styles.rating}>
            ★ {doctor.rating}
          </Text>

          <Text style={styles.experience}>
            {doctor.experience} years
          </Text>
        </View>

        <Text style={styles.availability}>
          ● {doctor.availability}
        </Text>
      </View>

      {/* Right arrow */}
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
  },

  information: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  specialization: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 3,
  },

  qualification: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  rating: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.warning,
    marginRight: 14,
  },

  experience: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  availability: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.success,
    marginTop: 5,
  },

  arrow: {
    fontSize: 28,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
});