import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/custom-button";
import { COLORS } from "../../constants/theme";
import { Doctor } from "../../data/doctors";
import api from "../../services/api";

export default function DoctorDetailsScreen() {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [doctor, setDoctor] =
    useState<Doctor | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDoctor = useCallback(
    async () => {
      if (!id) {
        setError("Doctor ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<Doctor>(
            `/doctors/${id}`
          );

        setDoctor(response.data);
      } catch (err) {
        console.log(
          "Doctor details error:",
          err
        );

        setDoctor(null);

        setError(
          "Unable to load doctor information."
        );
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  const handleStartConsultation = () => {
    if (!doctor) return;

    router.push({
      pathname: "/consultation/[id]",
      params: {
        id: doctor.id,
      },
    });
  };

  const handleBookAppointment = () => {
    if (!doctor) return;

    router.push({
      pathname: "/(tabs)/booking",
      params: {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty:
          doctor.specialization,
        fee: doctor.fee.toString(),
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.screen}
      >
        <View
          style={
            styles.stateContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text
            style={styles.stateText}
          >
            Loading doctor profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={styles.screen}
      >
        <View
          style={
            styles.stateContainer
          }
        >
          <Text
            style={styles.errorTitle}
          >
            Something went wrong
          </Text>

          <Text
            style={styles.stateText}
          >
            {error}
          </Text>

          <CustomButton
            title="Try Again"
            onPress={loadDoctor}
            style={styles.stateButton}
          />

          <CustomButton
            title="Go Back"
            variant="outline"
            onPress={() =>
              router.back()
            }
            style={styles.stateButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView
        style={styles.screen}
      >
        <View
          style={
            styles.stateContainer
          }
        >
          <Text
            style={styles.notFoundTitle}
          >
            Doctor Not Found
          </Text>

          <Text
            style={styles.stateText}
          >
            The selected doctor
            information is unavailable.
          </Text>

          <CustomButton
            title="Go Back"
            onPress={() =>
              router.back()
            }
            style={styles.stateButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text
          style={styles.backText}
          onPress={() =>
            router.back()
          }
        >
          ‹ Back
        </Text>

        <Text
          style={styles.headerTitle}
        >
          Doctor Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View
          style={styles.profileCard}
        >
          <Image
            source={{
              uri: doctor.imageUrl,
            }}
            style={styles.profileImage}
            resizeMode="cover"
            accessibilityLabel={`Profile photo of ${doctor.name}`}
          />

          <Text style={styles.name}>
            {doctor.name}
          </Text>

          <Text
            style={
              styles.specialization
            }
          >
            {doctor.specialization}
          </Text>

          <Text
            style={
              styles.qualification
            }
          >
            {doctor.qualification}
          </Text>

          <View
            style={styles.detailsRow}
          >
            <Text
              style={styles.rating}
            >
              ★ {doctor.rating}
            </Text>

            <Text
              style={styles.experience}
            >
              {doctor.experience} years
              of experience
            </Text>
          </View>

          <Text
            style={styles.availability}
          >
            ● {doctor.availability}
          </Text>
        </View>

        <View
          style={
            styles.informationCard
          }
        >
          <Text
            style={styles.sectionTitle}
          >
            Workplace
          </Text>

          <Text
            style={
              styles.mainInformation
            }
          >
            {doctor.hospital}
          </Text>

          <Text
            style={
              styles.subInformation
            }
          >
            {doctor.location}
          </Text>
        </View>

        <View
          style={
            styles.informationCard
          }
        >
          <Text
            style={styles.sectionTitle}
          >
            About
          </Text>

          <Text
            style={styles.aboutText}
          >
            {doctor.about}
          </Text>
        </View>

        <View
          style={
            styles.informationCard
          }
        >
          <Text
            style={styles.sectionTitle}
          >
            Languages
          </Text>

          <View
            style={
              styles.languageContainer
            }
          >
            {doctor.languages?.map(
              (language) => (
                <View
                  key={language}
                  style={
                    styles.languageChip
                  }
                >
                  <Text
                    style={
                      styles.languageText
                    }
                  >
                    {language}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        <View style={styles.feeCard}>
          <View>
            <Text
              style={styles.feeLabel}
            >
              Consultation Fee
            </Text>

            <Text
              style={styles.feeAmount}
            >
              ৳{doctor.fee}
            </Text>
          </View>

          <Text
            style={
              styles.consultationType
            }
          >
            Online Consultation
          </Text>
        </View>

        <CustomButton
          title="Start Consultation"
          onPress={
            handleStartConsultation
          }
          style={styles.startButton}
        />

        <CustomButton
          title="Book Appointment"
          variant="outline"
          onPress={
            handleBookAppointment
          }
          style={styles.bookButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  header: {
    backgroundColor:
      COLORS.secondary,
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
    backgroundColor:
      COLORS.surface,
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
    color:
      COLORS.textPrimary,
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
    color:
      COLORS.textSecondary,
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
    color:
      COLORS.textSecondary,
  },

  availability: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,
    marginTop: 10,
  },

  informationCard: {
    backgroundColor:
      COLORS.surface,
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
    color:
      COLORS.textPrimary,
  },

  subInformation: {
    fontSize: 13,
    color:
      COLORS.textSecondary,
    marginTop: 4,
  },

  aboutText: {
    fontSize: 14,
    color:
      COLORS.textSecondary,
    lineHeight: 22,
  },

  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  languageChip: {
    backgroundColor:
      COLORS.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 6,
  },

  languageText: {
    fontSize: 12,
    fontWeight: "600",
    color:
      COLORS.primaryDark,
  },

  feeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    backgroundColor:
      COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 14,
  },

  feeLabel: {
    fontSize: 12,
    color:
      COLORS.textSecondary,
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
    color:
      COLORS.secondary,
  },

  startButton: {
    marginTop: 18,
  },

  bookButton: {
    marginTop: 10,
  },

  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  stateText: {
    fontSize: 14,
    color:
      COLORS.textSecondary,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#DC2626",
    textAlign: "center",
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "700",
    color:
      COLORS.textPrimary,
    textAlign: "center",
  },

  stateButton: {
    marginTop: 14,
    width: 200,
  },
});