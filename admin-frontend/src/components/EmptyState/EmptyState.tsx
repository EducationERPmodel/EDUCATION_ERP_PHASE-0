// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme';

const EmptyState = ({
  icon = 'account-search-outline', title, description, footnote,
}) => (
  <View style={styles.container}>
    <Avatar.Icon
      icon={icon}
      size={64}
      style={styles.iconWrap}
      color={colors.textSecondary}
    />
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
    {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  footnote: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});

export default EmptyState;
