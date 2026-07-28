import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

export default function TopNavbar({ onMenuPress, title = 'Faculty Dashboard' }) {
  const insets = useSafeAreaInsets();
  // On Android, status bar height comes from insets.top.
  // Fall back to sensible default if provider not ready yet.
  const topPad = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? 28 : 20);

  return (
    <View style={[styles.navbar, { paddingTop: topPad }]}>
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="menu" size={26} color={Colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.right}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={Colors.textPrimary}
          style={styles.bellIcon}
        />
        <Ionicons name="person-circle-outline" size={28} color={Colors.textPrimary} />
        <Text style={styles.facultyLabel}>Faculty</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: Colors.navbarBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    zIndex: 10,
  },
  menuBtn: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    marginRight: 12,
  },
  facultyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
});
