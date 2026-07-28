import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../src/services/api';
import mockStudents from '../../src/data/students';
import Colors from '../../src/theme/colors';

const SUBJECTS = ['DBMS', 'Operating Systems', 'Computer Networks', 'Java', 'Data Structures'];

function todayString() {
  return new Date().toISOString().split('T')[0];
}

export default function AttendanceScreen() {
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState('DBMS');
  const [date] = useState(todayString());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students');
      setStudents(res.data.map((s) => ({ ...s, status: 'Present' })));
      setUsingMockData(false);
    } catch (err) {
      console.warn('Backend unavailable, using mock students for attendance:', err.message);
      setStudents(
        mockStudents.map((s) => ({ ...s, status: 'Present' }))
      );
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' }
          : s
      )
    );
  };

  const saveAttendance = async () => {
    if (usingMockData) {
      Alert.alert('Offline Mode', 'Backend is not available. Attendance cannot be saved right now.');
      return;
    }
    setSaving(true);
    try {
      for (const student of students) {
        await api.post('/attendance', {
          student_id: student.id,
          subject,
          attendance_date: date,
          status: student.status,
        });
      }
      Alert.alert('Success', 'Attendance Saved Successfully!');
    } catch (err) {
      Alert.alert('Error', 'Unable to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.status === 'Present').length;
  const absentCount = students.length - presentCount;

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Attendance Management</Text>
      </View>

      {usingMockData && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>⚠ Backend offline — showing demo data</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>

          {/* Filter card */}
          <View style={styles.filterCard}>
            <Text style={styles.label}>Subject</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={subject}
                onValueChange={setSubject}
                style={styles.picker}
                dropdownIconColor={Colors.textSecondary}
              >
                {SUBJECTS.map((s) => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Date</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>

          {/* Summary chips */}
          <View style={styles.summary}>
            <View style={[styles.chip, { backgroundColor: Colors.successLight }]}>
              <Text style={[styles.chipText, { color: Colors.success }]}>✓ Present: {presentCount}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: Colors.dangerLight }]}>
              <Text style={[styles.chipText, { color: Colors.danger }]}>✗ Absent: {absentCount}</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 30 }} />
          ) : (
            <>
              {/* Table header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1.5 }]}>USN</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1.5 }]}>Name</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Status</Text>
              </View>

              {students.map((student) => (
                <View key={student.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>{student.usn}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>{student.name}</Text>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        { backgroundColor: student.status === 'Present' ? Colors.success : Colors.danger },
                      ]}
                      onPress={() => toggleAttendance(student.id)}
                    >
                      <Text style={styles.statusBtnText}>{student.status}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={saveAttendance}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.saveBtnText}>Save Attendance</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  offlineBanner: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  offlineBannerText: { fontSize: 13, color: Colors.warning, fontWeight: '600' },
  scroll: { flex: 1 },
  inner: { padding: 16 },
  filterCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  picker: { height: 52, color: Colors.textPrimary },
  dateBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  dateText: { fontSize: 14, color: Colors.textPrimary },
  summary: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontWeight: '700', fontSize: 13 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
  },
  tableHeader: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    borderBottomWidth: 0,
    marginBottom: 2,
  },
  tableCell: { fontSize: 13, color: Colors.textPrimary },
  tableHeaderText: { fontWeight: '700', color: Colors.primary },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 72,
    alignItems: 'center',
  },
  statusBtnText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
