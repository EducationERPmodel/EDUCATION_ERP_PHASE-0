// @ts-nocheck
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text, Icon } from 'react-native-paper';
import CustomInput from '../../components/Input/CustomInput';
import CustomDropdown from '../../components/Dropdown/CustomDropdown';
import CustomButton from '../../components/Button/CustomButton';
import InfoCard from '../../components/Card/InfoCard';
import { useDropdown } from '../../hooks/useDropdowns';
import { colors, spacing, typography, radius } from '../../theme';

const DEFAULTS = {
  name: '',
  phone: '',
  gender: undefined,
  academicYear: '',
  programId: undefined,
  departmentId: undefined,
  semester: undefined,
  sectionId: undefined,
  libraryId: '',
  usn: '',
};

const IconBadge = ({ name }) => (
  <View style={styles.iconBadge}>
    <Icon source={name} size={18} color={colors.primary} />
  </View>
);

const StudentForm = ({
  initialValues, onSubmit, onSaveAndContinue, onCancel,
  submitLabel = 'Save Student Data', submitting = false, continuing = false,
  breadcrumbLabel = 'Add Student',
}) => {
  const {
    control, handleSubmit, reset, formState: { errors },
  } = useForm({ defaultValues: initialValues || DEFAULTS });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const handleSaveAndContinue = handleSubmit(async (data) => {
    await onSaveAndContinue(data);
    reset(DEFAULTS); // clear the form so the next student can be entered right away
  });

  const { data: programs = [], isLoading: loadingPrograms } = useDropdown('program');
  const { data: departments = [], isLoading: loadingDepartments } = useDropdown('department');
  const { data: sections = [], isLoading: loadingSections } = useDropdown('section');
  const { data: genders = [] } = useDropdown('gender');
  const { data: semesters = [] } = useDropdown('semester');

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.breadcrumb}>
        Student Registry <Text style={styles.breadcrumbActive}>›  {breadcrumbLabel}</Text>
      </Text>
      <Text style={styles.heading}>Register New Student</Text>
      <Text style={styles.subheading}>
        Fill in the student&apos;s personal and academic details.
      </Text>

      <InfoCard title="Student Information" icon={<IconBadge name="account-outline" />}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <CustomInput
                  label="Name"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.name?.message}
                />
              )}
            />
          </View>
          <View style={styles.col}>
            <Controller
              control={control}
              name="gender"
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <CustomDropdown
                  label="Gender"
                  value={field.value}
                  options={genders}
                  onSelect={field.onChange}
                  error={errors.gender?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Controller
              control={control}
              name="phone"
              rules={{
                pattern: { value: /^[0-9+\-\s]{10}$/, message: 'Enter a valid phone number' },
              }}
              render={({ field }) => (
                <CustomInput
                  label="Phone"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                />
              )}
            />
          </View>
          <View style={styles.col} />
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Controller
              control={control}
              name="academicYear"
              rules={{ required: 'Academic year is required' }}
              render={({ field }) => (
                <CustomInput
                  label="Academic Year"
                  placeholder="e.g. 2026-2027"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.academicYear?.message}
                />
              )}
            />
          </View>
          <View style={styles.col}>
            <Controller
              control={control}
              name="programId"
              rules={{ required: 'Program is required' }}
              render={({ field }) => (
                <CustomDropdown
                  label="Program"
                  value={field.value}
                  options={programs}
                  loading={loadingPrograms}
                  onSelect={field.onChange}
                  error={errors.programId?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Controller
              control={control}
              name="departmentId"
              rules={{ required: 'Department is required' }}
              render={({ field }) => (
                <CustomDropdown
                  label="Department"
                  value={field.value}
                  options={departments}
                  loading={loadingDepartments}
                  onSelect={field.onChange}
                  error={errors.departmentId?.message}
                />
              )}
            />
          </View>
          <View style={styles.col}>
            <Controller
              control={control}
              name="semester"
              rules={{ required: 'Semester is required' }}
              render={({ field }) => (
                <CustomDropdown
                  label="Semester"
                  value={field.value}
                  options={semesters}
                  onSelect={field.onChange}
                  error={errors.semester?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Controller
              control={control}
              name="sectionId"
              rules={{ required: 'Section is required' }}
              render={({ field }) => (
                <CustomDropdown
                  label="Section"
                  value={field.value}
                  options={sections}
                  loading={loadingSections}
                  onSelect={field.onChange}
                  error={errors.sectionId?.message}
                />
              )}
            />
          </View>
          <View style={styles.col} />
        </View>
      </InfoCard>

      <InfoCard title="Student IDs" icon={<IconBadge name="card-account-details-outline" />}>
        <Controller
          control={control}
          name="libraryId"
          render={({ field }) => (
            <CustomInput
              label="Library ID"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          control={control}
          name="usn"
          render={({ field }) => (
            <CustomInput
              label="USN"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </InfoCard>

      <View style={styles.actions}>
        <CustomButton label="Cancel" variant="text" onPress={onCancel} />
        {onSaveAndContinue && (
          <CustomButton
            label="Save & Continue"
            variant="outline"
            onPress={handleSaveAndContinue}
            loading={continuing}
          />
        )}
        <CustomButton
          label={submitLabel}
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  heading: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  breadcrumb: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  breadcrumbActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  col: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  submitButton: {
    minWidth: 180,
  },
});

export default StudentForm;
