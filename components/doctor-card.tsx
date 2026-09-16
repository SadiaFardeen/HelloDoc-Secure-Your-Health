import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DoctorCardProps {
  doctor?: any;
  id?: string | number;
  name?: string;
  specialty?: string;
  rating?: number;
  reviewsCount?: number;
  experience?: string;
  hospital?: string;
  fee?: string;
  imageUrl?: string;
  onPress?: () => void;
}

export default function DoctorCard(props: DoctorCardProps) {
  const d = props.doctor || {};
  const name = props.name || d.name || 'Doctor';
  const specialty = props.specialty || d.specialization || d.specialty || 'General Physician';
  const rating = props.rating || Number(d.rating) || 4.9;
  const experience = props.experience || (d.experience ? `${d.experience} yrs` : '5 yrs');
  const hospital = props.hospital || d.hospital || 'Dhaka Medical Center, Dhaka';
  const fee = props.fee || (d.fee ? `৳${d.fee}` : '৳500');
  
  const rawImageUrl = props.imageUrl || d.image_url || d.imageUrl || null;
  const [imageError, setImageError] = useState(false);

  const getInitial = (docName: string) => {
    const clean = docName.replace(/^Dr\.\s*/i, '').trim();
    return clean ? clean.charAt(0).toUpperCase() : 'D';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={props.onPress} activeOpacity={0.88}>
      <View style={styles.topRow}>
        {rawImageUrl && !imageError ? (
          <Image
            source={{ uri: rawImageUrl }}
            style={styles.avatarImg}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{getInitial(name)}</Text>
            <View style={styles.badgeOnline}>
              <Ionicons name="medical" size={10} color="#fff" />
            </View>
          </View>
        )}

        <View style={styles.infoCol}>
          <Text style={styles.doctorName} numberOfLines={1}>{name}</Text>
          <Text style={styles.specialtyText} numberOfLines={1}>{specialty}</Text>
          <View style={styles.hospitalRow}>
            <Ionicons name="location-sharp" size={13} color="#ef4444" />
            <Text style={styles.hospitalText} numberOfLines={1}>{hospital}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.metaBadge}>
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Text style={styles.metaText}>{rating}</Text>
        </View>

        <View style={styles.metaBadge}>
          <Ionicons name="time-outline" size={14} color="#64748b" />
          <Text style={styles.metaText}>{experience}</Text>
        </View>

        <View style={[styles.metaBadge, styles.feeBadge]}>
          <Text style={styles.feeHighlight}>{fee}</Text>
        </View>

        <TouchableOpacity style={styles.bookActionBtn} onPress={props.onPress} activeOpacity={0.8}>
          <Text style={styles.bookActionBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatarImg: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#0d9488',
    backgroundColor: '#f1f5f9',
  },
  avatarFallback: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  badgeOnline: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: '#10b981',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  specialtyText: {
    fontSize: 13,
    color: '#0d9488',
    marginTop: 2,
    fontWeight: '600',
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  hospitalText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  feeBadge: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  feeHighlight: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f766e',
  },
  bookActionBtn: {
    marginLeft: 'auto',
    backgroundColor: '#0d9488',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  bookActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});