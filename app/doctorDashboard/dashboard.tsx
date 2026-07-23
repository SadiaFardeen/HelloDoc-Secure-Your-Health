import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const CURRENT_DOCTOR_ID = '1';

const RECENT_PATIENTS = [
  { id: 'p1', name: 'Rahim Ahmed', issue: 'Fever & Cold', time: '10:30 AM' },
  { id: 'p2', name: 'Karim Ullah', issue: 'Chest Pain Review', time: '11:15 AM' },
];

export default function DoctorDashboard() {
  const router = useRouter();

  const handleOpenChat = (patientName = 'Rahim Ahmed') => {
    router.push(`/consultation/chat/${CURRENT_DOCTOR_ID}?role=doctor&name=${encodeURIComponent(patientName)}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, Doctor 👋</Text>
      <Text style={styles.subText}>Manage your appointments & patient chats</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Appointments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Pending Chats</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Consultation</Text>
        <TouchableOpacity style={styles.chatActionCard} onPress={() => handleOpenChat('Rahim Ahmed')}>
          <View>
            <Text style={styles.chatCardTitle}>💬 Open Consultation Chat</Text>
            <Text style={styles.chatCardSub}>Start or continue chatting with patients</Text>
          </View>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Patient Requests</Text>
        {RECENT_PATIENTS.map((patient) => (
          <View key={patient.id} style={styles.patientCard}>
            <View>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientIssue}>{patient.issue} • {patient.time}</Text>
            </View>
            <TouchableOpacity style={styles.chatBtn} onPress={() => handleOpenChat(patient.name)}>
              <Text style={styles.chatBtnText}>Chat</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginTop: 20, color: '#0f172a' },
  subText: { color: '#64748b', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#0284c7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  statLabel: { fontSize: 12, color: '#e0f2fe', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  chatActionCard: {
    backgroundColor: '#0f766e',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatCardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  chatCardSub: { color: '#ccfbf1', fontSize: 12, marginTop: 4 },
  arrowIcon: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  patientCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  patientName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  patientIssue: { fontSize: 12, color: '#64748b', marginTop: 2 },
  chatBtn: { backgroundColor: '#0284c7', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  chatBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  logoutBtn: { marginVertical: 20, padding: 15, backgroundColor: '#dc3545', borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#ffffff', fontWeight: 'bold' },
});