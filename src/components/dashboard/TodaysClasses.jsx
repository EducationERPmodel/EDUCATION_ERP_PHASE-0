import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

const classes = [
  { time: '10:00 AM', subject: 'DBMS' },
  { time: '12:00 PM', subject: 'Operating Systems' },
  { time: '02:00 PM', subject: 'Artificial Intelligence' },
];

export default function TodaysClasses() {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Today's Classes</Text>
      {classes.map((item, idx) => (
        <View key={idx} style={styles.row}>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={14} color={Colors.primary} />
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.subject}>{item.subject}</Text>
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
    marginTop: 12,
  },
  heading: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 95,
  },
  time: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginLeft: 4 },
  subject: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
});
