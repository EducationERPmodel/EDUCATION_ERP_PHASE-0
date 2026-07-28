import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

export default function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.emptyText}>No students found</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Student List</Text>
      {/* Header row */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell, { flex: 1.6 }]}>USN</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1.4 }]}>Name</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 0.8 }]}>Sem</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 0.8 }]}>Status</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Actions</Text>
      </View>

      {students.map((student) => (
        <View key={student.id} style={styles.row}>
          <Text style={[styles.cell, { flex: 1.6 }]} numberOfLines={1}>{student.usn}</Text>
          <Text style={[styles.cell, { flex: 1.4 }]} numberOfLines={1}>{student.name}</Text>
          <Text style={[styles.cell, { flex: 0.8 }]}>{student.semester || '-'}</Text>
          <View style={[styles.cell, { flex: 0.8 }]}>
            <View style={[styles.badge, { backgroundColor: student.status === 'Active' ? Colors.successLight : Colors.border }]}>
              <Text style={[styles.badgeText, { color: student.status === 'Active' ? Colors.success : Colors.textSecondary }]}>
                {student.status || 'Active'}
              </Text>
            </View>
          </View>
          <View style={[styles.cell, styles.actions, { flex: 1 }]}>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: Colors.warningLight }]} onPress={() => onEdit(student)}>
              <Ionicons name="create-outline" size={15} color={Colors.warning} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: Colors.dangerLight }]} onPress={() => onDelete(student.id)}>
              <Ionicons name="trash-outline" size={15} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  heading: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 10,
    borderBottomWidth: 0,
    marginBottom: 2,
  },
  cell: { fontSize: 12, color: Colors.textPrimary, paddingHorizontal: 2 },
  headerCell: { fontWeight: '700', color: Colors.primary, fontSize: 12 },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: Colors.textMuted, fontSize: 15, marginTop: 10 },
});
