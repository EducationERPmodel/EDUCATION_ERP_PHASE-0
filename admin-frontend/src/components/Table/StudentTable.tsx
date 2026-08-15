// @ts-nocheck
import React from 'react';
import {
  View, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme';
import { STATUS_COLOR_KEY } from '../../constants';
import { formatStudentId } from '../../utils/formatStudentId';

const STATUS_STYLE = {
  success: { bg: colors.successBg, text: colors.success },
  warning: { bg: colors.warningBg, text: colors.warning },
  danger: { bg: colors.dangerBg, text: colors.danger },
  muted: { bg: colors.border, text: colors.textSecondary },
};

const BASE_COLUMNS = [
  { key: 'idLabel', label: 'USN / ID', flex: 1.2 },
  { key: 'name', label: 'Student Name', flex: 1.6 },
  { key: 'departmentName', label: 'Dept', flex: 1 },
  { key: 'semester', label: 'Sem', flex: 0.6 },
  { key: 'sectionName', label: 'Sec', flex: 0.6 },
];
const STATUS_COLUMN = { key: 'status', label: 'Status', flex: 1 };

// showStatus: set to true to show the Status column (off by default - not used anywhere currently).
const StudentTable = ({ students, onRowPress, showStatus = false }) => {
  const columns = showStatus ? [...BASE_COLUMNS, STATUS_COLUMN] : BASE_COLUMNS;

  const Header = () => (
    <View style={[styles.row, styles.headerRow]}>
      {columns.map((col) => (
        <Text key={col.key} style={[styles.headerCell, { flex: col.flex }]}>{col.label}</Text>
      ))}
    </View>
  );

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => {
        const statusKey = STATUS_COLOR_KEY[item.status] || 'muted';
        const statusStyle = STATUS_STYLE[statusKey];
        return (
          <TouchableOpacity style={styles.row} onPress={() => onRowPress?.(item)}>
            <Text style={[styles.cell, { flex: columns[0].flex, color: colors.primary }]} numberOfLines={1}>
              {formatStudentId(item)}
            </Text>
            <Text style={[styles.cell, { flex: columns[1].flex }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.cell, { flex: columns[2].flex }]} numberOfLines={1}>{item.departmentName}</Text>
            <Text style={[styles.cell, { flex: columns[3].flex }]}>{item.semester}</Text>
            <Text style={[styles.cell, { flex: columns[4].flex }]}>{item.sectionName}</Text>
            {showStatus && (
              <View style={{ flex: columns[5].flex }}>
                <Chip
                  style={{ backgroundColor: statusStyle.bg, alignSelf: 'flex-start' }}
                  textStyle={{ color: statusStyle.text, fontSize: 11 }}
                  compact
                >
                  {item.status}
                </Chip>
              </View>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerRow: {
    backgroundColor: colors.background,
  },
  headerCell: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  cell: {
    ...typography.body,
    color: colors.textPrimary,
    paddingRight: spacing.xs,
  },
});

export default StudentTable;
