// @ts-nocheck
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import SearchBar from '../../components/SearchBar/SearchBar';
import StudentTable from '../../components/Table/StudentTable';
import LoadingIndicator from '../../components/Loading/LoadingIndicator';
import EmptyState from '../../components/EmptyState/EmptyState';
import ScreenLayout from '../../navigation/ScreenLayout';
import { useStudents } from '../../hooks/useStudents';
import { PAGE_SIZE } from '../../constants';
import { colors, spacing, typography } from '../../theme';

const StudentListScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useStudents({
    search: search || undefined, page, pageSize: PAGE_SIZE,
  });

  const students = data?.data || [];
  const meta = data?.meta;

  return (
    <ScreenLayout navigation={navigation} activeScreen="StudentList">
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Registry</Text>
        <Text style={styles.subtitle}>Manage all admitted students</Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={() => setPage(1)}
          placeholder="Search by Library ID, USN, Name, or Email..."
        />
      </View>

      {isLoading ? (
        <LoadingIndicator label="Loading students..." />
      ) : students.length === 0 ? (
        <EmptyState
          icon="account-search-outline"
          title="No students found"
          description="Try adjusting your search, or add a new student to get started."
        />
      ) : (
        <>
          <StudentTable
            students={students}
            onRowPress={(item) => navigation.navigate('StudentDetails', { studentId: item.id })}
          />
          {meta && (
            <View style={styles.paginationRow}>
              <Text
                style={[styles.pageLink, page <= 1 && styles.pageLinkDisabled]}
                onPress={() => page > 1 && setPage(page - 1)}
              >
                Previous
              </Text>
              <Text style={styles.pageInfo}>
                Page {meta.page} of {meta.totalPages || 1} · {meta.total} students
                {isFetching ? ' · refreshing...' : ''}
              </Text>
              <Text
                style={[styles.pageLink, page >= (meta.totalPages || 1) && styles.pageLinkDisabled]}
                onPress={() => page < (meta.totalPages || 1) && setPage(page + 1)}
              >
                Next
              </Text>
            </View>
          )}
        </>
      )}

      <FAB
        icon="plus"
        label="Add Student"
        style={styles.fab}
        color={colors.white}
        onPress={() => navigation.navigate('AddStudent')}
      />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  pageLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  pageLinkDisabled: {
    color: colors.textMuted,
  },
  pageInfo: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
});

export default StudentListScreen;
