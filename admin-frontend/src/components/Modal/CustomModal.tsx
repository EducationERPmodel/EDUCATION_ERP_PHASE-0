// @ts-nocheck
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Portal, Modal, Text } from 'react-native-paper';
import { colors, radius, spacing, typography } from '../../theme';

const CustomModal = ({
  visible, onDismiss, title, children,
}) => (
  <Portal>
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <ScrollView>{children}</ScrollView>
    </Modal>
  </Portal>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    margin: spacing.xl,
    borderRadius: radius.lg,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});

export default CustomModal;
