import React, { createContext, useContext, useState } from "react";
import {
  Appointment,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  Prescription,
} from "../Data/mockData";

interface AppContextType {
  userRole: "Patient" | "Doctor";
  setUserRole: (role: "Patient" | "Doctor") => void;

  appointments: Appointment[];
  prescriptions: Prescription[];

  addAppointment: (appointment: Appointment) => void;
  addPrescription: (prescription: Prescription) => void;

  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] =
    useState<"Patient" | "Doctor">("Patient");

  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(INITIAL_PRESCRIPTIONS);

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions((prev) => [...prev, prescription]);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        appointments,
        prescriptions,
        addAppointment,
        addPrescription,
        setAppointments,
        setPrescriptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}