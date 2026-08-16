// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Sidebar from '../components/Sidebar/Sidebar';
import { colors } from '../theme';

// Wrap any screen's content with this to get the persistent left sidebar.
// activeScreen must match one of the route names in AppNavigator so the
// matching nav item highlights correctly.
const ScreenLayout = ({ navigation, activeScreen, children }) => (
  <View style={styles.row}>
    <Sidebar navigation={navigation} activeScreen={activeScreen} />
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

export default ScreenLayout;
