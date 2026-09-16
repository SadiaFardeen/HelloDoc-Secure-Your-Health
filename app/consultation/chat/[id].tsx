import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../services/api";

export default function ConsultationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const currentUserName = (params.userName as string) || "Patient";
  const userRole = (params.userRole as string) || "patient";

  useEffect(() => {
    const fetchDocList = async () => {
      try {
        setLoading(true);
        const docs = await api.getDoctors();
        if (Array.isArray(docs) && docs.length > 0) {
          setDoctors(docs);
          const initial = docs.find((d) => String(d.id) === String(params.id)) || docs[0];
          setSelectedDoctor(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocList();
  }, [params.id]);

  useEffect(() => {
    if (!selectedDoctor) return;
    const fetchChat = async () => {
      try {
        const msgs = await api.getMessages(selectedDoctor.id);
        if (Array.isArray(msgs)) setMessages(msgs);
      } catch (e) {
        console.error(e);
      }
    };
    fetchChat();
  }, [selectedDoctor]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedDoctor) return;
    const textToSend = inputText.trim();
    setInputText("");

    try {
      setSending(true);
      const newMsg = await api.sendMessage({
        sender_role: userRole,
        sender_name: currentUserName,
        doctor_id: selectedDoctor.id,
        text: textToSend,
      });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.topTitle}>{selectedDoctor ? selectedDoctor.name : "Doctor Chat"}</Text>
          <Text style={styles.topSubtitle}>
            {selectedDoctor ? selectedDoctor.specialization : "Select doctor to chat"}
          </Text>
        </View>
      </View>

      <View style={styles.doctorSelector}>
        <Text style={styles.selectorLabel}>Select Doctor to Chat:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.docChipList}>
          {doctors.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[
                styles.docChip,
                selectedDoctor && selectedDoctor.id === doc.id && styles.activeDocChip,
              ]}
              onPress={() => setSelectedDoctor(doc)}
            >
              <Text
                style={[
                  styles.docChipText,
                  selectedDoctor && selectedDoctor.id === doc.id && styles.activeDocChipText,
                ]}
              >
                {doc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 16 }}>
          {messages.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubbles-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Start a live conversation with {selectedDoctor?.name || "the doctor"}.</Text>
            </View>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_role === userRole;
              return (
                <View
                  key={m.id}
                  style={[
                    styles.msgBubble,
                    isMe ? styles.myBubble : styles.otherBubble,
                  ]}
                >
                  <Text style={[styles.senderLabel, isMe ? styles.mySenderLabel : styles.otherSenderLabel]}>
                    {m.sender_name}
                  </Text>
                  <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.otherMsgText]}>
                    {m.text}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.chatInput}
            placeholder={`Message ${selectedDoctor?.name || "doctor"}...`}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || sending) && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  backButton: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  topTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  topSubtitle: { fontSize: 12, color: "#0d9488" },
  doctorSelector: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  selectorLabel: { fontSize: 11, fontWeight: "700", color: "#64748b", marginBottom: 6 },
  docChipList: { gap: 8 },
  docChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#cbd5e1" },
  activeDocChip: { backgroundColor: "#0d9488", borderColor: "#0d9488" },
  docChipText: { fontSize: 12, color: "#334155", fontWeight: "600" },
  activeDocChipText: { color: "#fff", fontWeight: "bold" },
  chatArea: { flex: 1 },
  emptyBox: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { color: "#94a3b8", fontSize: 13, marginTop: 10, textAlign: "center" },
  msgBubble: { maxWidth: "80%", padding: 12, borderRadius: 14, marginBottom: 10 },
  myBubble: { alignSelf: "flex-end", backgroundColor: "#0d9488", borderBottomRightRadius: 2 },
  otherBubble: { alignSelf: "flex-start", backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0", borderBottomLeftRadius: 2 },
  senderLabel: { fontSize: 10, fontWeight: "700", marginBottom: 2 },
  mySenderLabel: { color: "#ccfbf1" },
  otherSenderLabel: { color: "#0d9488" },
  msgText: { fontSize: 14 },
  myMsgText: { color: "#fff" },
  otherMsgText: { color: "#0f172a" },
  inputBar: { flexDirection: "row", padding: 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#e2e8f0", gap: 8, alignItems: "center" },
  chatInput: { flex: 1, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 24, paddingHorizontal: 16, height: 44, fontSize: 14 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#0d9488", justifyContent: "center", alignItems: "center" },
});