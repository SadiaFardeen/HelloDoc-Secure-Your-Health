import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useApp } from "../Context/AppContext";

export default function PrescriptionScreen() {
  const router = useRouter();

  const { appointmentId, patientName } = useLocalSearchParams();

  const { addPrescription } = useApp();

  const [form, setForm] = useState({
    medicine: "",
    dosage: "",
    instructions: "",
    notes: "",
  });

  const [errors, setErrors] = useState({
    medicine: "",
    dosage: "",
    instructions: "",
  });

  const [touched, setTouched] = useState({
    medicine: false,
    dosage: false,
    instructions: false,
  });

  useEffect(() => {
    setErrors({
      medicine:
        touched.medicine && form.medicine.trim() === ""
          ? "Medicine Name Required"
          : "",

      dosage:
        touched.dosage && form.dosage.trim() === ""
          ? "Dosage Required"
          : "",

      instructions:
        touched.instructions &&
        form.instructions.trim() === ""
          ? "Instructions Required"
          : "",
    });
  }, [form, touched]);

  const savePrescription = () => {
    if (
      form.medicine === "" ||
      form.dosage === "" ||
      form.instructions === ""
    ) {
      Alert.alert("Please fill all required fields.");
      return;
    }

    addPrescription({
      id: Date.now().toString(),
      appointmentId: String(appointmentId),
      patientName: String(patientName),
      medicines: [`${form.medicine} (${form.dosage})`],
      notes: `${form.instructions}\n\n${form.notes}`,
    });

    Alert.alert(
      "Success",
      "Prescription Saved Successfully",
      [
        {
          text: "OK",
          onPress: () => router.replace("/prescriptions"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>
        Digital Prescription
      </Text>

      <Text style={styles.patient}>
        Patient: {patientName}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Medicine Name"
        value={form.medicine}
        onChangeText={(text) =>
          setForm({ ...form, medicine: text })
        }
        onBlur={() =>
          setTouched({
            ...touched,
            medicine: true,
          })
        }
      />

      {errors.medicine ? (
        <Text style={styles.error}>
          {errors.medicine}
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Dosage"
        value={form.dosage}
        onChangeText={(text) =>
          setForm({ ...form, dosage: text })
        }
        onBlur={() =>
          setTouched({
            ...touched,
            dosage: true,
          })
        }
      />

      {errors.dosage ? (
        <Text style={styles.error}>
          {errors.dosage}
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={form.instructions}
        onChangeText={(text) =>
          setForm({
            ...form,
            instructions: text,
          })
        }
        onBlur={() =>
          setTouched({
            ...touched,
            instructions: true,
          })
        }
      />

      {errors.instructions ? (
        <Text style={styles.error}>
          {errors.instructions}
        </Text>
      ) : null}

      <TextInput
        style={[styles.input, styles.notesInput]}
        multiline
        placeholder="Notes"
        value={form.notes}
        onChangeText={(text) =>
          setForm({ ...form, notes: text })
        }
      />

      <Text style={styles.counter}>
        {form.notes.length}/200 Characters
      </Text>

      <Pressable
        style={styles.button}
        onPress={savePrescription}
      >
        <Text style={styles.buttonText}>
          Save Prescription
        </Text>
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
    fontWeight: "bold",
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },

  patient: {
    fontSize: 16,
    color: "#0D9488",
    fontWeight: "600",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },

  notesInput: {
    height: 120,
    textAlignVertical: "top",
  },

  error: {
    color: "#EF4444",
    marginBottom: 8,
  },

  counter: {
    textAlign: "right",
    color: "#64748B",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#0D9488",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});