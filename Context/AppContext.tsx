import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Appointment,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  Prescription,
} from "../data/mockData";

export type UserRole = "Patient" | "Doctor";

interface StoredSession {
  userRole: UserRole;
  currentPatientId: string | null;
  currentDoctorId: string | null;
}

interface AppContextType {
  isHydrated: boolean;

  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;

  currentPatientId: string | null;
  setCurrentPatientId: React.Dispatch<React.SetStateAction<string | null>>;

  currentDoctorId: string | null;
  setCurrentDoctorId: React.Dispatch<React.SetStateAction<string | null>>;

  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  addAppointment: (appointment: Appointment) => Promise<void>;

  prescriptions: Prescription[];
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  addPrescription: (prescription: Prescription) => Promise<void>;

  signOut: () => void;
}

// v2 intentionally avoids incompatible data saved by the earlier demo schema.
const STORAGE_KEYS = {
  session: "@hellodoc/session-v2",
  appointments: "@hellodoc/appointments-v2",
  prescriptions: "@hellodoc/prescriptions-v2",
} as const;

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
}

function parseStoredArray<T>(value: string | null, fallback: T[]): T[] {
  if (!value) {
    return fallback;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: AppProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("Patient");
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(
    INITIAL_APPOINTMENTS
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(
    INITIAL_PRESCRIPTIONS
  );

  const appointmentsRef = useRef<Appointment[]>(INITIAL_APPOINTMENTS);
  const prescriptionsRef = useRef<Prescription[]>(INITIAL_PRESCRIPTIONS);

  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  useEffect(() => {
    prescriptionsRef.current = prescriptions;
  }, [prescriptions]);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const [storedSession, storedAppointments, storedPrescriptions] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.session),
            AsyncStorage.getItem(STORAGE_KEYS.appointments),
            AsyncStorage.getItem(STORAGE_KEYS.prescriptions),
          ]);

        if (!active) {
          return;
        }

        if (storedSession) {
          try {
            const session = JSON.parse(storedSession) as StoredSession;
            setUserRole(session.userRole === "Doctor" ? "Doctor" : "Patient");
            setCurrentPatientId(session.currentPatientId ?? null);
            setCurrentDoctorId(session.currentDoctorId ?? null);
          } catch {
            // Invalid session data is ignored.
          }
        }

        const restoredAppointments = parseStoredArray<Appointment>(
          storedAppointments,
          INITIAL_APPOINTMENTS
        );
        const restoredPrescriptions = parseStoredArray<Prescription>(
          storedPrescriptions,
          INITIAL_PRESCRIPTIONS
        );

        appointmentsRef.current = restoredAppointments;
        prescriptionsRef.current = restoredPrescriptions;
        setAppointments(restoredAppointments);
        setPrescriptions(restoredPrescriptions);
      } catch (error) {
        console.error("Failed to restore HelloDoc data:", error);
      } finally {
        if (active) {
          setIsHydrated(true);
        }
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const session: StoredSession = {
      userRole,
      currentPatientId,
      currentDoctorId,
    };

    void AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  }, [currentDoctorId, currentPatientId, isHydrated, userRole]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    appointmentsRef.current = appointments;
    void AsyncStorage.setItem(
      STORAGE_KEYS.appointments,
      JSON.stringify(appointments)
    );
  }, [appointments, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    prescriptionsRef.current = prescriptions;
    void AsyncStorage.setItem(
      STORAGE_KEYS.prescriptions,
      JSON.stringify(prescriptions)
    );
  }, [isHydrated, prescriptions]);

  const addAppointment = useCallback(async (appointment: Appointment) => {
    const nextAppointments = [...appointmentsRef.current, appointment];
    appointmentsRef.current = nextAppointments;
    setAppointments(nextAppointments);
    await AsyncStorage.setItem(
      STORAGE_KEYS.appointments,
      JSON.stringify(nextAppointments)
    );
  }, []);

  const addPrescription = useCallback(async (prescription: Prescription) => {
    const nextPrescriptions = [...prescriptionsRef.current, prescription];
    prescriptionsRef.current = nextPrescriptions;
    setPrescriptions(nextPrescriptions);
    await AsyncStorage.setItem(
      STORAGE_KEYS.prescriptions,
      JSON.stringify(nextPrescriptions)
    );
  }, []);

  const signOut = useCallback(() => {
    setCurrentPatientId(null);
    setCurrentDoctorId(null);
  }, []);

  const value = useMemo<AppContextType>(
    () => ({
      isHydrated,
      userRole,
      setUserRole,
      currentPatientId,
      setCurrentPatientId,
      currentDoctorId,
      setCurrentDoctorId,
      appointments,
      setAppointments,
      addAppointment,
      prescriptions,
      setPrescriptions,
      addPrescription,
      signOut,
    }),
    [
      addAppointment,
      addPrescription,
      appointments,
      currentDoctorId,
      currentPatientId,
      isHydrated,
      prescriptions,
      signOut,
      userRole,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}
