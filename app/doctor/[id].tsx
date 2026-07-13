import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import CustomButton from "../../components/custom-button";
import { COLORS } from "../../constants/theme";
import { DOCTORS } from "../../data/doctors";

export default function DoctorDetailsScreen() {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const doctor = DOCTORS.find(
    (item) => item.id === id
  );

  if (!doctor) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Doctor Details
          </Text>
        </View>

        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>
            Doctor not found
          </Text>

          <Text style={styles.notFoundText}>
            The selected doctor information is unavailable.
          </Text>

          <CustomButton
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleStartConsultation = () => {
    router.push({
      pathname: "/consultation/[id]",
      params: {
        id: doctor.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text
          style={styles.backText}
          onPress={() => router.back()}
        >
          ‹ Back
        </Text>

        <Text style={styles.headerTitle}>
          Doctor Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image
            source={{ uri: doctor.imageUrl }}
            style={styles.profileImage}
            resizeMode="cover"
          />

          <Text style={styles.name}>
            {doctor.name}
          </Text>

          <Text style={styles.specialization}>
            {doctor.specialization}
          </Text>

          <Text style={styles.qualification}>
            {doctor.qualification}
          </Text>

          <View style={styles.detailsRow}>
            <Text style={styles.rating}>
              ★ {doctor.rating}
            </Text>

            <Text style={styles.experience}>
              {doctor.experience} years of experience
            </Text>
          </View>

          <Text style={styles.availability}>
            ● {doctor.availability}
          </Text>
        </View>

        <View style={styles.informationCard}>
          <Text style={styles.sectionTitle}>
            Workplace
          </Text>

          <Text style={styles.mainInformation}>
            {doctor.hospital}
          </Text>

          <Text style={styles.subInformation}>
            {doctor.location}
          </Text>
        </View>

        <View style={styles.informationCard}>
          <Text style={styles.sectionTitle}>
            About
          </Text>

          <Text style={styles.aboutText}>
            {doctor.about}
          </Text>
        </View>

        <View style={styles.informationCard}>
          <Text style={styles.sectionTitle}>
            Languages
          </Text>

          <View style={styles.languageContainer}>
            {doctor.languages.map((language) => (
              <View
                key={language}
                style={styles.languageChip}
              >
                <Text style={styles.languageText}>
                  {language}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.feeCard}>
          <View>
            <Text style={styles.feeLabel}>
              Consultation Fee
            </Text>

            <Text style={styles.feeAmount}>
              ৳{doctor.fee}
            </Text>
          </View>

          <Text style={styles.consultationType}>
            Online Consultation
          </Text>
        </View>

        <CustomButton
          title="Start Consultation"
          onPress={handleStartConsultation}
          style={styles.startButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CCFBF1",
    marginBottom: 7,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  specialization: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 5,
  },

  qualification: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  detailsRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  rating: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.warning,
    marginRight: 14,
  },

  experience: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  availability: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,
    marginTop: 10,
  },

  informationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  mainInformation: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  subInformation: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  languageChip: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 6,
  },

  languageText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  feeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 14,
  },

  feeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  feeAmount: {
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 2,
  },

  consultationType: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
  },

  startButton: {
    marginTop: 18,
  },

  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  notFoundText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },

  backButton: {
    marginTop: 20,
    width: 180,
  },
});