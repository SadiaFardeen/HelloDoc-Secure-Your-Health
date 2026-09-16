import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.getAppointments();
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id: number) => {
    try {
      setCancellingId(id);
      await api.cancelAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Appointments</Text>
          <Text style={styles.subtitle}>Track and manage your upcoming consultations</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadAppointments}>
          <Ionicons name="refresh" size={20} color="#0d9488" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#0d9488" style={{ marginTop: 40 }} />
        ) : appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={54} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No scheduled appointments</Text>
            <Text style={styles.emptySubtitle}>You have no pending visits. Explore our specialist doctors and book a consultation.</Text>
            <TouchableOpacity
              style={styles.findDoctorBtn}
              onPress={() => router.push('/(tabs)/doctor-discovery')}
            >
              <Text style={styles.findDoctorBtnText}>Find Doctors</Text>
            </TouchableOpacity>
          </View>
        ) : (
          appointments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.docAvatarMini}>
                  <Ionicons name="medical" size={24} color="#0d9488" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.docName}>{item.doctor_name}</Text>
                  <Text style={styles.specialty}>{item.specialty || 'General Specialist'}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status || 'Upcoming'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardMeta}>
                <View style={styles.metaCol}>
                  <Ionicons name="calendar-outline" size={14} color="#64748b" />
                  <Text style={styles.metaVal}>{item.date}</Text>
                </View>
                <View style={styles.metaCol}>
                  <Ionicons name="time-outline" size={14} color="#64748b" />
                  <Text style={styles.metaVal}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.chatActionBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/consultation/chat/[id]',
                      params: { id: item.doctor_id || 1, userName: item.patient_name, userRole: 'patient' },
                    })
                  }
                >
                  <Ionicons name="chatbubbles-outline" size={16} color="#0d9488" />
                  <Text style={styles.chatActionText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelBtn, cancellingId === item.id && { opacity: 0.6 }]}
                  onPress={() => handleCancel(item.id)}
                  disabled={cancellingId === item.id}
                >
                  <Text style={styles.cancelBtnText}>
                    {cancellingId === item.id ? 'Cancelling...' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { padding: 18, paddingBottom: 40 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  docAvatarMini: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ccfbf1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  specialty: { fontSize: 13, color: '#0d9488', fontWeight: '500' },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaCol: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaVal: { fontSize: 13, color: '#334155', fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  chatActionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#0d9488',
    paddingVertical: 10,
    borderRadius: 10,
  },
  chatActionText: { color: '#0d9488', fontWeight: '700', fontSize: 13 },
  cancelBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 13 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', marginTop: 14 },
  emptySubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6, paddingHorizontal: 24 },
  findDoctorBtn: {
    marginTop: 18,
    backgroundColor: '#0d9488',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  findDoctorBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});