import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CategoryChip from "../../components/category-chip";
import DoctorCard from "../../components/doctor-card";
import SearchBar from "../../components/search-bar";

import { COLORS } from "../../constants/theme";

import {
  Doctor,
  DOCTOR_CATEGORIES,
  DOCTORS,
} from "../../data/doctors";

export default function HomeScreen() {
  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [searchText, setSearchText] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const filteredDoctors = DOCTORS.filter(
    (doctor) => {
      const query = searchText
        .trim()
        .toLowerCase();

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
    }
  );

  const handleDoctorPress = (
    doctor: Doctor
  ) => {
    setSelectedDoctor(doctor);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Find a Doctor
        </Text>

        <Text style={styles.subtitle}>
          Choose a doctor for your
          consultation
        </Text>
      </View>

      {/* Search Bar */}

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search name, speciality or hospital"
      />

      {/* Category Filter */}

      <View style={styles.categorySection}>
        <FlatList
          data={DOCTOR_CATEGORIES}
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

      {/* Selected Doctor */}

      {selectedDoctor ? (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>
            Selected Doctor
          </Text>

          <Text style={styles.selectedName}>
            {selectedDoctor.name}
          </Text>

          <Text
            style={
              styles.selectedSpecialization
            }
          >
            {
              selectedDoctor.specialization
            }
          </Text>
        </View>
      ) : null}

      {/* Result Count */}

      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredDoctors.length} doctors
          found
        </Text>

        {selectedCategory !== "All" ? (
          <Text style={styles.categoryName}>
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
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              No doctors found
            </Text>

            <Text style={styles.emptyText}>
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
    paddingVertical: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 13,
    color: "#CCFBF1",
    marginTop: 4,
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

  selectedBox: {
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  selectedLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primaryDark,
    textTransform: "uppercase",
  },

  selectedName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  selectedSpecialization: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
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
});