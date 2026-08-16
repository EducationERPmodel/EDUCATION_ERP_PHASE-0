// @ts-nocheck
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import StudentForm from './StudentForm';
import LoadingIndicator from '../../components/Loading/LoadingIndicator';
import EmptyState from '../../components/EmptyState/EmptyState';
import ScreenLayout from '../../navigation/ScreenLayout';
import { useStudent, useUpdateStudent } from '../../hooks/useStudents';
import { colors } from '../../theme';

const EditStudentScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const { data: student, isLoading, isError } = useStudent(studentId);
  const { mutateAsync, isPending } = useUpdateStudent();
  const [errorMessage, setErrorMessage] = useState('');

  if (isLoading) {
    return (
      <ScreenLayout navigation={navigation} activeScreen="AddStudent">
        <LoadingIndicator fullscreen label="Loading student..." />
      </ScreenLayout>
    );
  }
  if (isError || !student) {
    return (
      <ScreenLayout navigation={navigation} activeScreen="AddStudent">
        <EmptyState icon="alert-circle-outline" title="Student not found" />
      </ScreenLayout>
    );
  }

  const handleSubmit = async (form) => {
    try {
      await mutateAsync({ id: studentId, form });
      navigation.navigate('StudentDetails', { studentId });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update student. Please try again.');
    }
  };

  return (
    <ScreenLayout navigation={navigation} activeScreen="AddStudent">
      <View style={styles.container}>
        <StudentForm
          breadcrumbLabel="Edit Student"
          initialValues={student}
          onSubmit={handleSubmit}
          onCancel={() => navigation.goBack()}
          submitLabel="Update Student Data"
          submitting={isPending}
        />
        <Snackbar
          visible={!!errorMessage}
          onDismiss={() => setErrorMessage('')}
          duration={4000}
          style={{ backgroundColor: colors.danger }}
        >
          {errorMessage}
        </Snackbar>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default EditStudentScreen;
