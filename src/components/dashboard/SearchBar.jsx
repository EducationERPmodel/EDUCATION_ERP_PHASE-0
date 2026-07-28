import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

export default function SearchBar({ search, setSearch, placeholder = 'Search by Name or USN' }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: Colors.textPrimary },
});
