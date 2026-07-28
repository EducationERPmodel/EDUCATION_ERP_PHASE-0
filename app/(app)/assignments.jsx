import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import assignmentsData from '../../src/data/assignments';
import SearchAssignment from '../../src/components/assignments/SearchAssignment';
import AssignmentStatistics from '../../src/components/assignments/AssignmentStatistics';
import AssignmentTable from '../../src/components/assignments/AssignmentTable';
import AddAssignmentModal from '../../src/components/assignments/AddAssignmentModal';
import Colors from '../../src/theme/colors';

export default function AssignmentsScreen() {
  const [assignments, setAssignments] = useState(assignmentsData);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (assignment) => {
    if (editAssignment) {
      setAssignments(assignments.map((a) => (a.id === assignment.id ? assignment : a)));
    } else {
      setAssignments([...assignments, assignment]);
    }
    setShowModal(false);
    setEditAssignment(null);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Assignment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setAssignments(assignments.filter((a) => a.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Assignment Management</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => { setEditAssignment(null); setShowModal(true); }}
        >
          <Text style={styles.addBtnText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <SearchAssignment search={search} setSearch={setSearch} />
          <AssignmentStatistics assignments={filtered} />
          <AssignmentTable
            assignments={filtered}
            onEdit={(a) => { setEditAssignment(a); setShowModal(true); }}
            onDelete={handleDelete}
          />
        </View>
      </ScrollView>

      <AddAssignmentModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditAssignment(null); }}
        onSave={handleSave}
        editAssignment={editAssignment}
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
  scroll: { flex: 1 },
  inner: { padding: 16 },
});
