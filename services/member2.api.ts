// services/member2.api.ts
import axios from "axios";
import { Platform } from "react-native";

// ── Base URL Configuration ──────────────────────────────
// When using Android emulator: 10.0.2.2 points to computer's localhost.
// When using web browser or iOS simulator: localhost works.
// When testing on a physical phone: replace with your PC's local Wi-Fi IP (e.g., http://192.168.0.105:5000)
const DEV_API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000"
    : "http://localhost:5000";

export const member2Api = axios.create({
  baseURL: DEV_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── TypeScript Interfaces ───────────────────────────────
export interface Appointment {
  id: string;
  doctor_id?: string;
  doctorId?: string;
  doctor_name?: string;
  doctorName?: string;
  patient_id?: string;
  patientId?: string;
  patient_name?: string;
  patientName?: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  problem: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  timing: string;
}

export interface Prescription {
  id: string;
  appointment_id?: string;
  appointmentId?: string;
  doctor_id?: string;
  doctorId?: string;
  patient_id?: string;
  patientId?: string;
  patient_name?: string;
  patientName?: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  notes?: string;
}

export interface CreatePrescriptionDTO {
  appointmentId?: string;
  doctorId?: string;
  patientId?: string;
  patientName: string;
  diagnosis: string;
  medicines: Medicine[];
  notes?: string;
}

export interface UpdatePrescriptionDTO {
  diagnosis?: string;
  medicines?: Medicine[];
  notes?: string;
}

// ── Member 2 API Methods ────────────────────────────────

// 1. GET /doctor/appointments
export async function getDoctorAppointments(): Promise<Appointment[]> {
  const response = await member2Api.get<Appointment[]>("/doctor/appointments");
  return response.data;
}

// 2. PATCH /appointments/:id
export async function updateAppointmentStatus(
  id: string,
  status: "accepted" | "rejected"
): Promise<Appointment> {
  const response = await member2Api.patch<Appointment>(`/appointments/${id}`, {
    status,
  });
  return response.data;
}

// 3. GET /prescriptions
export async function getPrescriptions(): Promise<Prescription[]> {
  const response = await member2Api.get<Prescription[]>("/prescriptions");
  return response.data;
}

// 4. POST /prescriptions
export async function createPrescription(
  data: CreatePrescriptionDTO
): Promise<Prescription> {
  const response = await member2Api.post<Prescription>("/prescriptions", data);
  return response.data;
}

// 5. PUT /prescriptions/:id
export async function updatePrescription(
  id: string,
  data: UpdatePrescriptionDTO
): Promise<Prescription> {
  const response = await member2Api.put<Prescription>(`/prescriptions/${id}`, data);
  return response.data;
}