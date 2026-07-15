import {
    Pressable,
    StyleSheet,
    Text,
} from "react-native";

import {
    COLORS,
    RADIUS,
} from "../constants/theme";

interface CategoryChipProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

export default function CategoryChip({
  title,
  selected,
  onPress,
}: CategoryChipProps) {
  return (
    <Pressable
      style={[
        styles.chip,
        selected && styles.selectedChip,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          selected && styles.selectedText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.round,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
  },

  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  text: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  selectedText: {
    color: "#FFFFFF",
  },
});