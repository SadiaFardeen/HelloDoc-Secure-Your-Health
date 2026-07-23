import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MessageBubble from "../../../components/message-bubble";
import { COLORS } from "../../../constants/theme";
import { INITIAL_MESSAGES, Message } from "../../../data/messages";

export default function ConsultationChatScreen() {
  const params = useLocalSearchParams();

  const isDoctorView = params.role === "doctor";
  const patientName = (Array.isArray(params.name) ? params.name[0] : params.name) || "Rahim Ahmed";

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const listReference = useRef<FlatList<Message>>(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = () => {
    const cleanedMessage = messageText.trim();
    if (cleanedMessage.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: isDoctorView ? "doctor" : "patient",
      text: cleanedMessage,
      time: getCurrentTime(),
    };

    setMessages((previousMessages) => [...previousMessages, newMessage]);
    setMessageText("");
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isTyping) return;

    const timeout = setTimeout(() => {
      const autoReplyMessage: Message = {
        id: Date.now().toString(),
        sender: isDoctorView ? "patient" : "doctor",
        text: isDoctorView
          ? "Thank you Doctor. I am taking the prescribed medicine regularly."
          : "Thank you for sharing that. How long have you been experiencing this problem?",
        time: getCurrentTime(),
      };

      setMessages((previousMessages) => [...previousMessages, autoReplyMessage]);
      setIsTyping(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isTyping, isDoctorView]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      listReference.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <View style={styles.header}>
          <Text style={styles.headerBackText} onPress={() => router.back()}>
            ‹ Back
          </Text>

          <View style={styles.headerInformation}>
            <Text style={styles.doctorName}>
              {isDoctorView ? patientName : "Dr. Farhana Rahman"}
            </Text>

            <Text style={styles.onlineText}>● Online</Text>
          </View>
        </View>

        <FlatList
          ref={listReference}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>
                  {isDoctorView ? patientName : "Doctor"} is typing...
                </Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Write your message..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              maxLength={500}
            />

            <Pressable
              style={[
                styles.sendButton,
                messageText.trim().length === 0 && styles.disabledButton,
              ]}
              onPress={handleSendMessage}
              disabled={messageText.trim().length === 0}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>

          <Text style={styles.characterCount}>{messageText.length}/500</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  keyboardContainer: { flex: 1 },
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
  headerInformation: { flex: 1 },
  doctorName: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },
  onlineText: { fontSize: 11, fontWeight: "600", color: "#86EFAC", marginTop: 3 },
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
  typingText: { fontSize: 12, fontStyle: "italic", color: COLORS.textSecondary },
  inputSection: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  inputRow: { flexDirection: "row", alignItems: "flex-end" },
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
  disabledButton: { backgroundColor: COLORS.disabled },
  sendText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
  characterCount: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 5,
    marginLeft: 4,
  },
});