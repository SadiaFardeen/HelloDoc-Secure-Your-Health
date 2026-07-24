import React, { createContext, useContext, useState } from "react";
import { Appointment, INITIAL_APPOINTMENTS, INITIAL_PRESCRIPTIONS, Prescription } from "../data/mockData";
interface AppContextType {
  userRole: "Patient" | "Doctor";
  setUserRole: (role: "Patient" | "Doctor") => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  prescriptions: Prescription[];
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<"Patient" | "Doctor">("Patient");
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      appointments,
      setAppointments,
      prescriptions,
      setPrescriptions
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}