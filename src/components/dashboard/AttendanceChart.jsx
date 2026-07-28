/**
 * Custom line chart using react-native-svg (Fabric-compatible).
 * Replaces react-native-chart-kit which is incompatible with
 * React Native New Architecture (SDK 54 / Expo Go).
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText, Circle, Rect } from 'react-native-svg';
import Colors from '../../theme/colors';

const DATA = [94, 96, 91, 98, 95, 97];
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CHART_W = Dimensions.get('window').width - 64;
const CHART_H = 160;
const PAD_LEFT = 36;
const PAD_RIGHT = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 28;
const Y_MIN = 88;
const Y_MAX = 100;

function toX(i) {
  const slots = DATA.length - 1;
  return PAD_LEFT + (i / slots) * (CHART_W - PAD_LEFT - PAD_RIGHT);
}

function toY(value) {
  const ratio = (value - Y_MIN) / (Y_MAX - Y_MIN);
  return CHART_H - PAD_BOTTOM - ratio * (CHART_H - PAD_TOP - PAD_BOTTOM);
}

const points = DATA.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

export default function AttendanceChart() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Attendance Report</Text>
      <Svg width={CHART_W} height={CHART_H}>
        {/* Horizontal grid lines */}
        {[88, 92, 96, 100].map((y) => (
          <Line
            key={y}
            x1={PAD_LEFT}
            y1={toY(y)}
            x2={CHART_W - PAD_RIGHT}
            y2={toY(y)}
            stroke={Colors.border}
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {[88, 92, 96, 100].map((y) => (
          <SvgText
            key={y}
            x={PAD_LEFT - 4}
            y={toY(y) + 4}
            fontSize="9"
            fill={Colors.textMuted}
            textAnchor="end"
          >
            {y}%
          </SvgText>
        ))}

        {/* Line */}
        <Polyline
          points={points}
          fill="none"
          stroke={Colors.primary}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Filled area under line */}
        <Polyline
          points={`${toX(0)},${CHART_H - PAD_BOTTOM} ${points} ${toX(DATA.length - 1)},${CHART_H - PAD_BOTTOM}`}
          fill={Colors.primary + '22'}
          stroke="none"
        />

        {/* Data points */}
        {DATA.map((v, i) => (
          <Circle
            key={i}
            cx={toX(i)}
            cy={toY(v)}
            r="4"
            fill={Colors.white}
            stroke={Colors.primary}
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {LABELS.map((label, i) => (
          <SvgText
            key={i}
            x={toX(i)}
            y={CHART_H - 6}
            fontSize="10"
            fill={Colors.textSecondary}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>Attendance %</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
