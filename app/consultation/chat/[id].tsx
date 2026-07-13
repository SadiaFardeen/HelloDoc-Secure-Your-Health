// app/consultation/chat/[id].tsx

import {
    router,
    useLocalSearchParams,
} from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import MessageBubble from "../../../components/message-bubble";
import { COLORS } from "../../../constants/theme";
import { DOCTORS } from "../../../data/doctors";

import {
    INITIAL_MESSAGES,
    Message,
} from "../../../data/messages";

export default function ConsultationChatScreen() {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const doctor = DOCTORS.find(
    (item) => item.id === id
  );

  const [messages, setMessages] =
    useState<Message[]>(INITIAL_MESSAGES);

  const [messageText, setMessageText] =
    useState("");

  const [isDoctorTyping, setIsDoctorTyping] =
    useState(false);

  const listReference =
    useRef<FlatList<Message>>(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = () => {
    const cleanedMessage = messageText.trim();

    if (cleanedMessage.length === 0) {
      return;
    }

    const patientMessage: Message = {
      id: Date.now().toString(),
      sender: "patient",
      text: cleanedMessage,
      time: getCurrentTime(),
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      patientMessage,
    ]);

    setMessageText("");
    setIsDoctorTyping(true);
  };

  useEffect(() => {
    if (!isDoctorTyping) {
      return;
    }

    const timeout = setTimeout(() => {
      const doctorMessage: Message = {
        id: Date.now().toString(),
        sender: "doctor",
        text:
          "Thank you for sharing that. How long have you been experiencing this problem?",
        time: getCurrentTime(),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        doctorMessage,
      ]);

      setIsDoctorTyping(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDoctorTyping]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      listReference.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [messages]);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>
            Doctor not found
          </Text>

          <Text
            style={styles.backText}
            onPress={() => router.back()}
          >
            Go Back
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* Chat Header */}

        <View style={styles.header}>
          <Text
            style={styles.headerBackText}
            onPress={() => router.back()}
          >
            ‹ Back
          </Text>

          <View style={styles.headerInformation}>
            <Text style={styles.doctorName}>
              {doctor.name}
            </Text>

            <Text style={styles.onlineText}>
              ● Online
            </Text>
          </View>
        </View>

        {/* Message List */}

        <FlatList
          ref={listReference}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} />
          )}
          contentContainerStyle={
            styles.messageList
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isDoctorTyping ? (
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>
                  {doctor.name} is typing...
                </Text>
              </View>
            ) : null
          }
        />

        {/* Message Input */}

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Write your message..."
              placeholderTextColor={
                COLORS.textMuted
              }
              multiline
              maxLength={500}
            />

            <Pressable
              style={[
                styles.sendButton,
                messageText.trim().length === 0 &&
                  styles.disabledButton,
              ]}
              onPress={handleSendMessage}
              disabled={
                messageText.trim().length === 0
              }
            >
              <Text style={styles.sendText}>
                Send
              </Text>
            </Pressable>
          </View>

          <Text style={styles.characterCount}>
            {messageText.length}/500
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  headerBackText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#CCFBF1",
    marginRight: 16,
  },

  headerInformation: {
    flex: 1,
  },

  doctorName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  onlineText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#86EFAC",
    marginTop: 3,
  },

  messageList: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 12,
  },

  typingBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },

  typingText: {
    fontSize: 12,
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },

  inputSection: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlignVertical: "top",
  },

  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 14,
    marginLeft: 8,
  },

  disabledButton: {
    backgroundColor: COLORS.disabled,
  },

  sendText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  characterCount: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 5,
    marginLeft: 4,
  },

  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  backText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 14,
  },
});