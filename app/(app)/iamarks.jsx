import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import iaMarksData from '../../src/data/iaMarks';
import SearchIAMarks from '../../src/components/iamarks/SearchIAMarks';
import IAStatistics from '../../src/components/iamarks/IAStatistics';
import IAMarksTable from '../../src/components/iamarks/IAMarksTable';
import AddIAMarksModal from '../../src/components/iamarks/AddIAMarksModal';
import Colors from '../../src/theme/colors';

export default function IAMarksScreen() {
  const [students, setStudents] = useState(iaMarksData);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.usn.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (student) => {
    if (editStudent) {
      setStudents(students.map((s) => (s.id === student.id ? student : s)));
    } else {
      setStudents([...students, student]);
    }
    setShowModal(false);
    setEditStudent(null);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setStudents(students.filter((s) => s.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>IA Marks Management</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => { setEditStudent(null); setShowModal(true); }}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <SearchIAMarks search={search} setSearch={setSearch} />
          <IAStatistics students={filtered} />
          <IAMarksTable
            students={filtered}
            onEdit={(s) => { setEditStudent(s); setShowModal(true); }}
            onDelete={handleDelete}
          />
        </View>
      </ScrollView>

      <AddIAMarksModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditStudent(null); }}
        onSave={handleSave}
        editStudent={editStudent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  pageTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  addBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 9 },
  addBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  scroll: { flex: 1 },
  inner: { padding: 16 },
});
