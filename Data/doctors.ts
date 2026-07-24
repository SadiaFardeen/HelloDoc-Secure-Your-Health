export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  hospital: string;
  location: string;
  experience: number;
  rating: number;
  fee: number;
  imageUrl: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Ahmed',
    email: 'doc1@hellodoc.com',
    specialization: 'Cardiology',
    qualification: 'MBBS, FCPS',
    hospital: 'Square Hospital',
    location: 'Dhaka',
    experience: 10,
    rating: 4.9,
    fee: 1000,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc2',
    name: 'Dr. Tanvir Hassan',
    email: 'doc2@hellodoc.com',
    specialization: 'Dermatology',
    qualification: 'MBBS, MD',
    hospital: 'Labaid Hospital',
    location: 'Dhaka',
    experience: 8,
    rating: 4.8,
    fee: 800,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc3',
    name: 'Dr. Nusrat Jahan',
    email: 'doc3@hellodoc.com',
    specialization: 'Pediatrics',
    qualification: 'MBBS, DCH',
    hospital: 'United Hospital',
    location: 'Dhaka',
    experience: 6,
    rating: 4.7,
    fee: 700,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc4',
    name: 'Dr. Mahmud Hassan',
    email: 'doc4@hellodoc.com',
    specialization: 'Neurology',
    qualification: 'MBBS, FCPS (Neuro)',
    hospital: 'Evercare Hospital',
    location: 'Dhaka',
    experience: 12,
    rating: 4.9,
    fee: 1200,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc5',
    name: 'Dr. Rina Sultana',
    email: 'doc5@hellodoc.com',
    specialization: 'Gynecology',
    qualification: 'MBBS, MS',
    hospital: 'Ibn Sina Hospital',
    location: 'Dhaka',
    experience: 9,
    rating: 4.8,
    fee: 900,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc6',
    name: 'Dr. Farhan Ali',
    email: 'doc6@hellodoc.com',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho)',
    hospital: 'Popular Diagnostic',
    location: 'Dhaka',
    experience: 11,
    rating: 4.7,
    fee: 1000,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc7',
    name: 'Dr. Ayesha Karim',
    email: 'doc7@hellodoc.com',
    specialization: 'Medicine',
    qualification: 'MBBS, FCPS',
    hospital: 'BD Korea Hospital',
    location: 'Dhaka',
    experience: 7,
    rating: 4.6,
    fee: 800,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc8',
    name: 'Dr. Kamrul Islam',
    email: 'doc8@hellodoc.com',
    specialization: 'ENT',
    qualification: 'MBBS, DLO',
    hospital: 'BRB Hospital',
    location: 'Dhaka',
    experience: 10,
    rating: 4.8,
    fee: 850,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc9',
    name: 'Dr. Sabina Yasmin',
    email: 'doc9@hellodoc.com',
    specialization: 'Ophthalmology',
    qualification: 'MBBS, DO',
    hospital: 'Fashion Eye Hospital',
    location: 'Dhaka',
    experience: 5,
    rating: 4.5,
    fee: 600,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 'doc10',
    name: 'Dr. Rafiqul Alam',
    email: 'doc10@hellodoc.com',
    specialization: 'Psychiatry',
    qualification: 'MBBS, MD (Psych)',
    hospital: 'Mental Health Center',
    location: 'Dhaka',
    experience: 14,
    rating: 5.0,
    fee: 1500,
    imageUrl: 'https://via.placeholder.com/150'
  }
];

export const DOCTOR_CATEGORIES = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Gynecology', 'Orthopedics', 'Medicine', 'ENT', 'Psychiatry'];