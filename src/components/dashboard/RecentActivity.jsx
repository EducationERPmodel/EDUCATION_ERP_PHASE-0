import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

const activities = [
  'Attendance marked for CSE 3rd Year',
  'IA Marks updated',
  'Assignment uploaded',
  'Student Rahul added',
];

export default function RecentActivity() {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Recent Activities</Text>
      {activities.map((item, idx) => (
        <View key={idx} style={styles.item}>
          <Ionicons name="ellipse" size={8} color={Colors.primary} style={styles.dot} />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    flex: 1,
  },
  heading: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  dot: { marginRight: 10 },
  text: { fontSize: 14, color: Colors.textPrimary, flex: 1 },
});
