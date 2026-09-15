import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  INITIAL_MEDICAL_HISTORY,
  MedicalHistory,
} from "../../data/medicalHistory";

export default function MedicalHistoryScreen() {
  const [search, setSearch] = useState("");

  const filteredHistory = useMemo(() => {
    return INITIAL_MEDICAL_HISTORY.filter((item) =>
      item.diagnosis.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Medical History</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search diagnosis..."
          value={search}
          onChangeText={setSearch}
        />

        {filteredHistory.length === 0 ? (
          <Text style={styles.emptyText}>No records found</Text>
        ) : (
          filteredHistory.map((record: MedicalHistory) => (
            <View key={record.id} style={styles.card}>
              <Text style={styles.label}>
                Diagnosis: {record.diagnosis}
              </Text>

              <Text>
                Prescription: {record.prescription}
              </Text>

              <Text>
                Visit Date: {record.visitDate}
              </Text>

              <Pressable
                style={styles.detailsButton}
                onPress={() =>
                  router.push({
                    pathname: "/patient/medical-history-details",
                    params: {
                      id: record.id.toString(),
                    },
                  })
                }
              >
                <Text style={styles.detailsButtonText}>
                  View Details
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    padding: 20,
  },

  backButton: {
    marginBottom: 15,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  label: {
    fontWeight: "700",
    marginBottom: 4,
  },

  detailsButton: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  detailsButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});