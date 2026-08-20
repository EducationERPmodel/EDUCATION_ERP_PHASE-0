import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import Colors from '../../theme/colors';

interface Stats {
  totalStudents: number;
  attendancePercent: number;
  totalAssignments: number;
  iaAverage: number;
}

interface QuickStatsProps {
  refreshKey: number;
}

export default function QuickStats({ refreshKey }: QuickStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.get<Stats>('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => setStats(null));
  }, [refreshKey]);

  const cards = [
    { title: 'Students',    value: stats ? String(stats.totalStudents)    : '—', icon: 'school-outline',    color: Colors.primary, route: '/students' },
    { title: 'Attendance',  value: stats ? `${stats.attendancePercent}%`  : '—', icon: 'checkbox-outline',  color: Colors.success, route: '/attendance' },
    { title: 'Assignments', value: stats ? String(stats.totalAssignments) : '—', icon: 'book-outline',      color: Colors.orange,  route: '/assignments' },
    { title: 'IA Average',  value: stats ? `${stats.iaAverage}%`          : '—', icon: 'bar-chart-outline', color: Colors.purple,  route: '/iamarks' },
  ];

  return (
    <View style={styles.grid}>
      {cards.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.card, { borderLeftColor: item.color }]}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.iconBg, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon as any} size={26} color={item.color} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.statTitle}>{item.title}</Text>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={item.color + '88'} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', marginTop: 16 },
  card: {
    width: '47%', backgroundColor: Colors.white, borderRadius: 14,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 4, marginBottom: 12,
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  iconBg:    { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  textBlock: { flex: 1 },
  statTitle: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  statValue: { fontSize: 20, fontWeight: '800', marginTop: 2 },
});
