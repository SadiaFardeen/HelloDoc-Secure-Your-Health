import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import DoctorCard from "../components/DoctorCard";
import { DOCTORS } from "../Data/mockData";

const categories = [
  "All",
  "Medicine",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
];

export default function BookingScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doctor) => {
      const searchMatch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        selectedCategory === "All" ||
        doctor.specialty === selectedCategory;

      return searchMatch && categoryMatch;
    });
  }, [search, selectedCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>

      <TextInput
        placeholder="Search doctor or specialty..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.categoryActive,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item &&
                  styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DoctorCard
            name={item.name}
            specialty={item.specialty}
            hospital={item.hospital}
            fee={item.fee}
            onPress={() =>
              router.push({
                pathname: "/date",
                params: {
                  doctorId: item.id,
                  doctorName: item.name,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No doctor found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 20,
  },

  search: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 14,
    marginBottom: 15,
  },

  categoryList: {
    marginBottom: 20,
    maxHeight: 45,
  },

  categoryButton: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },

  categoryActive: {
    backgroundColor: "#0D9488",
  },

  categoryText: {
    color: "#334155",
    fontWeight: "600",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  emptyText: {
    marginTop: 40,
    textAlign: "center",
    color: "#64748B",
    fontSize: 16,
  },
});