import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

function getLevel(score) {
  if (score >= 80) return { label: 'High Similarity', bg: Colors.dangerLight, color: Colors.danger, barColor: Colors.danger };
  if (score >= 50) return { label: 'Moderate Similarity', bg: Colors.warningLight, color: Colors.warning, barColor: Colors.warning };
  return { label: 'Low Similarity', bg: Colors.successLight, color: Colors.success, barColor: Colors.success };
}

export default function SimilarityResult({ score }) {
  if (score === null) return null;
  const level = getLevel(score);

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Similarity Analysis</Text>
      <View style={[styles.alert, { backgroundColor: level.bg }]}>
        <Text style={[styles.alertLabel, { color: level.color }]}>{level.label}</Text>
        <Text style={[styles.alertScore, { color: level.color }]}>Similarity Score: {score}%</Text>
      </View>
      {/* Progress bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${score}%`, backgroundColor: level.barColor }]}>
          <Text style={styles.barText}>{score}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 18, marginBottom: 14,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5,
  },
  heading: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  alert: { borderRadius: 10, padding: 14, marginBottom: 14 },
  alertLabel: { fontSize: 15, fontWeight: '700' },
  alertScore: { fontSize: 13, marginTop: 4 },
  barBg: { height: 28, backgroundColor: Colors.border, borderRadius: 14, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 14, justifyContent: 'center', alignItems: 'center', minWidth: 36 },
  barText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
});
