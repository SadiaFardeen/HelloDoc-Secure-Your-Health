import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL = "http://192.168.0.120:5000";

export default function ProfileSettingsScreen() {
  const [name, setName] = useState("Mahmuda");
  const [email, setEmail] = useState("mahmuda@gmail.com");
  const [phone, setPhone] = useState("01711111111");
  const [age, setAge] = useState("22");
  const [bloodGroup, setBloodGroup] = useState("A+");

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/users/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          age,
          bloodGroup,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          "Profile updated successfully"
        );

        setIsEditing(false);

        console.log("Updated User:", data);
      } else {
        Alert.alert(
          "Error",
          data.error || "Failed to update profile"
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Cannot connect to backend server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>
        Profile Settings
      </Text>

      <View style={styles.form}>
        <Text>Name</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.disabledInput,
          ]}
          value={name}
          onChangeText={setName}
          editable={isEditing}
        />

        <Text>Email</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.disabledInput,
          ]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={isEditing}
        />

        <Text>Phone</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.disabledInput,
          ]}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={isEditing}
        />

        <Text>Age</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.disabledInput,
          ]}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          editable={isEditing}
        />

        <Text>Blood Group</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.disabledInput,
          ]}
          value={bloodGroup}
          onChangeText={setBloodGroup}
          placeholder="A+, B+, O+, AB+"
          editable={isEditing}
        />

        {!isEditing ? (
          <Pressable
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>
              Edit Profile
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Saving..."
                : "Save Profile"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    marginBottom: 20,
  },

  form: {
    gap: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },

  editButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});