import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../theme/colors';

interface QuickAction {
  label: string;
  icon: string;
  route: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Attendance', icon: 'checkbox-outline',      route: '/attendance' },
  { label: 'Students',   icon: 'people-outline',         route: '/students' },
  { label: 'IA Marks',   icon: 'bar-chart-outline',      route: '/iamarks' },
  { label: 'AI Check',   icon: 'hardware-chip-outline',  route: '/aichecker' },
];

export default function DashboardHeader() {
  const router = useRouter();
  const today  = new Date();

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.welcome}>Welcome Back, Lokesh 👋</Text>
          <Text style={styles.sub}>Faculty Portal • {today.toDateString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push('/profile')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="person-circle-outline" size={38} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.route}
            style={styles.actionBtn}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.75}
          >
            <Ionicons name={action.icon as any} size={20} color={Colors.primary} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 16, padding: 20, borderRadius: 18,
    backgroundColor: Colors.primary,
    elevation: 5, shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10,
  },
  topRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  welcome:     { fontSize: 20, fontWeight: '800', color: Colors.white },
  sub:         { fontSize: 12, color: 'rgba(255,255,255,0.80)', marginTop: 3 },
  profileBtn:  { padding: 2 },
  actionsRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: {
    flex: 1, marginHorizontal: 4, backgroundColor: Colors.white,
    borderRadius: 12, paddingVertical: 10, alignItems: 'center', gap: 4,
  },
  actionLabel: { fontSize: 10, fontWeight: '700', color: Colors.primary, textAlign: 'center' },
});
