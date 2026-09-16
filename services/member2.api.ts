// services/member2.api.ts
import axios from "axios";
import { Platform } from "react-native";

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

export async function getDoctorAppointments(): Promise<Appointment[]> {
  const response = await member2Api.get<Appointment[]>("/doctor/appointments");
  return response.data;
}

export async function updateAppointmentStatus(
  id: string,
  status: "accepted" | "rejected"
): Promise<Appointment> {
  const response = await member2Api.patch<Appointment>(`/appointments/${id}`, {
    status,
  });
  return response.data;
}

export async function getPrescriptions(): Promise<Prescription[]> {
  const response = await member2Api.get<Prescription[]>("/prescriptions");
  return response.data;
}

export async function createPrescription(
  data: CreatePrescriptionDTO
): Promise<Prescription> {
  const response = await member2Api.post<Prescription>("/prescriptions", data);
  return response.data;
}

export async function updatePrescription(
  id: string,
  data: UpdatePrescriptionDTO
): Promise<Prescription> {
  const response = await member2Api.put<Prescription>(`/prescriptions/${id}`, data);
  return response.data;
}