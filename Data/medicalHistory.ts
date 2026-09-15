export interface MedicalHistory {
  id: string;
  patientId: string;
  diagnosis: string;
  prescription: string;
  visitDate: string;
  age: number;
  weight: number;
  bloodGroup: string;
}

export const INITIAL_MEDICAL_HISTORY: MedicalHistory[] = [
  {
    id: "1",
    patientId: "patient-1",
    diagnosis: "Fever",
    prescription: "Paracetamol 500mg",
    visitDate: "2026-09-14",
    age: 22,
    weight: 55,
    bloodGroup: "A+",
  },
  {
    id: "2",
    patientId: "patient-1",
    diagnosis: "Headache",
    prescription: "Napa Extra",
    visitDate: "2026-09-10",
    age: 22,
    weight: 55,
    bloodGroup: "A+",
  },
];