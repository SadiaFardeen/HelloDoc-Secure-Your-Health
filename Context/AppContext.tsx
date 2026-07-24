import React, { createContext, useContext, useState } from 'react';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
}

interface AppContextType {
  userRole?: string;
  appointments: Appointment[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole] = useState('Patient');
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Ahmed',
      specialty: 'Cardiology',
      date: '2026-08-01',
      time: '10:00 AM',
      status: 'Upcoming',
    },
  ]);

  return (
    <AppContext.Provider value={{ userRole, appointments }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    return { userRole: 'Patient', appointments: [] };
  }
  return context;
};