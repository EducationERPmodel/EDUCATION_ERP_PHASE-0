// @ts-nocheck
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { colors, radius, typography } from '../../theme';

// variant: 'primary' | 'outline' | 'text'
const CustomButton = ({
  label, onPress, variant = 'primary', loading = false, disabled = false, style,
}) => {
  const mode = variant === 'primary' ? 'contained' : variant === 'outline' ? 'outlined' : 'text';

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={[styles.base, style]}
      labelStyle={styles.label}
      buttonColor={variant === 'primary' ? colors.primary : undefined}
      textColor={variant === 'primary' ? colors.white : colors.primary}
    >
      {label}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    justifyContent: 'center',
  },
  label: {
    ...typography.button,
  },
});

export default CustomButton;
