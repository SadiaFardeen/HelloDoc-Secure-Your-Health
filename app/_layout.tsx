import { Stack } from 'expo-router';
import React from 'react';
import { AppProvider } from '../Context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="doctor/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="consultation/chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="patient/medical-history" options={{ headerShown: false }} />
        <Stack.Screen name="patient/records" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="doctorDashboard/dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="doctorDashboard/prescription" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}