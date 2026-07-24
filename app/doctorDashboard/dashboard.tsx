import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PATIENTS = [
  { id: 'pat1', name: 'Sadia Mahmood', email: 'sadia@gmail.com' },
  { id: 'pat2', name: 'Rahim Uddin', email: 'rahim@gmail.com' },
];

export default function DoctorDashboard() {
  const { doctorId = 'doc1', doctorName = 'Dr. Sarah Ahmed' } = useLocalSearchParams<{
    doctorId?: string;
    doctorName?: string;
  }>();
  const router = useRouter();

  const openChatWithPatient = (patientId: string, patientName: string) => {
    
    const roomId = [doctorId, patientId].sort().join('_');

    router.push({
      pathname: '/consultation/chat/[id]',
      params: {
        id: roomId,
        currentUserId: doctorId,
        targetName: patientName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {doctorName} 👋</Text>
        <Text style={styles.subtitle}>Doctor ID: {doctorId}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Patient Consultations</Text>

        <FlatList
          data={PATIENTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.patientCard}>
              <View>
                <Text style={styles.patientName}>{item.name}</Text>
                <Text style={styles.patientEmail}>{item.email}</Text>
              </View>

              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() => openChatWithPatient(item.id, item.name)}
              >
                <Text style={styles.chatBtnText}>Open Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#0D1F4E', padding: 24 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#38BDF8', marginTop: 4 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  patientCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  patientName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  patientEmail: { fontSize: 13, color: '#64748B', marginTop: 2 },
  chatBtn: { backgroundColor: '#0D9488', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  chatBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});