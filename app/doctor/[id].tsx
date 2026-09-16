import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
  '07:30 PM',
];

const DAYS_AHEAD = 5;

export default function DoctorDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const doctorId = params.id as string;
  const currentPatientName = (params.currentPatientName as string) || 'Patient';

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking states
  const [dateList, setDateList] = useState<{ label: string; dateStr: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    // Generate next 5 days
    const dates = [];
    const today = new Date();
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ label, dateStr });
    }
    setDateList(dates);
    setSelectedDate(dates[0].dateStr);
    setSelectedTime(TIME_SLOTS[0]);

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const data = await api.getDoctorById(doctorId);
        setDoctor(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchDoctor();
  }, [doctorId]);

  const handleBookAppointment = async () => {
    try {
      setBookingLoading(true);
      await api.bookAppointment({
        patient_id: 'P-101',
        patient_name: currentPatientName,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        specialty: doctor.specialization,
        date: selectedDate,
        time: selectedTime,
      });
      setConfirmModalVisible(false);
      setSuccessModalVisible(true);
    } catch (err: any) {
      alert(err.message || 'Could not complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0d9488" />
      </SafeAreaView>
    );
  }

  if (error || !doctor) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error || 'Doctor not found'}</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.back()}>
          <Text style={styles.backHomeBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Doctor Profile</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            router.push({
              pathname: '/consultation/chat/[id]',
              params: { id: doctor.id, userName: currentPatientName, userRole: 'patient' },
            })
          }
        >
          <Ionicons name="chatbubbles-outline" size={22} color="#0d9488" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeaderCard}>
          {doctor.image_url ? (
            <Image source={{ uri: doctor.image_url }} style={styles.doctorImg} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{doctor.name ? doctor.name.replace(/^Dr\.\s*/i, '').charAt(0) : 'D'}</Text>
            </View>
          )}

          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialization}</Text>
          <Text style={styles.qualification}>{doctor.qualification || 'MBBS, Specialist'}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="star" size={18} color="#f59e0b" />
              <Text style={styles.statVal}>{doctor.rating || '4.9'}</Text>
              <Text style={styles.statSub}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="briefcase-outline" size={18} color="#0d9488" />
              <Text style={styles.statVal}>{doctor.experience || 5} yrs</Text>
              <Text style={styles.statSub}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="cash-outline" size={18} color="#10b981" />
              <Text style={styles.statVal}>৳{doctor.fee || 500}</Text>
              <Text style={styles.statSub}>Fee</Text>
            </View>
          </View>
        </View>

        {/* Chamber & Hospital info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Hospital & Chamber</Text>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color="#0d9488" />
            <Text style={styles.infoText}>{doctor.hospital || 'Dhaka Medical Center'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#ef4444" />
            <Text style={styles.infoText}>{doctor.location || 'Dhaka, Bangladesh'}</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>About Specialist</Text>
          <Text style={styles.aboutBody}>
            {doctor.about ||
              `${doctor.name} is a high-profile consultant offering clinical treatments, diagnostic screenings, and patient-centered healthcare consultations.`}
          </Text>
        </View>

        {/* Date Selector */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Select Consultation Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {dateList.map((item) => (
              <TouchableOpacity
                key={item.dateStr}
                style={[styles.dateChip, selectedDate === item.dateStr && styles.activeDateChip]}
                onPress={() => setSelectedDate(item.dateStr)}
              >
                <Text style={[styles.dateChipText, selectedDate === item.dateStr && styles.activeDateChipText]}>
                  {item.label}
                </Text>
                <Text style={[styles.dateSub, selectedDate === item.dateStr && styles.activeDateSub]}>
                  {item.dateStr.split('-').slice(1).join('/')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slot Selector */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Select Available Time Slot</Text>
          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeChip, selectedTime === slot && styles.activeTimeChip]}
                onPress={() => setSelectedTime(slot)}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={selectedTime === slot ? '#ffffff' : '#475569'}
                />
                <Text style={[styles.timeChipText, selectedTime === slot && styles.activeTimeChipText]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Action */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomFeeLabel}>Total Consultation Fee</Text>
          <Text style={styles.bottomFee}>৳{doctor.fee || 500}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookNowPrimaryBtn}
          onPress={() => setConfirmModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.bookNowPrimaryBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconBadge}>
              <Ionicons name="calendar-outline" size={32} color="#0d9488" />
            </View>
            <Text style={styles.modalTitle}>Confirm Appointment</Text>
            <Text style={styles.modalSubtitle}>Please review your appointment summary:</Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryItem}><Text style={styles.bold}>Doctor:</Text> {doctor.name}</Text>
              <Text style={styles.summaryItem}><Text style={styles.bold}>Patient:</Text> {currentPatientName}</Text>
              <Text style={styles.summaryItem}><Text style={styles.bold}>Date:</Text> {selectedDate}</Text>
              <Text style={styles.summaryItem}><Text style={styles.bold}>Time:</Text> {selectedTime}</Text>
              <Text style={styles.summaryItem}><Text style={styles.bold}>Fee:</Text> ৳{doctor.fee || 500}</Text>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setConfirmModalVisible(false)}
                disabled={bookingLoading}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleBookAppointment}
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalConfirmBtnText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={[styles.modalIconBadge, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="checkmark-circle" size={40} color="#16a34a" />
            </View>
            <Text style={styles.modalTitle}>Booking Confirmed!</Text>
            <Text style={styles.modalSubtitle}>
              Your appointment with {doctor.name} on {selectedDate} at {selectedTime} has been successfully scheduled.
            </Text>

            <TouchableOpacity
              style={styles.successDoneBtn}
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace('/(tabs)/booking');
              }}
            >
              <Text style={styles.successDoneBtnText}>Go to My Appointments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { justifyContent: 'center', alignItems: 'center' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  content: { padding: 18, paddingBottom: 100 },
  profileHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  doctorImg: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#0d9488' },
  avatarFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 36, color: '#ffffff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 12 },
  specialty: { fontSize: 14, color: '#0d9488', fontWeight: '600', marginTop: 2 },
  qualification: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },
  statSub: { fontSize: 11, color: '#64748b' },
  statDivider: { width: 1, height: 24, backgroundColor: '#cbd5e1' },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  infoText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  aboutBody: { fontSize: 13, color: '#475569', lineHeight: 20 },
  chipRow: { gap: 10 },
  dateChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  activeDateChip: { backgroundColor: '#0d9488', borderColor: '#0d9488' },
  dateChipText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  activeDateChipText: { color: '#ffffff' },
  dateSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  activeDateSub: { color: '#ccfbf1' },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  activeTimeChip: { backgroundColor: '#0d9488', borderColor: '#0d9488' },
  timeChipText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  activeTimeChipText: { color: '#ffffff' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomFeeLabel: { fontSize: 11, color: '#64748b' },
  bottomFee: { fontSize: 20, fontWeight: 'bold', color: '#0f766e' },
  bookNowPrimaryBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  bookNowPrimaryBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  modalIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ccfbf1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  modalSubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 4, marginBottom: 14 },
  summaryCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  summaryItem: { fontSize: 13, color: '#334155' },
  bold: { fontWeight: 'bold', color: '#0f172a' },
  modalActionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  modalCancelBtnText: { color: '#475569', fontWeight: '600' },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#0d9488',
    alignItems: 'center',
  },
  modalConfirmBtnText: { color: '#ffffff', fontWeight: 'bold' },
  successDoneBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  successDoneBtnText: { color: '#ffffff', fontWeight: 'bold' },
  errorText: { color: '#ef4444', fontSize: 14, marginTop: 8 },
  backHomeBtn: { marginTop: 14, backgroundColor: '#0d9488', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  backHomeBtnText: { color: '#ffffff', fontWeight: '600' },
});