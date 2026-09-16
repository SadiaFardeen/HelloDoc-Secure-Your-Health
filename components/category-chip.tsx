import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, selected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
  },
  selectedChip: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  selectedLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
});