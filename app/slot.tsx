import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const morningSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
];

const afternoonSlots = [
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

export default function SlotScreen() {
  const router = useRouter();

  const { doctorId, doctorName, date } = useLocalSearchParams();

  const [selectedSlot, setSelectedSlot] = useState("");

  const renderSlot = ({ item }: { item: string }) => (
    <Pressable
      style={[
        styles.slot,
        selectedSlot === item && styles.selectedSlot,
      ]}
      onPress={() => setSelectedSlot(item)}
    >
      <Text
        style={[
          styles.slotText,
          selectedSlot === item && styles.selectedText,
        ]}
      >
        {item}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Select Time Slot</Text>

      <Text style={styles.info}>Doctor: {doctorName}</Text>
      <Text style={styles.info}>Date: {date}</Text>

      <Text style={styles.section}>Morning</Text>

      <FlatList
        data={morningSlots}
        renderItem={renderSlot}
        keyExtractor={(item) => item}
        scrollEnabled={false}
      />

      <Text style={styles.section}>Afternoon</Text>

      <FlatList
        data={afternoonSlots}
        renderItem={renderSlot}
        keyExtractor={(item) => item}
        scrollEnabled={false}
      />

      <Pressable
        style={[
          styles.button,
          !selectedSlot && { opacity: 0.5 },
        ]}
        disabled={!selectedSlot}
        onPress={() =>
          router.push({
            pathname: "/confirmation",
            params: {
              doctorId,
              doctorName,
              date,
              time: selectedSlot,
            },
          })
        }
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  backButton: {
    width: 90,
    backgroundColor: "#E2F7F5",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  backText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "bold",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0F172A",
  },

  info: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 5,
  },

  section: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D9488",
  },

  slot: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  selectedSlot: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },

  slotText: {
    fontSize: 16,
    textAlign: "center",
  },

  selectedText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#0D9488",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});