// components/custom-button.tsx

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";

import { COLORS, RADIUS } from "@/constants/theme";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: CustomButtonProps) {
  const getButtonStyle = () => {
    if (variant === "secondary") {
      return styles.secondaryButton;
    }

    if (variant === "danger") {
      return styles.dangerButton;
    }

    if (variant === "outline") {
      return styles.outlineButton;
    }

    return styles.primaryButton;
  };

  const getTextStyle = () => {
    if (variant === "outline") {
      return styles.outlineText;
    }

    return styles.buttonText;
  };

  return (
    <Pressable
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: RADIUS.medium,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
  },

  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },

  dangerButton: {
    backgroundColor: COLORS.danger,
  },

  outlineButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  disabledButton: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  outlineText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
});