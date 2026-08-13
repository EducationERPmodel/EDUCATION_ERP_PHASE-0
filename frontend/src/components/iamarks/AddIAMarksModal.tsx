import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

interface IARecord {
  id: number;
  usn: string;
  name: string;
  ia1: number;
  ia2: number;
  ia3: number;
}

interface AddIAMarksModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (record: any) => void;
  editStudent: IARecord | null;
}

export default function AddIAMarksModal({ show, onClose, onSave, editStudent }: AddIAMarksModalProps) {
  const [usn,  setUsn]  = useState('');
  const [name, setName] = useState('');
  const [ia1,  setIa1]  = useState('');
  const [ia2,  setIa2]  = useState('');
  const [ia3,  setIa3]  = useState('');

  useEffect(() => {
    if (editStudent) {
      setUsn(editStudent.usn); setName(editStudent.name);
      setIa1(editStudent.ia1?.toString()); setIa2(editStudent.ia2?.toString()); setIa3(editStudent.ia3?.toString());
    } else {
      setUsn(''); setName(''); setIa1(''); setIa2(''); setIa3('');
    }
  }, [editStudent, show]);

  const handleSave = () => {
    if (!usn || !name) { Alert.alert('Validation', 'Please fill USN and Name.'); return; }
    onSave({
      id: editStudent ? editStudent.id : Date.now(),
      usn, name,
      ia1: Number(ia1), ia2: Number(ia2), ia3: Number(ia3),
    });
    onClose();
  };

  const fields: { val: string; set: (v: string) => void; placeholder: string; keyboardType?: any }[] = [
    { val: usn,  set: setUsn,  placeholder: 'USN *' },
    { val: name, set: setName, placeholder: 'Student Name *' },
    { val: ia1,  set: setIa1,  placeholder: 'IA 1 (out of 20)', keyboardType: 'numeric' },
    { val: ia2,  set: setIa2,  placeholder: 'IA 2 (out of 20)', keyboardType: 'numeric' },
    { val: ia3,  set: setIa3,  placeholder: 'IA 3 (out of 20)', keyboardType: 'numeric' },
  ];

  return (
    <Modal visible={show} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.centred}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{editStudent ? 'Edit IA Marks' : 'Add IA Marks'}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {fields.map((f, i) => (
                <TextInput
                  key={i}
                  style={styles.input}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  value={f.val}
                  onChangeText={f.set}
                  keyboardType={f.keyboardType ?? 'default'}
                />
              ))}
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  centred:       { width: '92%', maxWidth: 480 },
  card:          { backgroundColor: Colors.white, borderRadius: 18, padding: 22, maxHeight: '90%', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title:         { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  input:         { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.textPrimary, marginBottom: 12 },
  btnRow:        { flexDirection: 'row', gap: 10, marginTop: 4 },
  saveBtn:       { flex: 1, backgroundColor: Colors.success, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  saveBtnText:   { color: Colors.white, fontWeight: '700', fontSize: 15 },
  cancelBtn:     { flex: 1, backgroundColor: Colors.background, borderRadius: 10, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  cancelBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 15 },
});
