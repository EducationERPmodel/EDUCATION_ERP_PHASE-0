/**
 * Timetable Screen — Mr. Lokesh M
 * SVCE — Semester 4 BHASKARA (Even Semester Feb 2026 – June 2026)
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/theme/colors';

// ── Types ─────────────────────────────────────────────────────────

interface Period {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  section: string;
}

interface SubjectColor {
  bg: string;
  text: string;
  dot: string;
}

type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

// ── Constants ─────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get('window');

const SUBJECT_COLORS: Record<string, SubjectColor> = {
  'ADA':     { bg: Colors.primaryLight,  text: Colors.primary,   dot: Colors.primary   },
  'MC':      { bg: Colors.successLight,  text: Colors.success,   dot: Colors.success   },
  'DBMS':    { bg: Colors.warningLight,  text: Colors.warning,   dot: Colors.warning   },
  'DMS':     { bg: Colors.purpleLight,   text: Colors.purple,    dot: Colors.purple    },
  'BCE':     { bg: Colors.orangeLight,   text: Colors.orange,    dot: Colors.orange    },
  'GITS':    { bg: Colors.successLight,  text: Colors.success,   dot: Colors.success   },
  'UHV':     { bg: Colors.dangerLight,   text: Colors.danger,    dot: Colors.danger    },
  'PL':      { bg: Colors.background,    text: Colors.secondary, dot: Colors.secondary },
  'ADA Lab': { bg: Colors.primaryLight,  text: Colors.primary,   dot: Colors.primary   },
  'CODSL':   { bg: Colors.successLight,  text: Colors.success,   dot: Colors.success   },
  'MCL':     { bg: Colors.successLight,  text: Colors.success,   dot: Colors.success   },
  'DBMSL':   { bg: Colors.warningLight,  text: Colors.warning,   dot: Colors.warning   },
  'NSS/PT':  { bg: Colors.background,    text: Colors.textMuted, dot: Colors.textMuted },
  'CCA/ECA': { bg: Colors.background,    text: Colors.textMuted, dot: Colors.textMuted },
  'Skill/Counselling': { bg: Colors.background, text: Colors.secondary, dot: Colors.textMuted },
  'Break':   { bg: Colors.background,    text: Colors.textMuted, dot: Colors.textMuted },
  'Lunch':   { bg: Colors.background,    text: Colors.textMuted, dot: Colors.textMuted },
};

function col(subject: string): SubjectColor {
  const key = Object.keys(SUBJECT_COLORS).find(k => subject.startsWith(k));
  return key ? SUBJECT_COLORS[key] : { bg: Colors.background, text: Colors.secondary, dot: Colors.textMuted };
}

const TIMETABLE: Record<DayKey, Period[]> = {
  Mon: [
    { time: '08:45–09:45', subject: 'ADA',     teacher: 'RMA', room: 'L308',  section: 'B1+B2' },
    { time: '09:45–10:45', subject: 'DMS',     teacher: 'SKS', room: 'L308',  section: 'B1+B2' },
    { time: '10:45–11:00', subject: 'Break',   teacher: '',    room: '',       section: '' },
    { time: '11:00–13:00', subject: 'PL',      teacher: '',    room: 'Lab',   section: 'B1+B2' },
    { time: '13:00–13:45', subject: 'Lunch',   teacher: '',    room: '',       section: '' },
    { time: '13:45–14:45', subject: 'BCE',     teacher: 'SBK', room: 'L308',  section: 'B1+B2' },
    { time: '14:45–15:45', subject: 'DMS',     teacher: 'SKS', room: 'L308',  section: 'B1+B2' },
    { time: '15:45–16:15', subject: 'Skill/Counselling', teacher: '', room: '', section: '' },
  ],
  Tue: [
    { time: '08:45–09:45', subject: 'DBMS',    teacher: 'RTH', room: 'L308',  section: 'B1+B2' },
    { time: '09:45–10:45', subject: 'MC',      teacher: 'PSU', room: 'L308',  section: 'B1+B2' },
    { time: '10:45–11:00', subject: 'Break',   teacher: '',    room: '',       section: '' },
    { time: '11:00–12:00', subject: 'CODSL',   teacher: 'LKS', room: 'R312A', section: 'B1' },
    { time: '11:00–12:00', subject: 'ADA Lab', teacher: 'RMA/SKS', room: 'R312B', section: 'B2' },
    { time: '13:00–13:45', subject: 'Lunch',   teacher: '',    room: '',       section: '' },
    { time: '13:45–16:15', subject: 'PL',      teacher: '',    room: 'Lab',   section: 'B1+B2' },
    { time: '15:45–16:15', subject: 'Skill/Counselling', teacher: '', room: '', section: '' },
  ],
  Wed: [
    { time: '08:45–10:45', subject: 'PL',      teacher: '',    room: 'Lab',   section: 'B1+B2' },
    { time: '10:45–11:00', subject: 'Break',   teacher: '',    room: '',       section: '' },
    { time: '11:00–12:00', subject: 'UHV',     teacher: 'LKS', room: 'L308',  section: 'B1+B2' },
    { time: '12:00–13:00', subject: 'DMS',     teacher: 'SKS', room: 'L308',  section: 'B1+B2' },
    { time: '13:00–13:45', subject: 'Lunch',   teacher: '',    room: '',       section: '' },
    { time: '13:45–14:45', subject: 'DBMS',    teacher: 'RTH', room: 'L308',  section: 'B1+B2' },
    { time: '14:45–15:45', subject: 'GITS',    teacher: 'LKS', room: 'L308',  section: 'B1+B2' },
    { time: '15:45–16:15', subject: 'Skill/Counselling', teacher: '', room: '', section: '' },
  ],
  Thu: [
    { time: '08:45–09:45', subject: 'MC',      teacher: 'PSU', room: 'L308',  section: 'B1+B2' },
    { time: '09:45–10:45', subject: 'BCE',     teacher: 'SBK', room: 'L308',  section: 'B1+B2' },
    { time: '10:45–11:00', subject: 'Break',   teacher: '',    room: '',       section: '' },
    { time: '11:00–13:00', subject: 'PL',      teacher: '',    room: 'Lab',   section: 'B1+B2' },
    { time: '13:00–13:45', subject: 'Lunch',   teacher: '',    room: '',       section: '' },
    { time: '13:45–14:45', subject: 'ADA',     teacher: 'RMA', room: 'L308',  section: 'B1+B2' },
    { time: '14:45–15:45', subject: 'DBMS',    teacher: 'RTH', room: 'L308',  section: 'B1+B2' },
    { time: '15:45–16:15', subject: 'Skill/Counselling', teacher: '', room: '', section: '' },
  ],
  Fri: [
    { time: '08:45–09:45', subject: 'ADA',     teacher: 'RMA', room: 'L308',  section: 'B1+B2' },
    { time: '09:45–10:45', subject: 'MC',      teacher: 'PSU', room: 'L308',  section: 'B1+B2' },
    { time: '10:45–11:00', subject: 'Break',   teacher: '',    room: '',       section: '' },
    { time: '11:00–12:00', subject: 'MCL',     teacher: 'PSU/RKS', room: 'R312A', section: 'B1' },
    { time: '11:00–12:00', subject: 'DBMSL',   teacher: 'RTH/LKS', room: 'R312B', section: 'B2' },
    { time: '13:00–13:45', subject: 'Lunch',   teacher: '',    room: '',       section: '' },
    { time: '13:45–16:15', subject: 'PL',      teacher: '',    room: 'Lab',   section: 'B1+B2' },
    { time: '15:45–16:15', subject: 'Skill/Counselling', teacher: '', room: '', section: '' },
  ],
  Sat: [
    { time: '08:45–10:45', subject: 'CCA/ECA', teacher: '',    room: '',      section: '' },
    { time: '11:00–13:00', subject: 'Online Certification/Skill Enhancement', teacher: '', room: '', section: '' },
    { time: '13:45–16:15', subject: 'NSS/PT',  teacher: 'RTJ', room: '',      section: '' },
  ],
};

const STAFF: Record<string, string> = {
  RMA: 'Mr. Madhu R',
  PSU: 'Mr. Suresh P',
  RTH: 'Mrs. Ranjana Thakuria',
  SKS: 'Mr. Srikanth S',
  LKS: 'Mr. Lokesh M',
  SBK: 'Mrs. Shobhana K',
  RTJ: 'Mrs. Ranjana Thakuria',
};

const DAYS: DayKey[]                          = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL: Record<DayKey, string>        = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };
const JS_DAY: Record<number, DayKey>          = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
const BREAK_TYPES = ['Break', 'Lunch', 'NSS/PT', 'CCA/ECA', 'Skill/Counselling', 'Online Certification/Skill Enhancement'];

function parseStart(t: string): number {
  const [h, m] = t.split('–')[0].split(':').map(Number);
  return h + m / 60;
}
function nowHour(): number {
  const n = new Date();
  return n.getHours() + n.getMinutes() / 60;
}

// ── Components ────────────────────────────────────────────────────

interface SummaryCardProps { icon: string; color: string; label: string; value: string; }
function SummaryCard({ icon, color: clr, label, value }: SummaryCardProps) {
  return (
    <View style={[summaryStyles.card, { borderTopColor: clr }]}>
      <View style={[summaryStyles.iconBg, { backgroundColor: clr + '22' }]}>
        <Ionicons name={icon as any} size={18} color={clr} />
      </View>
      <Text style={[summaryStyles.value, { color: clr }]}>{value}</Text>
      <Text style={summaryStyles.label}>{label}</Text>
    </View>
  );
}

interface MetaChipProps { icon: string; text: string; }
function MetaChip({ icon, text }: MetaChipProps) {
  return (
    <View style={metaStyles.chip}>
      <Ionicons name={icon as any} size={10} color={Colors.textMuted} />
      <Text style={metaStyles.text} numberOfLines={1}>{text}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────

export default function TimetableScreen() {
  const today      = JS_DAY[new Date().getDay()] ?? 'Mon';
  const [activeDay, setActiveDay] = useState<DayKey>(today);
  const isToday   = activeDay === today;
  const now       = nowHour();

  const periods   = TIMETABLE[activeDay] ?? [];
  const teaching  = periods.filter(p => !BREAK_TYPES.includes(p.subject));
  const done      = isToday ? teaching.filter(p => now > parseStart(p.time) + 1).length : 0;
  const remaining = teaching.length - done;
  const weeklyHrs = Object.values(TIMETABLE).reduce((s, d) =>
    s + d.filter(p => !['Break', 'Lunch'].includes(p.subject)).length, 0);

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>📅 Timetable</Text>
        <Text style={styles.pageSubtitle}>Mr. Lokesh M · Sem 4 Bhaskara · Hall L308</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.summaryRow}>
          <SummaryCard icon="today-outline"            color={Colors.primary} label="Today"     value={`${teaching.length} cls`} />
          <SummaryCard icon="checkmark-circle-outline" color={Colors.success} label="Done"      value={`${done} cls`} />
          <SummaryCard icon="time-outline"             color={Colors.warning} label="Remaining" value={`${remaining} cls`} />
          <SummaryCard icon="calendar-outline"         color={Colors.purple}  label="Weekly"    value={`${weeklyHrs}`} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll} contentContainerStyle={styles.tabsContainer}>
          {DAYS.map(day => {
            const isActive   = activeDay === day;
            const isDayToday = day === today;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.tab, isActive && styles.tabActive, isDayToday && !isActive && styles.tabToday]}
                onPress={() => setActiveDay(day)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{day}</Text>
                {isDayToday && <View style={[styles.todayDot, isActive && styles.todayDotActive]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.dayHeading}>
          <Text style={styles.dayTitle}>{DAY_FULL[activeDay]}</Text>
          {isToday && <View style={styles.todayBadge}><Text style={styles.todayBadgeText}>TODAY</Text></View>}
          <Text style={styles.periodCount}>{periods.length} periods</Text>
        </View>

        <View style={styles.periodsContainer}>
          {periods.map((p, idx) => {
            if (['Break', 'Lunch'].includes(p.subject)) {
              return (
                <View key={idx} style={styles.breakRow}>
                  <View style={styles.breakLine} />
                  <Text style={styles.breakText}>{p.subject} · {p.time}</Text>
                  <View style={styles.breakLine} />
                </View>
              );
            }
            const start  = parseStart(p.time);
            const end    = start + 1;
            const status = isToday
              ? (now > end ? 'done' : now >= start ? 'now' : 'upcoming')
              : 'normal';
            const c = col(p.subject);

            return (
              <View key={idx} style={[
                styles.periodCard,
                { borderLeftColor: c.dot },
                status === 'done' && styles.cardDone,
                status === 'now'  && styles.cardNow,
              ]}>
                {status === 'now' && (
                  <View style={styles.nowBadge}><Text style={styles.nowBadgeText}>● NOW</Text></View>
                )}
                {status === 'done' && (
                  <View style={styles.doneBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                    <Text style={styles.doneBadgeText}>Done</Text>
                  </View>
                )}
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={12} color={c.dot} />
                  <Text style={[styles.timeText, { color: c.dot }]}>{p.time}</Text>
                </View>
                <View style={[styles.subjectPill, { backgroundColor: c.bg }]}>
                  <Text style={[styles.subjectText, { color: c.text }]} numberOfLines={1}>{p.subject}</Text>
                </View>
                <View style={styles.metaRow}>
                  {p.teacher && <MetaChip icon="person-outline"   text={STAFF[p.teacher] ?? p.teacher} />}
                  {p.room    && <MetaChip icon="location-outline" text={p.room} />}
                  {p.section && <MetaChip icon="people-outline"   text={p.section} />}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.staffCard}>
          <Text style={styles.staffTitle}>📋 Staff Reference — Bhaskara</Text>
          {Object.entries(STAFF).map(([init, name]) => (
            <View key={init} style={styles.staffRow}>
              <View style={styles.initBadge}><Text style={styles.initText}>{init}</Text></View>
              <Text style={styles.staffName}>{name}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  pageHeader:   { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  pageTitle:    { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  pageSubtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  scrollContent:{ paddingBottom: 20 },
  summaryRow:   { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 14, gap: 8, justifyContent: 'space-between' },
  tabsScroll:      { marginTop: 14 },
  tabsContainer:   { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  tab:             { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  tabActive:       { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabToday:        { borderColor: Colors.primary },
  tabText:         { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive:   { color: Colors.white },
  todayDot:        { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.primary, marginTop: 2 },
  todayDotActive:  { backgroundColor: Colors.white },
  dayHeading:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 14, gap: 8 },
  dayTitle:        { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  periodCount:     { fontSize: 11, color: Colors.textMuted, marginLeft: 'auto' },
  todayBadge:      { backgroundColor: Colors.primaryLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  todayBadgeText:  { fontSize: 10, fontWeight: '800', color: Colors.primary },
  periodsContainer:{ paddingHorizontal: 16, marginTop: 10, gap: 8 },
  periodCard: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 14,
    borderLeftWidth: 4, gap: 6,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  cardDone: { opacity: 0.6 },
  cardNow:  { borderWidth: 1, borderLeftWidth: 4, borderColor: Colors.primary + '55', elevation: 4, shadowOpacity: 0.12 },
  nowBadge:      { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.primaryLight, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  nowBadgeText:  { fontSize: 10, fontWeight: '800', color: Colors.primary },
  doneBadge:     { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.successLight, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  doneBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.success },
  timeRow:       { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timeText:      { fontSize: 11, fontWeight: '700' },
  subjectPill:   { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  subjectText:   { fontSize: 14, fontWeight: '700' },
  metaRow:       { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  breakRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 2 },
  breakLine:     { flex: 1, height: 1, backgroundColor: Colors.border },
  breakText:     { fontSize: 11, color: Colors.textMuted },
  staffCard: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  staffTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  staffRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  initBadge:  { width: 42, backgroundColor: Colors.primaryLight, borderRadius: 8, paddingVertical: 4, alignItems: 'center' },
  initText:   { fontSize: 12, fontWeight: '800', color: Colors.primary },
  staffName:  { fontSize: 13, color: Colors.textPrimary },
});

const summaryStyles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 12,
    padding: 10, alignItems: 'center', borderTopWidth: 3, gap: 3,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2,
  },
  iconBg: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  value:  { fontSize: 13, fontWeight: '800' },
  label:  { fontSize: 9, color: Colors.textMuted },
});

const metaStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.background, borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  text: { fontSize: 10, color: Colors.textSecondary, maxWidth: 100 },
});
