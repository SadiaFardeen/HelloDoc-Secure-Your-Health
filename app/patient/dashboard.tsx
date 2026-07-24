import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DOCTORS = [
  { id: 'doc1', name: 'Dr. Sarah Ahmed', specialty: 'Cardiology' },
  { id: 'doc2', name: 'Dr. Tanvir Hassan', specialty: 'Dermatology' },
];

export default function PatientDashboard() {
  const { patientId = 'pat2', patientName = 'Rahim Uddin' } = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();
  const router = useRouter();

  const openChatWithDoctor = (doctorId: string, doctorName: string) => {

    const roomId = [doctorId, patientId].sort().join('_');

    router.push({
      pathname: '/consultation/chat/[id]',
      params: {
        id: roomId,
        currentUserId: patientId,
        targetName: doctorName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello, {patientName} 👋</Text>
        <Text style={styles.subtitle}>Patient ID: {patientId}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Available Doctors</Text>

        <FlatList
          data={DOCTORS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.doctorCard}>
              <View>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
              </View>

              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() => openChatWithDoctor(item.id, item.name)}
              >
                <Text style={styles.chatBtnText}>Message</Text>
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
  subtitle: { fontSize: 14, color: '#0D9488', marginTop: 4 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  doctorName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  specialty: { fontSize: 13, color: '#64748B', marginTop: 2 },
  chatBtn: { backgroundColor: '#0284C7', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  chatBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});