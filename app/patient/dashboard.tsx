import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function PatientDashboard() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const patientEmail = (params.patientEmail as string) || 'pat1@hello.com';
  const patNum = patientEmail.replace('pat', '').replace('@hello.com', '');
  const patientName = params.patientName || `Patient ${patNum || '1'}`;

  const handleLogout = () => {
    try {
      if (router.canDismiss()) {
        router.dismissAll();
      }
    } catch (e) {
   
    }
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, 🩺</Text>
          <Text style={styles.patientName}>{patientName}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Appointments 📅</Text>
          <Text style={styles.cardSub}>No upcoming appointments today.</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed
            ]}
            onPress={() => router.push('/patient/doctors' as any)}
          >
            <Text style={styles.btnText}>🔍 Find & Book a Doctor</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.btnPressed
            ]}
            onPress={() => router.push('/patient/prescriptions' as any)}
          >
            <Text style={styles.btnText}>📄 View My Prescriptions</Text>
          </Pressable>
        </View>

        {/* Fixed Logout Button with Pressable */}
        <Pressable 
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && styles.logoutPressed
          ]} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  content: { 
    padding: 20 
  },
  header: { 
    backgroundColor: '#0284c7', 
    padding: 24, 
    borderRadius: 16, 
    marginBottom: 20 
  },
  greeting: { 
    color: '#bae6fd', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  patientName: { 
    color: '#ffffff', 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 18, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  cardSub: { 
    fontSize: 13, 
    color: '#64748b', 
    marginTop: 6 
  },
  actionContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: { 
    backgroundColor: '#0f766e', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  secondaryBtn: { 
    backgroundColor: '#0284c7', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  btnText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  btnPressed: {
    opacity: 0.8
  },
  logoutBtn: { 
    backgroundColor: '#ef4444', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10 
  },
  logoutPressed: {
    backgroundColor: '#dc2626',
    opacity: 0.9
  },
  logoutBtnText: { 
    color: '#ffffff', 
    fontWeight: 'bold',
    fontSize: 16
  }
});