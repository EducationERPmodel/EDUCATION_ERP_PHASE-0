import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert,
  ActivityIndicator, RefreshControl, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api';
import mockAssignments from '../../src/data/assignments';
import PageHeader from '../../src/components/common/PageHeader';
import SearchAssignment from '../../src/components/assignments/SearchAssignment';
import AssignmentStatistics from '../../src/components/assignments/AssignmentStatistics';
import AssignmentTable from '../../src/components/assignments/AssignmentTable';
import AddAssignmentModal from '../../src/components/assignments/AddAssignmentModal';
import Colors from '../../src/theme/colors';

function normalise(a) {
  return { ...a, dueDate: a.dueDate || a.due_date || '' };
}

export default function AssignmentsScreen() {
  const [assignments,     setAssignments]     = useState([]);
  const [search,          setSearch]          = useState('');
  const [showModal,       setShowModal]       = useState(false);
  const [editAssignment,  setEditAssignment]  = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [refreshing,      setRefreshing]      = useState(false);
  const [usingMock,       setUsingMock]       = useState(false);

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments(res.data.map(normalise));
      setUsingMock(false);
    } catch {
      setAssignments(mockAssignments.map(normalise));
      setUsingMock(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAssignments();
  }, [fetchAssignments]);

  const filtered = assignments.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (assignment) => {
    if (usingMock) {
      if (editAssignment) setAssignments(p => p.map(a => a.id === assignment.id ? normalise(assignment) : a));
      else setAssignments(p => [...p, normalise({ ...assignment, id: Date.now() })]);
      setShowModal(false); setEditAssignment(null); return;
    }
    try {
      const payload = {
        title: assignment.title, subject: assignment.subject,
        semester: assignment.semester, due_date: assignment.dueDate,
        marks: assignment.marks, status: assignment.status,
      };
      if (editAssignment) await api.put(`/assignments/${assignment.id}`, payload);
      else await api.post('/assignments', payload);
      await fetchAssignments();
      setShowModal(false); setEditAssignment(null);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Unable to save.');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Assignment', 'This will permanently remove this assignment.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          if (usingMock) { setAssignments(p => p.filter(a => a.id !== id)); return; }
          try { await api.delete(`/assignments/${id}`); fetchAssignments(); }
          catch { Alert.alert('Error', 'Unable to delete.'); }
        },
      },
    ]);
  };

  const openCount = assignments.filter(a => a.status === 'Open').length;

  return (
    <View style={styles.container}>
      <PageHeader
        title="Assignments"
        subtitle={openCount ? `${openCount} open assignment${openCount > 1 ? 's' : ''}` : 'All assignments closed'}
        iconName="book-outline"
        actionLabel="Create"
        actionIcon="add-circle-outline"
        onAction={() => { setEditAssignment(null); setShowModal(true); }}
        badge={openCount || null}
      />

      {usingMock && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={14} color={Colors.warning} />
          <Text style={styles.offlineBannerText}>Backend offline — showing demo data</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
            colors={[Colors.primary]} tintColor={Colors.primary} />
        }
      >
        <View style={styles.inner}>
          <SearchAssignment search={search} setSearch={setSearch} />

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={Colors.primary} size="large" />
              <Text style={styles.loadingText}>Loading assignments...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="book-outline" size={64} color={Colors.border} />
              <Text style={styles.emptyTitle}>
                {search ? 'No results found' : 'No assignments yet'}
              </Text>
              <Text style={styles.emptyDesc}>
                {search ? `No assignments match "${search}"` : 'Create your first assignment to get started'}
              </Text>
              {!search && (
                <TouchableOpacity
                  style={styles.emptyAction}
                  onPress={() => { setEditAssignment(null); setShowModal(true); }}
                >
                  <Ionicons name="add-circle-outline" size={16} color={Colors.white} />
                  <Text style={styles.emptyActionText}>Create Assignment</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <AssignmentStatistics assignments={filtered} />
              <AssignmentTable
                assignments={filtered}
                onEdit={a => { setEditAssignment(a); setShowModal(true); }}
                onDelete={handleDelete}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => { setEditAssignment(null); setShowModal(true); }}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

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
  container:        { flex: 1, backgroundColor: Colors.background },
  offlineBanner:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.warningLight, paddingHorizontal: 16, paddingVertical: 8 },
  offlineBannerText:{ fontSize: 12, color: Colors.warning, fontWeight: '600' },
  scroll:           { flex: 1 },
  inner:            { padding: 16, paddingBottom: 90 },
  loadingBox:       { alignItems: 'center', paddingVertical: 60, gap: 12 },
  loadingText:      { fontSize: 14, color: Colors.textSecondary },
  emptyBox:         { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle:       { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc:        { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
  emptyAction: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 12, marginTop: 8,
  },
  emptyActionText:  { color: Colors.white, fontWeight: '700', fontSize: 14 },
  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.orange,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
});
