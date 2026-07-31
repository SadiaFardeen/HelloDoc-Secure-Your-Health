export type AppointmentStatus = "Upcoming" | "Completed" | "Cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  medicines: string[];
  notes: string;
  createdAt: string;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [];
export const INITIAL_PRESCRIPTIONS: Prescription[] = [];
