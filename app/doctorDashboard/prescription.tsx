import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
} from "react-native";
import { useApp } from "../../Context/AppContext";

interface PrescriptionForm {
  patientName: string;
  medicineName: string;
  dosage: string;
  instructions: string;
  notes: string;
}

interface TouchedFields {
  patientName: boolean;
  medicineName: boolean;
  dosage: boolean;
  instructions: boolean;
  notes: boolean;
}

export default function PrescriptionScreen() {
  const { setPrescriptions } = useApp();

  const [form, setForm] =
    useState<PrescriptionForm>({
      patientName: "",
      medicineName: "",
      dosage: "",
      instructions: "",
      notes: "",
    });

  const [touched, setTouched] =
    useState<TouchedFields>({
      patientName: false,
      medicineName: false,
      dosage: false,
      instructions: false,
      notes: false,
    });

  const [errors, setErrors] = useState({
    patientName: "",
    medicineName: "",
    dosage: "",
    instructions: "",
    notes: "",
  });

  const updateField = (
    field: keyof PrescriptionForm,
    value: string
  ) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const handleBlur = (
    field: keyof TouchedFields
  ) => {
    setTouched((previousTouched) => ({
      ...previousTouched,
      [field]: true,
    }));
  };

  useEffect(() => {
    const newErrors = {
      patientName: "",
      medicineName: "",
      dosage: "",
      instructions: "",
      notes: "",
    };

    if (
      touched.patientName &&
      form.patientName.trim() === ""
    ) {
      newErrors.patientName =
        "Patient name is required.";
    }

    if (
      touched.medicineName &&
      form.medicineName.trim() === ""
    ) {
      newErrors.medicineName =
        "Medicine name is required.";
    }

    if (
      touched.dosage &&
      form.dosage.trim() === ""
    ) {
      newErrors.dosage =
        "Dosage is required.";
    }

    if (
      touched.instructions &&
      form.instructions.trim() === ""
    ) {
      newErrors.instructions =
        "Instructions are required.";
    }

    if (form.notes.length > 500) {
      newErrors.notes =
        "Notes cannot exceed 500 characters.";
    }

    setErrors(newErrors);
  }, [form, touched]);

  const isFormValid =
    form.patientName.trim() !== "" &&
    form.medicineName.trim() !== "" &&
    form.dosage.trim() !== "" &&
    form.instructions.trim() !== "" &&
    form.notes.length <= 500;

  const handleSavePrescription = () => {
    setTouched({
      patientName: true,
      medicineName: true,
      dosage: true,
      instructions: true,
      notes: true,
    });

    if (!isFormValid) {
      Alert.alert(
        "Incomplete Prescription",
        "Please complete all required fields."
      );
      return;
    }

    const prescriptionId =
      "p" + Date.now().toString();

    const newPrescription = {
      id: prescriptionId,

      appointmentId: "",

      patientName:
        form.patientName.trim(),

      medicines: [
        `${form.medicineName.trim()} (${form.dosage.trim()})`,
      ],

      notes:
        `${form.instructions.trim()}\n\nNotes: ${
          form.notes.trim() || "No additional notes."
        }`,
    };

    setPrescriptions(
      (previousPrescriptions) => [
        ...previousPrescriptions,
        newPrescription,
      ]
    );

    Alert.alert(
      "Prescription Saved",
      `Prescription for ${form.patientName} has been saved successfully.`,
      [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            ← Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Create Prescription
        </Text>

        <Text style={styles.sectionTitle}>
          Patient Information
        </Text>

        <Text style={styles.label}>
          Patient Name *
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.patientName &&
              styles.errorInput,
          ]}
          placeholder="Enter patient name"
          value={form.patientName}
          onChangeText={(value) =>
            updateField(
              "patientName",
              value
            )
          }
          onBlur={() =>
            handleBlur("patientName")
          }
        />

        {errors.patientName ? (
          <Text style={styles.errorText}>
            {errors.patientName}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>
          Medicine Information
        </Text>

        <Text style={styles.label}>
          Medicine Name *
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.medicineName &&
              styles.errorInput,
          ]}
          placeholder="Enter medicine name"
          value={form.medicineName}
          onChangeText={(value) =>
            updateField(
              "medicineName",
              value
            )
          }
          onBlur={() =>
            handleBlur("medicineName")
          }
        />

        {errors.medicineName ? (
          <Text style={styles.errorText}>
            {errors.medicineName}
          </Text>
        ) : null}

        <Text style={styles.label}>
          Dosage *
        </Text>

        <TextInput
          style={[
            styles.input,
            errors.dosage &&
              styles.errorInput,
          ]}
          placeholder="Example: 1+0+1"
          value={form.dosage}
          onChangeText={(value) =>
            updateField(
              "dosage",
              value
            )
          }
          onBlur={() =>
            handleBlur("dosage")
          }
        />

        {errors.dosage ? (
          <Text style={styles.errorText}>
            {errors.dosage}
          </Text>
        ) : null}

        <Text style={styles.label}>
          Instructions *
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            errors.instructions &&
              styles.errorInput,
          ]}
          placeholder="Example: Take after meals"
          value={form.instructions}
          onChangeText={(value) =>
            updateField(
              "instructions",
              value
            )
          }
          onBlur={() =>
            handleBlur("instructions")
          }
          multiline
          textAlignVertical="top"
        />

        {errors.instructions ? (
          <Text style={styles.errorText}>
            {errors.instructions}
          </Text>
        ) : null}

        <Text style={styles.label}>
          Additional Notes
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.notesInput,
            errors.notes &&
              styles.errorInput,
          ]}
          placeholder="Write additional notes..."
          value={form.notes}
          onChangeText={(value) => {
            if (value.length <= 500) {
              updateField("notes", value);
            }
          }}
          onBlur={() =>
            handleBlur("notes")
          }
          multiline
          maxLength={500}
          textAlignVertical="top"
        />

        <Text style={styles.characterCounter}>
          {form.notes.length}/500 characters
        </Text>

        {errors.notes ? (
          <Text style={styles.errorText}>
            {errors.notes}
          </Text>
        ) : null}

        <Pressable
          style={[
            styles.saveButton,
            !isFormValid &&
              styles.disabledButton,
          ]}
          onPress={handleSavePrescription}
        >
          <Text style={styles.saveButtonText}>
            Save Prescription
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    padding: 20,
    paddingBottom: 50,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 10,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 7,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
  },

  multilineInput: {
    minHeight: 90,
  },

  notesInput: {
    minHeight: 120,
  },

  errorInput: {
    borderColor: "#EF4444",
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 5,
  },

  characterCounter: {
    textAlign: "right",
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },

  saveButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },

  disabledButton: {
    backgroundColor: "#94A3B8",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});