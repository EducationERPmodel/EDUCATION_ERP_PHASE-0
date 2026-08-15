// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, Text } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme';

const CustomInput = ({
  label, value, onChangeText, onBlur, placeholder, error, keyboardType = 'default',
  secureTextEntry = false, multiline = false, floatingLabel = true,
}) => (
  <View style={styles.container}>
    {!floatingLabel && label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      mode="outlined"
      label={floatingLabel ? label : undefined}
      placeholder={placeholder || label}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      error={!!error}
      outlineColor={colors.border}
      activeOutlineColor={colors.primary}
      style={styles.input}
      theme={{ colors: { background: colors.surface } }}
    />
    {!!error && <HelperText type="error">{error}</HelperText>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
  },
});

export default CustomInput;
