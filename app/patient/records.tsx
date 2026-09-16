import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

export default function PatientRecordsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const patientName = (params.patientName as string) || 'Patient';

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await api.getPrescriptions();
        if (Array.isArray(data)) {
          setRecords(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>Medical Records & Prescriptions</Text>
          <Text style={styles.subtitle}>Doctor notes and Rx for {patientName}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#0d9488" style={{ marginTop: 40 }} />
        ) : records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={54} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No medical records found</Text>
            <Text style={styles.emptySubtitle}>Prescriptions issued by your consulting doctors will appear here.</Text>
          </View>
        ) : (
          records.map((item) => (
            <View key={item.id} style={styles.recordCard}>
              <View style={styles.cardTop}>
                <View style={styles.iconBox}>
                  <Ionicons name="document-text" size={22} color="#0d9488" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.doctorName}>{item.doctor_name}</Text>
                  <Text style={styles.dateText}>📅 Issued on: {item.date}</Text>
                </View>
              </View>

              <View style={styles.diagBox}>
                <Text style={styles.diagLabel}>Diagnosis / Condition:</Text>
                <Text style={styles.diagText}>{item.diagnosis || 'General Medical Evaluation'}</Text>
              </View>

              <View style={styles.medBox}>
                <Text style={styles.medTitle}>Prescribed Medicines & Dosage:</Text>
                <Text style={styles.medText}>{item.medicines}</Text>
              </View>

              {item.instructions ? (
                <View style={styles.adviceBox}>
                  <Text style={styles.adviceText}>💡 Doctor Advice: {item.instructions}</Text>
                </View>
              ) : null}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b' },
  content: { padding: 18, paddingBottom: 40 },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccfbf1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  dateText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  diagBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  diagLabel: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  diagText: { fontSize: 13, fontWeight: '600', color: '#0f766e', marginTop: 2 },
  medBox: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 10,
  },
  medTitle: { fontSize: 12, fontWeight: 'bold', color: '#166534', marginBottom: 4 },
  medText: { fontSize: 13, color: '#14532d', lineHeight: 18 },
  adviceBox: {
    backgroundColor: '#fef3c7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  adviceText: { fontSize: 12, color: '#92400e', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
});