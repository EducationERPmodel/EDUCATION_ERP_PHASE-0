import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';

const profileInfo = [
  { icon: 'id-card-outline', label: 'Employee ID', value: 'CSE1024' },
  { icon: 'mail-outline', label: 'Email', value: 'faculty@erp.com' },
  { icon: 'call-outline', label: 'Phone', value: '+91 9876543210' },
  { icon: 'business-outline', label: 'Department', value: 'Computer Science & Engineering' },
  { icon: 'book-outline', label: 'Subjects', value: 'Database Management Systems\nOperating Systems\nComputer Networks' },
  { icon: 'time-outline', label: 'Experience', value: '8 Years' },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Faculty Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>

          {/* Profile card */}
          <View style={styles.card}>

            {/* Avatar section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={72} color={Colors.white} />
              </View>
              <Text style={styles.name}>Dr. John Smith</Text>
              <Text style={styles.role}>Assistant Professor</Text>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="create-outline" size={16} color={Colors.white} />
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Info rows */}
            <Text style={styles.sectionTitle}>Faculty Information</Text>
            {profileInfo.map((item, idx) => (
              <View key={idx} style={[styles.infoRow, idx % 2 === 0 && styles.infoRowAlt]}>
                <View style={styles.infoLabelWrap}>
                  <Ionicons name={item.icon} size={16} color={Colors.primary} style={styles.infoIcon} />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  pageTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  scroll: { flex: 1 },
  inner: { padding: 16 },
  card: {
    backgroundColor: Colors.white, borderRadius: 18, overflow: 'hidden',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: Colors.primary,
  },
  avatarCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: Colors.white,
  },
  name: { fontSize: 22, fontWeight: '800', color: Colors.white, marginTop: 14 },
  role: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8,
    marginTop: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  editBtnText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  divider: { height: 1, backgroundColor: Colors.border },
  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: Colors.textPrimary,
    paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    alignItems: 'flex-start',
  },
  infoRowAlt: { backgroundColor: Colors.background },
  infoLabelWrap: { flexDirection: 'row', alignItems: 'center', width: 150 },
  infoIcon: { marginRight: 8 },
  infoLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  infoValue: { flex: 1, fontSize: 13, color: Colors.textPrimary, lineHeight: 20 },
});
