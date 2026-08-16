// @ts-nocheck
import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native-paper';
import CustomInput from '../../components/Input/CustomInput';
import CustomButton from '../../components/Button/CustomButton';
import InfoCard from '../../components/Card/InfoCard';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, radius } from '../../theme';

const DEFAULTS = { username: '', password: '' };

const LoginScreen = () => {
  const { login, isLoggingIn, error } = useAuth();
  const {
    control, handleSubmit, formState: { errors },
  } = useForm({ defaultValues: DEFAULTS });

  const onSubmit = handleSubmit(async (data) => {
    await login(data.username.trim(), data.password);
    // On success, AuthContext flips isAuthenticated and AppNavigator swaps
    // straight to the main app stack - no manual navigation needed here.
  });

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.centerWrap}>
        <View style={styles.brand}>
          <Text style={styles.brandTitle}>SVCE EDUCATION ERP</Text>
          <Text style={styles.brandSubtitle}>Academic Management</Text>
        </View>

        <InfoCard title="Sign in" style={styles.card}>
          <Text style={styles.subheading}>
            Enter your administrator credentials to continue.
          </Text>

          <Controller
            control={control}
            name="username"
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <CustomInput
                label="Username"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.username?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <CustomInput
                label="Password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <CustomButton
            label="Log In"
            onPress={onSubmit}
            loading={isLoggingIn}
            style={styles.submitButton}
          />
        </InfoCard>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  brandTitle: {
    ...typography.h1,
    color: colors.primary,
  },
  brandSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radius.lg,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});

export default LoginScreen;
