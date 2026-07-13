
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospital: string;
  location: string;
  fee: number;
  rating: number;
  availability: string;
  imageUrl: string;
  about: string;
  languages: string[];
}

export const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Farhana Rahman",
    specialization: "Medicine",
    qualification: "MBBS, FCPS (Medicine)",
    experience: 12,
    hospital: "United Hospital",
    location: "Gulshan, Dhaka",
    fee: 1200,
    rating: 4.9,
    availability: "Available Today",
    imageUrl: "https://i.pravatar.cc/300?img=47",
    about:
      "Dr. Farhana Rahman is an experienced medicine specialist. She provides consultation for fever, infections, diabetes, blood pressure and general health conditions.",
    languages: ["Bangla", "English"],
  },
  {
    id: "2",
    name: "Dr. Mahmud Hasan",
    specialization: "Cardiology",
    qualification: "MBBS, MD (Cardiology)",
    experience: 15,
    hospital: "Square Hospital",
    location: "Panthapath, Dhaka",
    fee: 1500,
    rating: 4.8,
    availability: "Available Tomorrow",
    imageUrl: "https://i.pravatar.cc/300?img=12",
    about:
      "Dr. Mahmud Hasan specialises in heart disease, high blood pressure, chest pain and preventive cardiac care.",
    languages: ["Bangla", "English", "Hindi"],
  },
  {
    id: "3",
    name: "Dr. Nusrat Jahan",
    specialization: "Dermatology",
    qualification: "MBBS, DDV",
    experience: 9,
    hospital: "Popular Diagnostic Centre",
    location: "Dhanmondi, Dhaka",
    fee: 1000,
    rating: 4.7,
    availability: "Available Today",
    imageUrl: "https://i.pravatar.cc/300?img=32",
    about:
      "Dr. Nusrat Jahan treats acne, allergies, hair loss, skin infections and other dermatological conditions.",
    languages: ["Bangla", "English"],
  },
  {
    id: "4",
    name: "Dr. Adnan Karim",
    specialization: "Neurology",
    qualification: "MBBS, MD (Neurology)",
    experience: 14,
    hospital: "Evercare Hospital",
    location: "Bashundhara, Dhaka",
    fee: 1600,
    rating: 4.9,
    availability: "Available Saturday",
    imageUrl: "https://i.pravatar.cc/300?img=11",
    about:
      "Dr. Adnan Karim provides treatment for migraine, stroke, epilepsy, nerve disorders and chronic headaches.",
    languages: ["Bangla", "English"],
  },
  {
    id: "5",
    name: "Dr. Samira Islam",
    specialization: "Pediatrics",
    qualification: "MBBS, FCPS (Pediatrics)",
    experience: 11,
    hospital: "Dhaka Shishu Hospital",
    location: "Shyamoli, Dhaka",
    fee: 1100,
    rating: 4.8,
    availability: "Available Today",
    imageUrl: "https://i.pravatar.cc/300?img=44",
    about:
      "Dr. Samira Islam is a child specialist providing care for newborns, children and adolescents.",
    languages: ["Bangla", "English"],
  },
  {
    id: "6",
    name: "Dr. Tasnim Ahmed",
    specialization: "Gynecology",
    qualification: "MBBS, FCPS (Gynecology)",
    experience: 13,
    hospital: "Labaid Specialized Hospital",
    location: "Dhanmondi, Dhaka",
    fee: 1400,
    rating: 4.9,
    availability: "Available Tomorrow",
    imageUrl: "https://i.pravatar.cc/300?img=49",
    about:
      "Dr. Tasnim Ahmed provides women's healthcare, pregnancy consultation and treatment for gynecological conditions.",
    languages: ["Bangla", "English"],
  },
  {
    id: "7",
    name: "Dr. Imran Hossain",
    specialization: "Orthopedics",
    qualification: "MBBS, MS (Orthopedics)",
    experience: 10,
    hospital: "Ibn Sina Hospital",
    location: "Kallyanpur, Dhaka",
    fee: 1200,
    rating: 4.6,
    availability: "Available Sunday",
    imageUrl: "https://i.pravatar.cc/300?img=15",
    about:
      "Dr. Imran Hossain treats bone fractures, joint pain, arthritis, sports injuries and spinal conditions.",
    languages: ["Bangla", "English"],
  },
  {
    id: "8",
    name: "Dr. Rafia Sultana",
    specialization: "Medicine",
    qualification: "MBBS, MRCP",
    experience: 8,
    hospital: "Anwer Khan Modern Hospital",
    location: "Dhanmondi, Dhaka",
    fee: 900,
    rating: 4.5,
    availability: "Available Today",
    imageUrl: "https://i.pravatar.cc/300?img=45",
    about:
      "Dr. Rafia Sultana provides primary medical care and treatment for common and chronic health conditions.",
    languages: ["Bangla", "English"],
  },
];

export const DOCTOR_CATEGORIES: string[] = [
  "All",
  "Medicine",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Gynecology",
  "Orthopedics",
];