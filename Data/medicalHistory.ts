export interface MedicalHistory {
  id: string;
  patientId: string;
  diagnosis: string;
  prescription: string;
  visitDate: string;
}

export const INITIAL_MEDICAL_HISTORY: MedicalHistory[] = [
  {
    id: "1",
    patientId: "patient-1",
    diagnosis: "Fever",
    prescription: "Paracetamol 500mg",
    visitDate: "2026-09-14",
  },
  {
    id: "2",
    patientId: "patient-1",
    diagnosis: "Headache",
    prescription: "Napa Extra",
    visitDate: "2026-09-10",
  },
];