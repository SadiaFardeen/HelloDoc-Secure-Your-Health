import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Appointment,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../../services/member2.api";

export default function DoctorDashboardScreen() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setError(null);
      const data = await getDoctorAppointments();
      setAppointments(data);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.error ||
          "Unable to load appointments. Make sure backend server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingId(id);
      const updated = await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: updated.status } : item))
      );
      Alert.alert(
        "Status Updated",
        `Appointment has been marked as ${newStatus}.`
      );
    } catch (err: any) {
      Alert.alert(
        "Update Failed",
        err.response?.data?.error || "Could not update appointment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((item) => {
    if (activeFilter === "all") return true;
    return item.status?.toLowerCase() === activeFilter;
  });

  const totalCount = appointments.length;
  const pendingCount = appointments.filter(
    (a) => a.status?.toLowerCase() === "pending"
  ).length;
  const acceptedCount = appointments.filter(
    (a) => a.status?.toLowerCase() === "accepted"
  ).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Portal</Text>
        <Text style={styles.subtitle}>
          Manage your schedule, appointment requests, and prescriptions
        </Text>
      </View>

      <TouchableOpacity
        style={styles.prescriptionNavBtn}
        onPress={() => router.push("/doctorDashboard/prescription")}
        accessibilityRole="button"
        accessibilityLabel="Go to Prescription Management Screen"
      >
        <Text style={styles.prescriptionNavText}>
          📝 Open Prescription Management →
        </Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: "#2563eb" }]}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#f59e0b" }]}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#10b981" }]}>
          <Text style={styles.statNumber}>{acceptedCount}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.sectionHeader}>Appointment Requests</Text>
        <View style={styles.filterBar}>
          {(["all", "pending", "accepted", "rejected"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                activeFilter === tab && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeFilter === tab }}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === tab && styles.filterTabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.stateText}>Loading appointments...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={fetchAppointments}
            accessibilityRole="button"
            accessibilityLabel="Retry loading appointments"
          >
            <Text style={styles.retryBtnText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && filteredAppointments.length === 0 && (
        <View style={styles.centerBox}>
          <Text style={styles.emptyTitle}>No Appointments Found</Text>
          <Text style={styles.emptySubtitle}>
            There are no {activeFilter !== "all" ? activeFilter : ""} appointments at this time.
          </Text>
        </View>
      )}

      {!loading &&
        !error &&
        filteredAppointments.map((item) => {
          const isUpdating = updatingId === item.id;
          const patientName = item.patient_name || item.patientName || "Patient";
          const status = item.status?.toLowerCase() || "pending";

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.patientName}>{patientName}</Text>
                  <Text style={styles.dateTime}>
                    📅 {item.date}  ⏰ {item.time}
                  </Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    status === "accepted" && styles.badgeAccepted,
                    status === "rejected" && styles.badgeRejected,
                    status === "pending" && styles.badgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      status === "accepted" && styles.badgeTextAccepted,
                      status === "rejected" && styles.badgeTextRejected,
                      status === "pending" && styles.badgeTextPending,
                    ]}
                  >
                    {status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.problemLabel}>Reason for visit:</Text>
              <Text style={styles.problemText}>{item.problem}</Text>

              {status === "pending" && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => handleStatusUpdate(item.id, "accepted")}
                    disabled={isUpdating}
                    accessibilityRole="button"
                    accessibilityLabel={`Accept appointment for ${patientName}`}
                  >
                    {isUpdating ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.btnTextWhite}>Accept Request</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleStatusUpdate(item.id, "rejected")}
                    disabled={isUpdating}
                    accessibilityRole="button"
                    accessibilityLabel={`Reject appointment for ${patientName}`}
                  >
                    <Text style={styles.rejectBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}

              {status === "accepted" && (
                <TouchableOpacity
                  style={styles.prescribeBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/doctorDashboard/prescription",
                      params: {
                        appointmentId: item.id,
                        patientName: patientName,
                      },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Create prescription for ${patientName}`}
                >
                  <Text style={styles.prescribeBtnText}>
                    + Write Prescription for Patient
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  prescriptionNavBtn: {
    backgroundColor: "#e0e7ff",
    borderWidth: 1,
    borderColor: "#c7d2fe",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  prescriptionNavText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3730a3",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  filterSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  filterBar: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: "#ffffff",
    elevation: 1,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  filterTabTextActive: {
    color: "#2563eb",
    fontWeight: "700",
  },
  centerBox: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stateText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  retryBtn: {
    backgroundColor: "#b91c1c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  dateTime: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: "#fef3c7",
  },
  badgeAccepted: {
    backgroundColor: "#d1fae5",
  },
  badgeRejected: {
    backgroundColor: "#fee2e2",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTextPending: {
    color: "#b45309",
  },
  badgeTextAccepted: {
    color: "#047857",
  },
  badgeTextRejected: {
    color: "#b91c1c",
  },
  problemLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 4,
  },
  problemText: {
    fontSize: 14,
    color: "#334155",
    marginTop: 2,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: {
    backgroundColor: "#10b981",
  },
  rejectBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  btnTextWhite: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  rejectBtnText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 13,
  },
  prescribeBtn: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  prescribeBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
});