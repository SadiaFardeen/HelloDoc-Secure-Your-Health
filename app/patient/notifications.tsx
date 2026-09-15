import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const notifications = [
    {
      id: "1",
      title: "Prescription Updated",
      message: "Dr. Sarah has updated your prescription.",
    },
    {
      id: "2",
      title: "Appointment Reminder",
      message: "Your appointment is scheduled for tomorrow at 10:00 AM.",
    },
    {
      id: "3",
      title: "Doctor Message",
      message: "Dr. Ahmed sent you a consultation message.",
    },
    {
      id: "4",
      title: "Booking Confirmed",
      message: "Your appointment booking was confirmed successfully.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Notifications</Text>

        {notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No notifications available
            </Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.notificationTitle}>
                {item.title}
              </Text>

              <Text style={styles.notificationMessage}>
                {item.message}
              </Text>
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
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  backButton: {
    marginBottom: 15,
  },

  backText: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "700",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  notificationMessage: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 15,
  },
});