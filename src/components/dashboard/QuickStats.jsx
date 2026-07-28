import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

const stats = [
  { title: 'Students', value: '520', icon: 'school-outline', color: Colors.primary },
  { title: 'Attendance', value: '96%', icon: 'checkbox-outline', color: Colors.success },
  { title: 'Assignments', value: '18', icon: 'book-outline', color: Colors.orange },
  { title: 'IA Average', value: '82%', icon: 'bar-chart-outline', color: Colors.purple },
];

export default function QuickStats() {
  return (
    <View style={styles.grid}>
      {stats.map((item, idx) => (
        <View key={idx} style={[styles.card, { borderLeftColor: item.color }]}>
          <View style={[styles.iconBg, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon} size={26} color={item.color} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.statTitle}>{item.title}</Text>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textBlock: { flex: 1 },
  statTitle: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  statValue: { fontSize: 22, fontWeight: '800', marginTop: 2 },
});
