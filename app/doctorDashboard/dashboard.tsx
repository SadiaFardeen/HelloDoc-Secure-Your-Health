import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DOCTORS } from '../../data/doctor';

export default function DoctorDashboard() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const doctorEmail = (params.doctorEmail as string) || 'doc1@hello.com';
  const docIndex = parseInt(doctorEmail.replace('doc', '').replace('@hello.com', '')) - 1;
  const currentDoctor = DOCTORS[isNaN(docIndex) || docIndex < 0 ? 0 : docIndex % DOCTORS.length];
  const doctorName = (params.doctorName as string) || currentDoctor?.name || 'Dr. Doctor';

  const handleLogout = () => {
    router.replace('/' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome Back, 👋</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialty}>{currentDoctor?.specialty || 'General Physician'}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => router.push('/doctorDashboard/prescription' as any)}
          >
            <Text style={styles.btnText}>📝 Create / Update Prescription</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

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
    backgroundColor: '#0f766e', 
    padding: 24, 
    borderRadius: 16, 
    marginBottom: 20 
  },
  greeting: { 
    color: '#99f6e4', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  doctorName: { 
    color: '#ffffff', 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  specialty: { 
    color: '#ccfbf1', 
    fontSize: 14, 
    marginTop: 6, 
    fontWeight: '500' 
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
  btnText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  logoutBtn: { 
    backgroundColor: '#ef4444', 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  logoutBtnText: { 
    color: '#ffffff', 
    fontWeight: 'bold' 
  }
});