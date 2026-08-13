import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import TopNavbar from '../../src/components/common/TopNavbar';
import Sidebar from '../../src/components/common/Sidebar';
import Colors from '../../src/theme/colors';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TopNavbar onMenuPress={() => setSidebarOpen(true)} />
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content:   { flex: 1 },
});
