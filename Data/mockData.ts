export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  fee: number;
  availableDays: string[];
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed";
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientName: string;
  medicines: string[];
  notes: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Asif Rahman",
    specialty: "Cardiology",
    hospital: "Square Hospital",
    fee: 1000,
    availableDays: ["Sunday", "Tuesday", "Thursday"]
  },
  {
    id: "d2",
    name: "Dr. Nusrat Jahan",
    specialty: "Pediatrics",
    hospital: "Evercare Hospital",
    fee: 800,
    availableDays: ["Monday", "Wednesday"]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "a1", patientName: "Sadia Fardeen", doctorName: "Dr. Asif Rahman", specialty: "Cardiology", date: "2026-07-15", time: "10:00 AM", status: "Upcoming" },
  { id: "a2", patientName: "Srabon", doctorName: "Dr. Nusrat Jahan", specialty: "Pediatrics", date: "2026-07-05", time: "04:30 PM", status: "Completed" }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  { id: "p1", appointmentId: "a2", patientName: "Srabon", medicines: ["Napa Extend (1+0+1)", "Seclo 20mg (1+0+1)"], notes: "Take rest for 3 days." }
];