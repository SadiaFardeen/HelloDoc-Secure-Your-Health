import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function NotificationsScreen() {
  const notifications = [
    {
      id: "1",
      message: "Your prescription has been updated.",
    },
    {
      id: "2",
      message: "Your appointment is scheduled for tomorrow.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {notifications.length === 0 ? (
        <Text>No notifications available</Text>
      ) : (
        notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text>{item.message}</Text>
          </View>
        ))
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});