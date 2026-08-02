export interface PasswordFields {
  
  password?: string;
  
  passwordHash?: string;
  passwordSalt?: string;
}

export interface DoctorAccount extends PasswordFields {
  id: string;
  doctorId: string;
  name: string;
  specialty: string;
  email: string;
  isRegistered?: boolean;
  createdAt?: string;
}

export interface PatientAccount extends PasswordFields {
  id: string;
  name: string;
  email: string;
  isRegistered?: boolean;
  createdAt?: string;
}

export const DOCTOR_ACCOUNTS: DoctorAccount[] = [
  { id: "doctor-account-1", doctorId: "1", name: "Dr. Farhana Rahman", specialty: "Medicine", email: "doc1@hello.com", password: "doc12301" },
  { id: "doctor-account-2", doctorId: "2", name: "Dr. Mahmud Hasan", specialty: "Cardiology", email: "doc2@hello.com", password: "doc12302" },
  { id: "doctor-account-3", doctorId: "3", name: "Dr. Nusrat Jahan", specialty: "Dermatology", email: "doc3@hello.com", password: "doc12303" },
  { id: "doctor-account-4", doctorId: "4", name: "Dr. Adnan Karim", specialty: "Neurology", email: "doc4@hello.com", password: "doc12304" },
  { id: "doctor-account-5", doctorId: "5", name: "Dr. Samira Islam", specialty: "Pediatrics", email: "doc5@hello.com", password: "doc12305" },
  { id: "doctor-account-6", doctorId: "6", name: "Dr. Tasnim Ahmed", specialty: "Gynecology", email: "doc6@hello.com", password: "doc12306" },
  { id: "doctor-account-7", doctorId: "7", name: "Dr. Imran Hossain", specialty: "Orthopedics", email: "doc7@hello.com", password: "doc12307" },
  { id: "doctor-account-8", doctorId: "8", name: "Dr. Rafia Sultana", specialty: "Medicine", email: "doc8@hello.com", password: "doc12308" },
  { id: "doctor-account-9", doctorId: "9", name: "Dr. Md. Nur Nobi", specialty: "Dermatology", email: "doc9@hello.com", password: "doc12309" },
  { id: "doctor-account-10", doctorId: "10", name: "Dr. Ayesha Khan", specialty: "ENT", email: "doc10@hello.com", password: "doc12310" },
];

export const PATIENT_ACCOUNTS: PatientAccount[] = [
  { id: "p1", name: "Sadia Fardeen", email: "pat1@hello.com", password: "pat12301" },
  { id: "p2", name: "Srabon Ahmed", email: "pat2@hello.com", password: "pat12302" },
  { id: "p3", name: "Nusrat Tasnim", email: "pat3@hello.com", password: "pat12303" },
  { id: "p4", name: "Tanvir Rahman", email: "pat4@hello.com", password: "pat12304" },
  { id: "p5", name: "Ayesha Sultana", email: "pat5@hello.com", password: "pat12305" },
];
