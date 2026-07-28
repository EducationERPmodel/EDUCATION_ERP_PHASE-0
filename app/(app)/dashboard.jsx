import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import DashboardHeader from '../../src/components/dashboard/DashboardHeader';
import QuickStats from '../../src/components/dashboard/QuickStats';
import AttendanceChart from '../../src/components/dashboard/AttendanceChart';
import RecentActivity from '../../src/components/dashboard/RecentActivity';
import TodaysClasses from '../../src/components/dashboard/TodaysClasses';
import Colors from '../../src/theme/colors';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <DashboardHeader />
      <QuickStats />
      <AttendanceChart />
      <View style={styles.row}>
        <View style={styles.half}>
          <RecentActivity />
        </View>
        <View style={styles.half}>
          <TodaysClasses />
        </View>
      </View>
      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 4,
  },
  half: { flex: 1 },
  bottomPad: { height: 30 },
});
