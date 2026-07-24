export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  bloodGroup: string;
}

export const PATIENTS: Patient[] = [
  {
    id: 'pat1',
    name: 'Sadia Mahmood',
    email: 'sadia@gmail.com',
    age: 23,
    gender: 'Female',
    bloodGroup: 'O+'
  },
  {
    id: 'pat2',
    name: 'Rahim Uddin',
    email: 'rahim@gmail.com',
    age: 28,
    gender: 'Male',
    bloodGroup: 'B+'
  }
];