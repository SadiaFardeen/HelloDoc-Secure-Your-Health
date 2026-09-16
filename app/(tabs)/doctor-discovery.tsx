import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryChip from "../../components/category-chip";
import DoctorCard from "../../components/doctor-card";
import SearchBar from "../../components/search-bar";
import { api } from "../../services/api";

const SPECIALIZATIONS = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Orthopedic",
  "General Physician",
];

export default function DoctorDiscoveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userName = (params.userName as string) || "Patient";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getDoctors();
      if (Array.isArray(data)) {
        setAllDoctors(data);
        filterList(data, searchQuery, selectedSpecialty);
      } else {
        setAllDoctors([]);
        setFilteredDoctors([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const filterList = (docs: any[], query: string, specialty: string) => {
    let result = docs;

    if (specialty && specialty !== "All") {
      result = result.filter((d) => {
        const spec = (d.specialization || d.specialty || "").toLowerCase();
        return spec.includes(specialty.toLowerCase());
      });
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((d) => {
        const name = (d.name || "").toLowerCase();
        const spec = (d.specialization || d.specialty || "").toLowerCase();
        const hosp = (d.hospital || "").toLowerCase();
        const loc = (d.location || "").toLowerCase();
        return name.includes(q) || spec.includes(q) || hosp.includes(q) || loc.includes(q);
      });
    }

    setFilteredDoctors(result);
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  useEffect(() => {
    filterList(allDoctors, searchQuery, selectedSpecialty);
  }, [searchQuery, selectedSpecialty, allDoctors]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeGreeting}>Welcome back,</Text>
          <Text style={styles.headerTitle}>{userName}</Text>
          <Text style={styles.headerSubtitle}>Book an appointment with specialists</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={fetchDoctorData}>
          <Ionicons name="refresh-outline" size={22} color="#0d9488" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search doctor, specialty, location..."
        />
        <TouchableOpacity style={styles.searchActionBtn} onPress={() => filterList(allDoctors, searchQuery, selectedSpecialty)}>
          <Ionicons name="search" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {SPECIALIZATIONS.map((spec) => (
            <CategoryChip
              key={spec}
              label={spec}
              selected={selectedSpecialty === spec}
              onPress={() => setSelectedSpecialty(spec)}
            />
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0d9488" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchDoctorData}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.doctorList}
          contentContainerStyle={styles.doctorListContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.resultsCount}>
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} available
          </Text>

          {filteredDoctors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No doctors found</Text>
              <Text style={styles.emptySubtitle}>
                No specialist available under "{selectedSpecialty}". Try selecting "All".
              </Text>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedSpecialty("All");
                  setSearchQuery("");
                }}
              >
                <Text style={styles.resetBtnText}>View All Doctors</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredDoctors.map((doctor: any) => (
              <DoctorCard
                key={doctor.id?.toString() || Math.random().toString()}
                doctor={doctor}
                id={doctor.id}
                name={doctor.name}
                specialty={doctor.specialization || doctor.specialty}
                rating={Number(doctor.rating) || 4.9}
                hospital={`${doctor.hospital || "Medical Center"}, ${doctor.location || "Dhaka"}`}
                fee={`৳${doctor.fee || "500"}`}
                imageUrl={doctor.image_url}
                onPress={() =>
                  router.push({
                    pathname: `/doctor/${doctor.id}`,
                    params: { currentPatientName: userName },
                  })
                }
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  welcomeGreeting: {
    fontSize: 13,
    color: "#0d9488",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 10,
  },
  searchActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0d9488',
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesSection: {
    marginTop: 14,
    height: 44,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  doctorList: {
    flex: 1,
    marginTop: 8,
  },
  doctorListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  resultsCount: {
    fontSize: 13,
    color: '#64748b',
    marginVertical: 10,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 8,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#0d9488',
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#ffffff',
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#1e293b',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  resetBtn: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0d9488',
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});