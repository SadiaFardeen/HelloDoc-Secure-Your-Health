import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PatientDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Hello, Patient 👋</Text>
      <Text style={styles.subText}>How can we help you today?</Text>

      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/patient/doctors')}
        >
          <Text style={styles.cardTitle}>🔍 Find Doctor</Text>
          <Text style={styles.cardDesc}>Search specialists near you</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>📅 Appointments</Text>
          <Text style={styles.cardDesc}>Check scheduled visits</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>📄 Prescriptions</Text>
          <Text style={styles.cardDesc}>View medical records</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subText: { color: '#666', marginBottom: 20 },
  grid: { gap: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardDesc: { color: '#777' },
  logoutBtn: { marginTop: 30, padding: 15, backgroundColor: '#dc3545', borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});