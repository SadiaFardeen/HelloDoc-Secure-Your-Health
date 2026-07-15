// components/message-bubble.tsx

import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { COLORS } from "../constants/theme";
import { Message } from "../data/messages";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isPatient =
    message.sender === "patient";

  return (
    <View
      style={[
        styles.wrapper,
        isPatient
          ? styles.patientWrapper
          : styles.doctorWrapper,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isPatient
            ? styles.patientBubble
            : styles.doctorBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isPatient
              ? styles.patientText
              : styles.doctorText,
          ]}
        >
          {message.text}
        </Text>

        <Text
          style={[
            styles.timeText,
            isPatient
              ? styles.patientTime
              : styles.doctorTime,
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 10,
  },

  patientWrapper: {
    alignItems: "flex-end",
  },

  doctorWrapper: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  patientBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },

  doctorBubble: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  patientText: {
    color: "#FFFFFF",
  },

  doctorText: {
    color: COLORS.textPrimary,
  },

  timeText: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },

  patientTime: {
    color: "#CCFBF1",
  },

  doctorTime: {
    color: COLORS.textMuted,
  },
});