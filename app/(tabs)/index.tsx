// app/(tabs)/index.tsx

import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import DoctorCard from "../../components/doctor-card";
import SearchBar from "../../components/search-bar";

import { COLORS } from "../../constants/theme";

import {
  Doctor,
  DOCTORS,
} from "../../data/doctors";

export default function HomeScreen() {
  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [searchText, setSearchText] =
    useState("");

  const filteredDoctors = DOCTORS.filter(
    (doctor) => {
      const query = searchText.toLowerCase();

      return (
        doctor.name
          .toLowerCase()
          .includes(query) ||
        doctor.specialization
          .toLowerCase()
          .includes(query)
      );
    }
  );

  const handleDoctorPress = (doctor: Doctor) => {
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
          Choose a doctor for your consultation
        </Text>
      </View>

      {/* Search */}

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by name or specialization"
      />

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
            {selectedDoctor.specialization}
          </Text>
        </View>
      ) : null}

      {/* Doctor List */}

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onPress={handleDoctorPress}
          />
        ))}
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

  list: {
    paddingTop: 16,
    paddingBottom: 30,
  },
});