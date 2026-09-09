import { router } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import CategoryChip from "../../components/category-chip";
import DoctorCard from "../../components/doctor-card";
import SearchBar from "../../components/search-bar";

import { COLORS } from "../../constants/theme";

import { Doctor } from "../../data/doctors";
import api from "../../services/api";

export default function HomeScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [searchText, setSearchText] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Load doctors from backend
  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<Doctor[]>("/doctors");

      setDoctors(response.data);
    } catch (err) {
      console.log("Doctor loading error:", err);

      setError(
        "Unable to load doctors. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  // Create categories from doctors received from API
  const doctorCategories = useMemo(() => {
    const categories = doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(categories)),
    ];
  }, [doctors]);

  // Search + category filter
  const filteredDoctors = useMemo(() => {
    const query = searchText
      .trim()
      .toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name
          .toLowerCase()
          .includes(query) ||
        doctor.specialization
          .toLowerCase()
          .includes(query) ||
        doctor.hospital
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        doctor.specialization ===
          selectedCategory;

      return (
        matchesSearch && matchesCategory
      );
    });
  }, [
    doctors,
    searchText,
    selectedCategory,
  ]);

  const handleDoctorPress = (
    doctor: Doctor
  ) => {
    router.push({
      pathname: "../doctor/[id]",
      params: {
        id: doctor.id,
      },
    });
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.stateText}>
            Loading doctors...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorTitle}>
            Something went wrong
          </Text>

          <Text style={styles.stateText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadDoctors}
            accessibilityRole="button"
            accessibilityLabel="Retry loading doctors"
            accessibilityHint="Attempts to load the doctor list again"
          >
            <Text
              style={styles.retryButtonText}
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}

      <View style={styles.header}>
        <Text
          style={styles.backText}
          onPress={() =>
            router.replace("/(tabs)")
          }
        >
          ‹ Back to Dashboard
        </Text>

        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.brandName}>
              HelloDoc
            </Text>

            <Text style={styles.tagline}>
              We secure your health
            </Text>
          </View>

          <View
            style={styles.profileCircle}
          >
            <Text
              style={styles.profileText}
            >
              P
            </Text>
          </View>
        </View>

        <Text
          style={styles.welcomeText}
        >
          Find the right doctor
        </Text>

        <Text
          style={styles.welcomeSubtext}
        >
          Search trusted specialists and
          start a secure consultation.
        </Text>
      </View>

      {/* Search Bar */}

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search name, speciality or hospital"
      />

      {/* Category Filter */}

      <View
        style={styles.categorySection}
      >
        <FlatList
          data={doctorCategories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.categoryList
          }
          renderItem={({ item }) => (
            <CategoryChip
              title={item}
              selected={
                selectedCategory === item
              }
              onPress={() =>
                setSelectedCategory(item)
              }
            />
          )}
        />
      </View>

      {/* Result Count */}

      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredDoctors.length} doctors
          found
        </Text>

        {selectedCategory !== "All" ? (
          <Text
            style={styles.categoryName}
          >
            {selectedCategory}
          </Text>
        ) : null}
      </View>

      {/* Doctor List */}

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={handleDoctorPress}
          />
        )}
        contentContainerStyle={
          styles.doctorList
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text
              style={styles.emptyTitle}
            >
              No doctors found
            </Text>

            <Text
              style={styles.emptyText}
            >
              Try another name,
              specialization or category.
            </Text>
          </View>
        }
      />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CCFBF1",
    marginBottom: 14,
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  tagline: {
    fontSize: 11,
    color: "#99F6E4",
    marginTop: 2,
  },

  profileCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  welcomeText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 28,
  },

  welcomeSubtext: {
    fontSize: 13,
    color: "#D9F9F4",
    marginTop: 7,
  },

  categorySection: {
    backgroundColor: COLORS.surface,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  categoryList: {
    paddingHorizontal: 16,
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  resultText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  categoryName: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  doctorList: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },

  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  stateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 12,
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#DC2626",
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});