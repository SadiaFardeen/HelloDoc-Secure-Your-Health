// app/_layout.tsx
import { Stack } from "expo-router";
import { AppProvider } from "../context/AppContext";

export default function RootLayout() {
  return (
    // আমাদের কাস্টম AppProvider দিয়ে পুরো অ্যাপের নেভিগেশনকে র‍্যাপ করা হলো
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* index স্ক্রিনটি হবে আমাদের প্রথম স্ক্রিন (লগইন/রোল সুইচার) */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppProvider>
  );
}