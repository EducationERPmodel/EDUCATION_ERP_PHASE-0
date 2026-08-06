import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import DashboardHeader     from '../../src/components/dashboard/DashboardHeader';
import QuickStats          from '../../src/components/dashboard/QuickStats';
import AttendanceSummary   from '../../src/components/dashboard/AttendanceSummary';
import AttendanceChart     from '../../src/components/dashboard/AttendanceChart';
import PendingAssignments  from '../../src/components/dashboard/PendingAssignments';
import IAStats             from '../../src/components/dashboard/IAStats';
import RecentActivity      from '../../src/components/dashboard/RecentActivity';
import TodaysClasses       from '../../src/components/dashboard/TodaysClasses';
import Colors from '../../src/theme/colors';

export default function DashboardScreen() {
  const [refreshKey, setRefreshKey]   = useState(0);
  const [refreshing, setRefreshing]   = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey(k => k + 1);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  useFocusEffect(
    useCallback(() => { setRefreshKey(k => k + 1); }, [])
  );

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {/* ── Welcome + Quick Actions ───────────────────────── */}
      <DashboardHeader />

      {/* ── 4 stat cards ─────────────────────────────────── */}
      <QuickStats refreshKey={refreshKey} />

      {/* ── Today's attendance summary ────────────────────── */}
      <AttendanceSummary refreshKey={refreshKey} />

      {/* ── Weekly attendance graph ───────────────────────── */}
      <AttendanceChart refreshKey={refreshKey} />

      {/* ── Pending assignments + IA stats ───────────────── */}
      <View style={styles.row}>
        <View style={styles.half}>
          <PendingAssignments refreshKey={refreshKey} />
        </View>
        <View style={styles.half}>
          <IAStats refreshKey={refreshKey} />
        </View>
      </View>

      {/* ── Today's classes + Recent activity ────────────── */}
      <View style={styles.row}>
        <View style={styles.half}>
          <TodaysClasses />
        </View>
        <View style={styles.half}>
          <RecentActivity refreshKey={refreshKey} />
        </View>
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:    { flex: 1, backgroundColor: Colors.background },
  content:   { paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 12,
  },
  half:      { flex: 1 },
  bottomPad: { height: 30 },
});
