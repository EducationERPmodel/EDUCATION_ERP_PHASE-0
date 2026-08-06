/**
 * AttendanceChart — Weekly Attendance Graph
 *
 * Fetches real data from GET /dashboard/weekly-attendance
 * Renders a bar chart using react-native-svg (Fabric-compatible, SDK 54).
 * Falls back to placeholder bars while loading.
 *
 * Features:
 *  - Live data from PostgreSQL attendance table
 *  - 7-day view (Mon–Sun of current week)
 *  - Per-day Present/Total/% tooltip row
 *  - Colour-coded bars (green ≥75%, amber 50-74%, red <50%)
 *  - Auto-refreshes every time screen gains focus via prop
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import Svg, {
  Rect, Line, Text as SvgText, Defs, LinearGradient, Stop, G,
} from 'react-native-svg';
import api from '../../services/api';
import Colors from '../../theme/colors';

// ── Chart constants ────────────────────────────────────────────────
const SCREEN_W   = Dimensions.get('window').width;
const CARD_PAD   = 32;          // card left+right padding (16 each)
const CHART_W    = SCREEN_W - CARD_PAD - 16;
const CHART_H    = 170;
const PAD_LEFT   = 32;          // space for y-axis labels
const PAD_RIGHT  = 8;
const PAD_TOP    = 10;
const PAD_BOTTOM = 30;          // space for x-axis labels
const PLOT_W     = CHART_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H     = CHART_H - PAD_TOP - PAD_BOTTOM;
const Y_TICKS    = [0, 25, 50, 75, 100];

function barColor(pct) {
  if (pct >= 75) return Colors.success;
  if (pct >= 50) return Colors.warning;
  if (pct === 0) return Colors.border;
  return Colors.danger;
}

function toY(pct) {
  return PAD_TOP + PLOT_H * (1 - pct / 100);
}

export default function AttendanceChart({ refreshKey }) {
  const [data, setData]       = useState(null);   // null = loading
  const [selected, setSelected] = useState(null); // index of tapped bar
  const [error, setError]     = useState(false);

  const fetchData = useCallback(() => {
    setData(null);
    setError(false);
    api.get('/dashboard/weekly-attendance')
      .then(res => {
        setData(res.data);
        // Auto-select today
        const todayIdx = res.data.findIndex(
          d => d.date === new Date().toISOString().split('T')[0]
        );
        setSelected(todayIdx >= 0 ? todayIdx : res.data.length - 1);
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData, refreshKey]);

  // ── Loading state ──────────────────────────────────────────────
  if (data === null && !error) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>📊 Weekly Attendance</Text>
        <View style={styles.loadingBox}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.loadingText}>Loading attendance data...</Text>
        </View>
      </View>
    );
  }

  // ── Error state ────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>📊 Weekly Attendance</Text>
        <View style={styles.loadingBox}>
          <Text style={styles.errorText}>Could not load data.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Calculate layout ───────────────────────────────────────────
  const n       = data.length;           // always 7
  const barW    = Math.floor(PLOT_W / n * 0.55);
  const gap     = PLOT_W / n;
  const selDay  = selected !== null ? data[selected] : null;

  // Weekly summary
  const totalPresent = data.reduce((s, d) => s + d.present, 0);
  const totalAll     = data.reduce((s, d) => s + d.total, 0);
  const weekPct      = totalAll > 0 ? Math.round((totalPresent / totalAll) * 100) : 0;
  const activeDays   = data.filter(d => d.total > 0).length;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>📊 Weekly Attendance</Text>
          <Text style={styles.subtitle}>Last 7 days • Live data</Text>
        </View>
        <View style={[styles.weekBadge, { backgroundColor: barColor(weekPct) + '22' }]}>
          <Text style={[styles.weekPct, { color: barColor(weekPct) }]}>{weekPct}%</Text>
          <Text style={styles.weekLabel}>This Week</Text>
        </View>
      </View>

      {/* Selected day callout */}
      {selDay && (
        <View style={[styles.callout, { borderLeftColor: barColor(selDay.percent) }]}>
          <Text style={styles.calloutDay}>{selDay.day} {selDay.date}</Text>
          <Text style={[styles.calloutPct, { color: barColor(selDay.percent) }]}>
            {selDay.percent}%
          </Text>
          <Text style={styles.calloutSub}>
            {selDay.total > 0
              ? `${selDay.present} present / ${selDay.total} total`
              : 'No class recorded'}
          </Text>
        </View>
      )}

      {/* Bar chart */}
      <Svg width={CHART_W} height={CHART_H}>
        <Defs>
          <LinearGradient id="grad-green"  x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.success}  stopOpacity="0.9" />
            <Stop offset="1" stopColor={Colors.success}  stopOpacity="0.5" />
          </LinearGradient>
          <LinearGradient id="grad-amber"  x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.warning}  stopOpacity="0.9" />
            <Stop offset="1" stopColor={Colors.warning}  stopOpacity="0.5" />
          </LinearGradient>
          <LinearGradient id="grad-red"    x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.danger}   stopOpacity="0.9" />
            <Stop offset="1" stopColor={Colors.danger}   stopOpacity="0.5" />
          </LinearGradient>
          <LinearGradient id="grad-empty" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.border}   stopOpacity="0.7" />
            <Stop offset="1" stopColor={Colors.border}   stopOpacity="0.3" />
          </LinearGradient>
        </Defs>

        {/* Y-axis grid lines + labels */}
        {Y_TICKS.map(tick => {
          const y = toY(tick);
          return (
            <React.Fragment key={tick}>
              <Line
                x1={PAD_LEFT} y1={y}
                x2={CHART_W - PAD_RIGHT} y2={y}
                stroke={tick === 0 ? Colors.border : Colors.border + '88'}
                strokeWidth={tick === 0 ? 1.5 : 0.8}
                strokeDasharray={tick === 0 ? '' : '3,3'}
              />
              <SvgText
                x={PAD_LEFT - 4} y={y + 4}
                fontSize="9" fill={Colors.textMuted} textAnchor="end"
              >
                {tick}%
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const cx      = PAD_LEFT + gap * i + gap / 2;
          const barH    = Math.max(d.percent === 0 ? 3 : 0, (d.percent / 100) * PLOT_H);
          const x       = cx - barW / 2;
          const y       = toY(d.percent);
          const isToday = d.date === new Date().toISOString().split('T')[0];
          const isSel   = selected === i;

          const gradId = d.percent >= 75 ? 'grad-green'
            : d.percent >= 50 ? 'grad-amber'
            : d.percent === 0  ? 'grad-empty'
            : 'grad-red';

          return (
            <G key={d.date} onPress={() => setSelected(i)}>
              {/* Hit-area (full column height) */}
              <Rect
                x={x - 4} y={PAD_TOP}
                width={barW + 8} height={PLOT_H}
                fill="transparent"
              />
              {/* Bar background track */}
              <Rect
                x={x} y={PAD_TOP}
                width={barW} height={PLOT_H}
                rx={5} ry={5}
                fill={Colors.border + '44'}
              />
              {/* Actual bar */}
              <Rect
                x={x} y={y}
                width={barW} height={barH}
                rx={5} ry={5}
                fill={`url(#${gradId})`}
              />
              {/* Selection ring */}
              {isSel && (
                <Rect
                  x={x - 2} y={PAD_TOP - 2}
                  width={barW + 4} height={PLOT_H + 4}
                  rx={6} ry={6}
                  fill="none"
                  stroke={barColor(d.percent)}
                  strokeWidth={1.5}
                />
              )}
              {/* % label above bar */}
              {d.percent > 0 && (
                <SvgText
                  x={cx} y={y - 4}
                  fontSize="9" fill={barColor(d.percent)}
                  textAnchor="middle" fontWeight="bold"
                >
                  {d.percent}%
                </SvgText>
              )}
              {/* X-axis day label */}
              <SvgText
                x={cx} y={CHART_H - 8}
                fontSize="10"
                fill={isToday ? Colors.primary : Colors.textSecondary}
                fontWeight={isToday ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {d.day}
              </SvgText>
              {/* Today dot */}
              {isToday && (
                <Rect
                  x={cx - 3} y={CHART_H - 5}
                  width={6} height={3} rx={1.5}
                  fill={Colors.primary}
                />
              )}
            </G>
          );
        })}
      </Svg>

      {/* Legend + summary row */}
      <View style={styles.legendRow}>
        <LegendDot color={Colors.success}  label="≥75%" />
        <LegendDot color={Colors.warning}  label="50–74%" />
        <LegendDot color={Colors.danger}   label="<50%" />
        <LegendDot color={Colors.border}   label="No class" />
        <View style={styles.spacer} />
        <Text style={styles.summaryText}>
          {activeDays}/7 days recorded
        </Text>
      </View>
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title:    { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  weekBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  weekPct:   { fontSize: 18, fontWeight: '800' },
  weekLabel: { fontSize: 9,  color: Colors.textMuted, marginTop: 1 },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    gap: 12,
  },
  calloutDay:  { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  calloutPct:  { fontSize: 18, fontWeight: '800' },
  calloutSub:  { fontSize: 11, color: Colors.textMuted, flex: 1.5, textAlign: 'right' },
  loadingBox:  { height: 150, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, color: Colors.textSecondary },
  errorText:   { fontSize: 13, color: Colors.danger },
  retryBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot:         { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 10, color: Colors.textSecondary },
  spacer:      { flex: 1 },
  summaryText: { fontSize: 10, color: Colors.textMuted },
});
