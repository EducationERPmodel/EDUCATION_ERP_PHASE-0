// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme';

const LoadingIndicator = ({ label = 'Loading...', fullscreen = false }) => (
  <View style={[styles.container, fullscreen && styles.fullscreen]}>
    <ActivityIndicator animating size="large" color={colors.primary} />
    {label ? <Text style={styles.label}>{label}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});

export default LoadingIndicator;
