/**
 * IAStats — Class IA statistics summary from backend.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import Colors from '../../theme/colors';

export default function IAStats({ refreshKey }) {
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/iamarks')
      .then(res => {
        const records = res.data;
        if (!records.length) return;
        const avgs = records.map(r => (r.ia1 + r.ia2 + r.ia3) / 3);
        const classAvg = avgs.reduce((s, v) => s + v, 0) / avgs.length;
        const highest  = Math.max(...avgs);
        const lowest   = Math.min(...avgs);
        const passing  = avgs.filter(v => v >= 10).length; // ≥10/20 = pass
        setStats({
          classAvg:  classAvg.toFixed(1),
          highest:   highest.toFixed(1),
          lowest:    lowest.toFixed(1),
          passing,
          total: records.length,
        });
      })
      .catch(() => {});
  }, [refreshKey]);

  const items = [
    { label: 'Class Avg', value: stats ? `${stats.classAvg}` : '—', icon: 'stats-chart-outline', color: Colors.primary },
    { label: 'Highest',   value: stats ? `${stats.highest}`  : '—', icon: 'arrow-up-outline',    color: Colors.success },
    { label: 'Lowest',    value: stats ? `${stats.lowest}`   : '—', icon: 'arrow-down-outline',  color: Colors.danger  },
    { label: 'Passing',   value: stats ? `${stats.passing}/${stats.total}` : '—', icon: 'checkmark-circle-outline', color: Colors.purple },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="bar-chart-outline" size={18} color={Colors.purple} />
          <Text style={styles.title}>IA Statistics</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/iamarks')}>
          <Text style={styles.link}>Details →</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {items.map((item, idx) => (
          <View key={idx} style={[styles.statBox, { borderTopColor: item.color }]}>
            <Ionicons name={item.icon} size={16} color={item.color} />
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    flex: 1,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title:     { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  link:      { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statBox: {
    width: '46%',
    borderTopWidth: 3,
    borderRadius: 10,
    backgroundColor: Colors.background,
    padding: 10,
    alignItems: 'center',
    gap: 3,
  },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: Colors.textMuted },
});
