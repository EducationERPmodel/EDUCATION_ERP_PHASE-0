import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default function DashboardHeader() {
  const today = new Date();
  return (
    <View style={styles.header}>
      <Text style={styles.welcome}>Welcome Back 👋</Text>
      <Text style={styles.sub}>Faculty Portal • {today.toDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    // Gradient approximated with a solid primary colour
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcome: { fontSize: 22, fontWeight: '800', color: Colors.white },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
});
