import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useApp } from "../../Context/AppContext";

export default function PatientPrescriptionsScreen() {
  const { prescriptions } = useApp();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Prescriptions</Text>

      <Text style={styles.subtitle}>
        View prescriptions provided by your doctor
      </Text>

      {prescriptions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No Prescriptions Yet
          </Text>

          <Text style={styles.emptyText}>
            Your prescriptions will appear here after your doctor
            creates one.
          </Text>
        </View>
      ) : (
        prescriptions.map((prescription) => (
          <View
            key={prescription.id}
            style={styles.prescriptionCard}
          >
            <Text style={styles.patientName}>
              Patient: {prescription.patientName}
            </Text>

            <Text style={styles.sectionTitle}>
              Medicines
            </Text>

            {prescription.medicines.map(
              (medicine, index) => (
                <Text
                  key={index}
                  style={styles.medicine}
                >
                  • {medicine}
                </Text>
              )
            )}

<Text style={styles.sectionTitle}>
  Doctor's Notes
</Text>

<Text style={styles.notes}>
  {prescription.notes || "No additional notes"}
</Text>

<TouchableOpacity
  style={styles.viewButton}
  onPress={() =>
    router.push({
      pathname: "/patient/prescription-details",
      params: { id: prescription.id },
    })
  }
>
  <Text style={styles.viewButtonText}>View Details</Text>
</TouchableOpacity>
              <Text style={styles.sectionTitle}>Doctor&apos;s Notes</Text>
<Text style={styles.notes}>{prescription.notes}</Text>

<Pressable
  style={styles.viewButton}
  onPress={() =>
    router.push({
      pathname: "/patient/prescription-details",
      params: { id: prescription.id },
    })
  }
>
  <Text style={styles.viewButtonText}>View Details</Text>
</Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#F8FAFC",
  padding: 20,
},
viewButton: {
  backgroundColor: "#2563EB",
  paddingVertical: 10,
  borderRadius: 8,
  marginTop: 15,
},

viewButtonText: {
  color: "#FFFFFF",
  textAlign: "center",
  fontWeight: "700",
  fontSize: 14,
},
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 20, paddingBottom: 40 },


  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    marginBottom: 18,
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 20,
  },

  prescriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },


  patientName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 15,
  },


  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  cardHeaderText: { flex: 1 },

  doctorName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },

  patientName: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  patientEmail: {
    fontSize: 12,
    color: "#0284C7",
    marginTop: 3,
  },

  dateText: {
    fontSize: 11,
    color: "#64748B",
  },


  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D9488",
    marginTop: 10,
    marginBottom: 7,
  },

  medicine: {
    fontSize: 14,
    color: "#334155",
    marginTop: 4,
  },

  notes: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 21,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
  },

  viewButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },

  viewButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
  },

});