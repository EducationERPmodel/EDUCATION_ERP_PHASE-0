import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default function StatCard({ title, value, iconName, color }) {
  // iconName is passed but the icon is rendered by the parent (QuickStats)
  // so this component stays clean as a dumb display card
  return (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <View style={[styles.iconBg, { backgroundColor: color + '22' }]}>
        <Text style={[styles.iconText, { color }]}>■</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  body: { flex: 1 },
  title: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  value: { fontSize: 30, fontWeight: '800', marginTop: 4 },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 22 },
});
