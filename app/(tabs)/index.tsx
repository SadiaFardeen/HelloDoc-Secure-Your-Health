import { router } from "expo-router";
import { useState } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

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

      return matchesSearch && matchesCategory;
    }
  );

  const handleDoctorPress = (
    doctor: Doctor
  ) => {
    router.push({
      pathname: "/doctor/[id]",
      params: {
        id: doctor.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
  <View style={styles.headerTopRow}>
    <View>
      <Text style={styles.brandName}>
        HelloDoc
      </Text>

      <Text style={styles.tagline}>
        We secure your health
      </Text>
    </View>

    <View style={styles.profileCircle}>
      <Text style={styles.profileText}>
        P
      </Text>
    </View>
  </View>

  <Text style={styles.welcomeText}>
    Find the right doctor
  </Text>

  <Text style={styles.welcomeSubtext}>
    Search trusted specialists and start a secure
    consultation.
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
        showsVerticalScrollIndicator={false}
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