// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { colors, radius, spacing } from '../../theme';

const SearchBar = ({
  value, onChangeText, onSubmit, placeholder = 'Search by Library ID, USN, Name',
}) => (
  <View style={styles.wrapper}>
    <TextInput
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmit}
      placeholder={placeholder}
      left={<TextInput.Icon icon="account-search-outline" />}
      right={<TextInput.Icon icon="magnify" onPress={onSubmit} />}
      outlineColor={colors.border}
      activeOutlineColor={colors.primary}
      style={styles.input}
      returnKeyType="search"
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
  },
});

export default SearchBar;
