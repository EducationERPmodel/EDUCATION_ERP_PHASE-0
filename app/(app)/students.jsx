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
import api from '../../src/services/api';
import mockStudents from '../../src/data/students';
import SearchBar from '../../src/components/dashboard/SearchBar';
import StudentTable from '../../src/components/dashboard/StudentTable';
import AddStudentModal from '../../src/components/dashboard/AddStudentModal';
import Colors from '../../src/theme/colors';

export default function StudentsScreen() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students');
      setStudents(res.data);
      setUsingMockData(false);
    } catch (error) {
      // Backend not available — fall back to mock data so the UI is usable
      console.warn('Backend unavailable, using mock data:', error.message);
      setStudents(mockStudents.map((s) => ({
        ...s,
        email: `${s.usn.toLowerCase()}@college.edu`,
        phone: '9876543210',
        semester: s.year * 2,
        section: 'A',
        status: 'Active',
      })));
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.usn?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveStudent = async (student) => {
    if (usingMockData) {
      // Offline mode — update local state only
      if (editStudent) {
        setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, ...student } : s));
        Alert.alert('Updated', 'Student updated (offline mode).');
      } else {
        setStudents((prev) => [...prev, { ...student, id: Date.now() }]);
        Alert.alert('Added', 'Student added (offline mode).');
      }
      setShowModal(false);
      setEditStudent(null);
      return;
    }
    try {
      if (editStudent) {
        await api.put(`/students/${student.id}`, student);
        Alert.alert('Success', 'Student updated successfully.');
      } else {
        await api.post('/students', student);
        Alert.alert('Success', 'Student added successfully.');
      }
      await fetchStudents();
      setShowModal(false);
      setEditStudent(null);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Unable to save student.');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Student', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (usingMockData) {
            setStudents((prev) => prev.filter((s) => s.id !== id));
            return;
          }
          try {
            await api.delete(`/students/${id}`);
            Alert.alert('Success', 'Student deleted.');
            fetchStudents();
          } catch (e) {
            Alert.alert('Error', 'Unable to delete student.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Student Management</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => { setEditStudent(null); setShowModal(true); }}
        >
          <Text style={styles.addBtnText}>+ Add Student</Text>
        </TouchableOpacity>
      </View>

      {usingMockData && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>⚠ Backend offline — showing demo data</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <SearchBar search={search} setSearch={setSearch} />
          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={(s) => { setEditStudent(s); setShowModal(true); }}
              onDelete={handleDelete}
            />
          )}
        </View>
      </ScrollView>

      <AddStudentModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditStudent(null); }}
        onSave={handleSaveStudent}
        editStudent={editStudent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  addBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 9 },
  addBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  offlineBanner: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  offlineBannerText: { fontSize: 13, color: Colors.warning, fontWeight: '600' },
  scroll: { flex: 1 },
  inner: { padding: 16 },
});
