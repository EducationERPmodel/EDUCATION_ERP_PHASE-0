// @ts-nocheck
import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, Pressable,
} from 'react-native';
import { Text, Snackbar, Icon } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import SearchBar from '../../components/SearchBar/SearchBar';
import InfoCard from '../../components/Card/InfoCard';
import CustomDropdown from '../../components/Dropdown/CustomDropdown';
import CustomButton from '../../components/Button/CustomButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import ConfirmationDialog from '../../components/Dialog/ConfirmationDialog';
import { useStudents } from '../../hooks/useStudents';
import { useDropdown } from '../../hooks/useDropdowns';
import { useTransferStudent } from '../../hooks/useTransferStudent';
import ScreenLayout from '../../navigation/ScreenLayout';
import { formatStudentId } from '../../utils/formatStudentId';
import {
  colors, spacing, typography, radius,
} from '../../theme';

// A single boxed read-only value, e.g. "Program: Bachelor of Engineering"
const DetailBox = ({ label, value, style }) => (
  <View style={[styles.detailBox, style]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || '-'}</Text>
  </View>
);

const IconBadge = ({ name }) => (
  <View style={styles.iconBadge}>
    <Icon source={name} size={16} color={colors.primary} />
  </View>
);

const TransferStudentScreen = ({ route, navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newProgramId, setNewProgramId] = useState();
  const [newDepartmentId, setNewDepartmentId] = useState();
  const [newSemester, setNewSemester] = useState();
  const [newSectionId, setNewSectionId] = useState();
  const [document, setDocument] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const { data: searchResults } = useStudents(
    { search: query, pageSize: 5 },
  );
  const { data: programs = [] } = useDropdown('program');
  const { data: departments = [] } = useDropdown('department');
  const { data: sections = [] } = useDropdown('section');
  const { data: semesters = [] } = useDropdown('semester');
  const { mutateAsync: transfer, isPending } = useTransferStudent();

  const suggestions = query && !selectedStudent ? (searchResults?.data || []) : [];

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setDocument(result.assets[0]);
  };

  const handleConfirmTransfer = async () => {
    try {
      const result = await transfer({
        studentId: selectedStudent.id,
        newProgramId,
        newDepartmentId,
        newSemester,
        newSectionId,
        document,
      });
      setPreviewVisible(false);
      // Stay on this screen: refresh "Current Academic Details" with the
      // post-transfer record instead of navigating to Student Registry's
      // Details page (that used to make the sidebar jump to "Student Registry").
      setSelectedStudent(result.student);
      setNewProgramId(undefined);
      setNewDepartmentId(undefined);
      setNewSemester(undefined);
      setNewSectionId(undefined);
      setDocument(null);
      setSuccessMessage(`${result.student.name} transferred successfully.`);
    } catch (err) {
      setErrorMessage(err.message || 'Transfer failed. Please try again.');
    }
  };

  const canSubmit = selectedStudent && newProgramId && newDepartmentId && newSemester && newSectionId && document;

  const newProgramName = programs.find((p) => String(p.id) === String(newProgramId))?.name;
  const newDepartmentName = departments.find((d) => String(d.id) === String(newDepartmentId))?.name;
  const newSectionName = sections.find((s) => String(s.id) === String(newSectionId))?.name;

  return (
    <ScreenLayout navigation={navigation} activeScreen="TransferStudent">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Transfer Student</Text>
        <Text style={styles.subheading}>
          Initiate academic department or section transfers for registered students.
        </Text>

        <SearchBar
          value={selectedStudent ? selectedStudent.name : query}
          onChangeText={(text) => {
            setSelectedStudent(null);
            setQuery(text);
          }}
          onSubmit={() => {}}
          placeholder="Enter Student Name or Registration ID (e.g. STU-2023-4421)"
        />

        {suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            {suggestions.map((s) => (
              <Text
                key={s.id}
                style={styles.suggestionItem}
                onPress={() => {
                  setSelectedStudent(s);
                  setQuery('');
                }}
              >
                {s.name} · {formatStudentId(s)}
              </Text>
            ))}
          </View>
        )}

        {!selectedStudent ? (
          <EmptyState
            icon="account-search-outline"
            title="Search for a student"
            description="Find the student you'd like to transfer using the search bar above."
          />
        ) : (
          <View style={styles.columns}>
            <InfoCard
              title="Current Academic Details"
              icon={<IconBadge name="card-account-details-outline" />}
              style={styles.column}
            >
              <View style={styles.studentBox}>
                <Text style={styles.studentName}>{selectedStudent.name}</Text>
                <Text style={styles.studentId}>{formatStudentId(selectedStudent)}</Text>
              </View>

              <DetailBox label="Program" value={selectedStudent.programName} />

              <View style={styles.row}>
                <DetailBox label="Department" value={selectedStudent.departmentName} style={styles.col} />
                <DetailBox label="Semester" value={`Semester ${selectedStudent.semester}`} style={styles.col} />
              </View>

              <DetailBox label="Section" value={selectedStudent.sectionName} />
            </InfoCard>

            <InfoCard
              title="Transfer To"
              icon={<IconBadge name="swap-horizontal" />}
              style={styles.column}
            >
              <CustomDropdown
                label="Program"
                value={newProgramId}
                options={programs}
                onSelect={setNewProgramId}
                floatingLabel={false}
              />

              <View style={styles.row}>
                <View style={styles.col}>
                  <CustomDropdown
                    label="Department"
                    value={newDepartmentId}
                    options={departments}
                    onSelect={setNewDepartmentId}
                    floatingLabel={false}
                  />
                </View>
                <View style={styles.col}>
                  <CustomDropdown
                    label="Semester"
                    value={newSemester}
                    options={semesters}
                    onSelect={setNewSemester}
                    floatingLabel={false}
                  />
                </View>
              </View>

              <CustomDropdown
                label="Section"
                value={newSectionId}
                options={sections}
                onSelect={setNewSectionId}
                floatingLabel={false}
              />

              <Text style={styles.dropzoneLabel}>Supporting Documents</Text>
              <Pressable onPress={handlePickDocument} style={styles.dropzone}>
                <Icon source="cloud-upload-outline" size={28} color={colors.textSecondary} />
                <Text style={styles.dropzoneText}>
                  {document ? document.name : 'Drag and drop student request letter or committee approval'}
                </Text>
                <Text style={styles.dropzoneHint}>Supported: PDF, JPG up to 10MB</Text>
              </Pressable>
            </InfoCard>
          </View>
        )}

        {selectedStudent && (
          <View style={styles.actions}>
            <CustomButton
              label="Confirm Transfer"
              onPress={() => setPreviewVisible(true)}
              disabled={!canSubmit}
            />
          </View>
        )}

        <Snackbar
          visible={!!errorMessage}
          onDismiss={() => setErrorMessage('')}
          duration={4000}
          style={{ backgroundColor: colors.danger }}
        >
          {errorMessage}
        </Snackbar>
        <Snackbar
          visible={!!successMessage}
          onDismiss={() => setSuccessMessage('')}
          duration={3000}
          style={{ backgroundColor: colors.success }}
        >
          {successMessage}
        </Snackbar>
      </ScrollView>

      {selectedStudent && (
        <ConfirmationDialog
          visible={previewVisible}
          title="Confirm these changes?"
          message={`${selectedStudent.name} will move from ${selectedStudent.programName} · ${selectedStudent.departmentName} · Semester ${selectedStudent.semester} · Section ${selectedStudent.sectionName}  to  ${newProgramName} · ${newDepartmentName} · Semester ${newSemester} · Section ${newSectionName}.`}
          confirmLabel="Confirm Transfer"
          loading={isPending}
          onConfirm={handleConfirmTransfer}
          onCancel={() => setPreviewVisible(false)}
        />
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heading: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  suggestionsBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  suggestionItem: {
    ...typography.body,
    color: colors.textPrimary,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.lg,
    flexWrap: 'wrap',
  },
  column: {
    flex: 1,
    minWidth: 320,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  studentName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  studentId: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
  detailBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  dropzoneLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dropzone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  dropzoneText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  dropzoneHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});

export default TransferStudentScreen;
