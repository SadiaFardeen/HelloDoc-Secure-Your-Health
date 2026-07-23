import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const TODAY_APPOINTMENTS = [
  { id: '1', patientName: 'Sabbir Ahmed', time: '10:00 AM', type: 'Consultation' },
  { id: '2', patientName: 'Ayesha Rahman', time: '11:30 AM', type: 'Follow-up' },
];

export default function DoctorDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, Dr. User 👨‍⚕️</Text>
      <Text style={styles.subText}>You have 2 appointments today</Text>

      <Text style={styles.sectionHeader}>Todays Queue</Text>

      <FlatList
        data={TODAY_APPOINTMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View>
              <Text style={styles.patientName}>{item.patientName}</Text>
              <Text style={styles.timeText}>{item.time} • {item.type}</Text>
            </View>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subText: { color: '#666', marginBottom: 20 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
  patientName: { fontSize: 16, fontWeight: 'bold' },
  timeText: { color: '#666', marginTop: 4 },
  viewBtn: { backgroundColor: '#28a745', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  viewBtnText: { color: '#fff', fontWeight: 'bold' },
  logoutBtn: { marginTop: 20, padding: 15, backgroundColor: '#dc3545', borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});