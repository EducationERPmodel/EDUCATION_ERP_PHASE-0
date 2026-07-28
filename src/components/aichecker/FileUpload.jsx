import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

// expo-document-picker v14 result: { canceled: bool, assets: [{uri, name, mimeType}] | null }
async function pickFile(setFile) {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/plain', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    // v14 API: canceled is a boolean, assets is the array
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFile(result.assets[0]);
    }
  } catch (err) {
    console.error('File picker error:', err);
  }
}

function FileSlot({ label, file, setFile }) {
  return (
    <View style={styles.slot}>
      <Text style={styles.slotLabel}>{label}</Text>
      <TouchableOpacity style={styles.pickBtn} onPress={() => pickFile(setFile)}>
        <Ionicons name="document-attach-outline" size={20} color={Colors.primary} />
        <Text style={styles.pickBtnText}>Choose File (.txt / .pdf)</Text>
      </TouchableOpacity>
      {file && (
        <View style={styles.selectedRow}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
          <Text style={styles.selectedText} numberOfLines={1}>{file.name}</Text>
        </View>
      )}
    </View>
  );
}

export default function FileUpload({ file1, setFile1, file2, setFile2 }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>📄 Upload Assignments</Text>
      <FileSlot label="Assignment 1" file={file1} setFile={setFile1} />
      <View style={styles.divider} />
      <FileSlot label="Assignment 2" file={file2} setFile={setFile2} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  slot: { marginBottom: 6 },
  slotLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 12,
  },
  pickBtnText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  selectedText: {
    color: Colors.success,
    fontSize: 13,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
});
