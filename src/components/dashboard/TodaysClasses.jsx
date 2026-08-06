/**
 * TodaysClasses — real SVCE Semester 4 Bhaskara schedule.
 * Shows NOW / done / upcoming states automatically.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../theme/colors';

// Bhaskara section teaching periods (no breaks/lunch)
const TIMETABLE = {
  Mon: [
    { time: '08:45–09:45', subject: 'ADA',  room: 'L308' },
    { time: '09:45–10:45', subject: 'DMS',  room: 'L308' },
    { time: '11:00–13:00', subject: 'PL',   room: 'Lab' },
    { time: '13:45–14:45', subject: 'BCE',  room: 'L308' },
    { time: '14:45–15:45', subject: 'DMS',  room: 'L308' },
  ],
  Tue: [
    { time: '08:45–09:45', subject: 'DBMS', room: 'L308' },
    { time: '09:45–10:45', subject: 'MC',   room: 'L308' },
    { time: '11:00–12:00', subject: 'CODSL/ADA Lab', room: 'R312' },
    { time: '13:45–16:15', subject: 'PL',   room: 'Lab' },
  ],
  Wed: [
    { time: '08:45–10:45', subject: 'PL',   room: 'Lab' },
    { time: '11:00–12:00', subject: 'UHV',  room: 'L308' },
    { time: '12:00–13:00', subject: 'DMS',  room: 'L308' },
    { time: '13:45–14:45', subject: 'DBMS', room: 'L308' },
    { time: '14:45–15:45', subject: 'GITS', room: 'L308' },
  ],
  Thu: [
    { time: '08:45–09:45', subject: 'MC',   room: 'L308' },
    { time: '09:45–10:45', subject: 'BCE',  room: 'L308' },
    { time: '11:00–13:00', subject: 'PL',   room: 'Lab' },
    { time: '13:45–14:45', subject: 'ADA',  room: 'L308' },
    { time: '14:45–15:45', subject: 'DBMS', room: 'L308' },
  ],
  Fri: [
    { time: '08:45–09:45', subject: 'ADA',  room: 'L308' },
    { time: '09:45–10:45', subject: 'MC',   room: 'L308' },
    { time: '11:00–12:00', subject: 'MCL/DBMSL', room: 'R312' },
    { time: '13:45–16:15', subject: 'PL',   room: 'Lab' },
  ],
  Sat: [
    { time: '08:45–10:45', subject: 'CCA/ECA',  room: '' },
    { time: '13:45–16:15', subject: 'NSS/PT',   room: '' },
  ],
};

const JS_DAY = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };

const SUBJECT_COLORS = {
  'ADA':   Colors.primary,
  'DBMS':  Colors.warning,
  'DMS':   Colors.purple,
  'MC':    Colors.success,
  'BCE':   Colors.orange,
  'GITS':  '#15803D',
  'UHV':   '#BE185D',
  'PL':    Colors.secondary,
};

function subjectColor(s) {
  return Object.keys(SUBJECT_COLORS).find(k => s.startsWith(k))
    ? SUBJECT_COLORS[Object.keys(SUBJECT_COLORS).find(k => s.startsWith(k))]
    : Colors.primary;
}

function parseStart(t) {
  const [h, m] = t.split('–')[0].split(':').map(Number);
  return h + m / 60;
}

export default function TodaysClasses() {
  const router    = useRouter();
  const now       = new Date();
  const dayKey    = JS_DAY[now.getDay()] || 'Mon';
  const nowHour   = now.getHours() + now.getMinutes() / 60;
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 6;

  const classes = useMemo(() => {
    const raw = (TIMETABLE[dayKey] || []).slice(0, 4);
    return raw.map(c => {
      const s = parseStart(c.time);
      const status = nowHour > s + 1 ? 'done' : nowHour >= s ? 'now' : 'upcoming';
      return { ...c, status };
    });
  }, [dayKey, nowHour]);

  const doneCount     = classes.filter(c => c.status === 'done').length;
  const upcomingCount = classes.filter(c => c.status === 'upcoming').length;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Today's Classes</Text>
        <TouchableOpacity onPress={() => router.push('/timetable')}>
          <Text style={styles.viewAll}>Full →</Text>
        </TouchableOpacity>
      </View>

      {isWeekday && classes.length > 0 && (
        <View style={styles.miniSummary}>
          <View style={[styles.miniBadge, { backgroundColor: Colors.successLight }]}>
            <Text style={[styles.miniBadgeText, { color: Colors.success }]}>✓ {doneCount} done</Text>
          </View>
          <View style={[styles.miniBadge, { backgroundColor: Colors.primaryLight }]}>
            <Text style={[styles.miniBadgeText, { color: Colors.primary }]}>{upcomingCount} left</Text>
          </View>
        </View>
      )}

      {!isWeekday ? (
        <View style={styles.holiday}>
          <Text style={styles.holidayEmoji}>🌴</Text>
          <Text style={styles.holidayText}>Sunday — No Classes</Text>
        </View>
      ) : classes.length === 0 ? (
        <Text style={styles.noClass}>No classes scheduled today</Text>
      ) : (
        classes.map((item, idx) => {
          const dotColor = subjectColor(item.subject);
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.row, item.status === 'done' && styles.rowDone]}
              onPress={() => router.push('/timetable')}
              activeOpacity={0.7}
            >
              <View style={[styles.dot, { backgroundColor: item.status === 'done' ? Colors.border : dotColor }]} />
              <View style={styles.details}>
                <Text style={[styles.subject, item.status === 'done' && styles.subjectDone]} numberOfLines={1}>
                  {item.subject}
                </Text>
                <Text style={styles.meta}>{item.time}{item.room ? ` · ${item.room}` : ''}</Text>
              </View>
              {item.status === 'now' && (
                <View style={[styles.nowPill, { backgroundColor: dotColor + '20' }]}>
                  <Text style={[styles.nowText, { color: dotColor }]}>● NOW</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5,
    flex: 1, marginTop: 12,
  },
  headerRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heading:       { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  viewAll:       { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  miniSummary:   { flexDirection: 'row', gap: 6, marginBottom: 10 },
  miniBadge:     { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  miniBadgeText: { fontSize: 10, fontWeight: '700' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 8,
  },
  rowDone:      { opacity: 0.5 },
  dot:          { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  details:      { flex: 1 },
  subject:      { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  subjectDone:  { textDecorationLine: 'line-through', color: Colors.textMuted },
  meta:         { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  nowPill:      { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  nowText:      { fontSize: 9, fontWeight: '800' },
  holiday:      { alignItems: 'center', paddingVertical: 16, gap: 4 },
  holidayEmoji: { fontSize: 28 },
  holidayText:  { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  noClass:      { fontSize: 12, color: Colors.textMuted, textAlign: 'center', paddingVertical: 12 },
});
