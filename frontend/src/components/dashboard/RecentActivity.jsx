import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import Colors from '../../theme/colors';

const FALLBACK = [
  { text: 'Mark today\'s attendance', route: '/attendance', icon: 'checkbox-outline' },
  { text: 'View IA Marks',            route: '/iamarks',    icon: 'bar-chart-outline' },
  { text: 'Manage Assignments',       route: '/assignments', icon: 'book-outline' },
  { text: 'View Student List',        route: '/students',   icon: 'people-outline' },
];

function routeForActivity(text) {
  if (text.toLowerCase().includes('student'))    return '/students';
  if (text.toLowerCase().includes('assignment')) return '/assignments';
  if (text.toLowerCase().includes('attendance')) return '/attendance';
  if (text.toLowerCase().includes('ia') || text.toLowerCase().includes('mark')) return '/iamarks';
  return '/dashboard';
}

export default function RecentActivity({ refreshKey }) {
  const [activities, setActivities] = useState(FALLBACK);
  const router = useRouter();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => {
        const raw = res.data.recentActivities;
        if (raw?.length) {
          setActivities(raw.map(text => ({
            text,
            route: routeForActivity(text),
            icon: 'ellipse',
          })));
        }
      })
      .catch(() => {});
  }, [refreshKey]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Recent Activities</Text>
        <TouchableOpacity onPress={() => router.push('/students')}>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      {activities.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.item}
          onPress={() => router.push(item.route)}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <Ionicons name={item.icon || 'ellipse'} size={14} color={Colors.primary} />
          </View>
          <Text style={styles.text} numberOfLines={2}>{item.text}</Text>
          <Ionicons name="chevron-forward" size={13} color={Colors.textMuted} />
        </TouchableOpacity>
      ))}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  viewAll: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  text: { fontSize: 13, color: Colors.textPrimary, flex: 1, marginRight: 4 },
});
