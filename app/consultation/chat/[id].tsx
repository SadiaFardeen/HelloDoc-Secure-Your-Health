import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export default function ChatScreen() {
  const {
    doctorId,
    patientId,
    currentUserId,
    targetName,
  } = useLocalSearchParams<{
    id?: string;
    doctorId?: string;
    patientId?: string;
    currentUserId?: string;
    targetName?: string;
  }>();
  const router = useRouter();
  const listRef = useRef<FlatList<ChatMessage> | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const roomKey =
    doctorId && patientId
      ? `@hellodoc/chat-v1/doctor-${doctorId}/patient-${patientId}`
      : null;

  const loadChatHistory = useCallback(async () => {
    if (!roomKey) {
      setIsLoading(false);
      return;
    }

    try {
      const savedMessages = await AsyncStorage.getItem(roomKey);
      const parsed: unknown = savedMessages ? JSON.parse(savedMessages) : [];
      if (Array.isArray(parsed)) {
        setMessages(parsed as ChatMessage[]);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, [roomKey]);

  useEffect(() => {
    void loadChatHistory();

    const interval = setInterval(() => {
      void loadChatHistory();
    }, 1200);

    return () => clearInterval(interval);
  }, [loadChatHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages.length]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !roomKey || !currentUserId) {
      return;
    }

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      senderId: currentUserId,
      text,
      sentAt: new Date().toISOString(),
    };

    setInputText("");

    try {
      const latestValue = await AsyncStorage.getItem(roomKey);
      const latestParsed: unknown = latestValue ? JSON.parse(latestValue) : [];
      const latestMessages = Array.isArray(latestParsed)
        ? (latestParsed as ChatMessage[])
        : [];
      const updatedMessages = [...latestMessages, newMessage];

      setMessages(updatedMessages);
      await AsyncStorage.setItem(roomKey, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Failed to save message:", error);
      setMessages((previous) => [...previous, newMessage]);
    }
  };

  if (!doctorId || !patientId || !currentUserId || !roomKey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.invalidRoom}>
          <Text style={styles.invalidRoomTitle}>Chat room unavailable</Text>
          <Text style={styles.invalidRoomText}>
            Open chat from an appointment card on a dashboard.
          </Text>
          <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
            <Text style={styles.returnButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTextArea}>
          <Text style={styles.headerTitle}>{targetName || "Consultation Chat"}</Text>
          <Text style={styles.headerSubtitle}>Saved on this device</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.chatArea}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item: ChatMessage) => item.id}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }: { item: ChatMessage }) => {
            const isMe = item.senderId === currentUserId;
            return (
              <View
                style={[
                  styles.messageBubble,
                  isMe ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.myMessageText : styles.theirMessageText,
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    isMe ? styles.myTimeText : styles.theirTimeText,
                  ]}
                >
                  {new Date(item.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {isLoading ? "Loading chat..." : "No messages yet. Start the conversation."}
            </Text>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { minHeight: 64, backgroundColor: "#0D1F4E", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10 },
  backButton: { paddingRight: 16, paddingVertical: 8 },
  backButtonText: { color: "#38BDF8", fontSize: 16, fontWeight: "600" },
  headerTextArea: { flex: 1 },
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { color: "#CBD5E1", fontSize: 11, marginTop: 2 },
  chatArea: { flex: 1 },
  messageList: { flexGrow: 1, padding: 16, paddingBottom: 10 },
  messageBubble: { maxWidth: "80%", padding: 12, borderRadius: 14, marginBottom: 10 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#0D9488", borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: "flex-start", backgroundColor: "#E2E8F0", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20 },
  myMessageText: { color: "#FFFFFF" },
  theirMessageText: { color: "#1E293B" },
  timeText: { fontSize: 10, marginTop: 5, alignSelf: "flex-end" },
  myTimeText: { color: "#CCFBF1" },
  theirTimeText: { color: "#64748B" },
  emptyText: { textAlign: "center", color: "#94A3B8", marginTop: 50 },
  inputContainer: { flexDirection: "row", alignItems: "flex-end", padding: 12, borderTopWidth: 1, borderTopColor: "#E2E8F0", backgroundColor: "#FFFFFF" },
  input: { flex: 1, maxHeight: 110, minHeight: 44, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: "#0F172A" },
  sendButton: { backgroundColor: "#0D9488", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 22, marginLeft: 8 },
  disabledSendButton: { backgroundColor: "#94A3B8" },
  sendButtonText: { color: "#FFFFFF", fontWeight: "bold" },
  invalidRoom: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  invalidRoomTitle: { fontSize: 22, fontWeight: "800", color: "#0F172A" },
  invalidRoomText: { color: "#64748B", textAlign: "center", marginTop: 8 },
  returnButton: { backgroundColor: "#0D9488", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 18 },
  returnButtonText: { color: "#FFFFFF", fontWeight: "700" },
});
