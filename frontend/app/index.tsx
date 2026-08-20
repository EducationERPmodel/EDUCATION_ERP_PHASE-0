import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../src/components/common/Navbar';
import Hero from '../src/components/home/Hero';
import Stats from '../src/components/home/Stats';
import Features from '../src/components/home/Features';
import Colors from '../src/theme/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Navbar />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Hero />
        <Stats />
        <Features />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1, backgroundColor: Colors.background },
});
