import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
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
  DOCTOR_ACCOUNTS,
  DoctorAccount,
  PATIENT_ACCOUNTS,
  PatientAccount,
} from "../data/accounts";
import { Doctor, DOCTORS } from "../data/doctor";
import {
  Appointment,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  Prescription,
} from "../data/mockData";
import { createPasswordCredential } from "../utils/auth";

export type UserRole = "Patient" | "Doctor";

interface StoredSession {
  userRole: UserRole;
  currentPatientId: string | null;
  currentDoctorId: string | null;
}

interface RegisterPatientInput {
  name: string;
  email: string;
  password: string;
}

interface RegisterDoctorInput {
  name: string;
  email: string;
  password: string;
  specialization: string;
  qualification: string;
  hospital: string;
  location: string;
  fee: number;
  about?: string;
}

interface AppContextType {
  isHydrated: boolean;

  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;

  currentPatientId: string | null;
  setCurrentPatientId: React.Dispatch<React.SetStateAction<string | null>>;

  currentDoctorId: string | null;
  setCurrentDoctorId: React.Dispatch<React.SetStateAction<string | null>>;

  patientAccounts: PatientAccount[];
  doctorAccounts: DoctorAccount[];
  doctors: Doctor[];
  emailExists: (email: string) => boolean;
  registerPatient: (input: RegisterPatientInput) => Promise<PatientAccount>;
  registerDoctor: (
    input: RegisterDoctorInput
  ) => Promise<{ account: DoctorAccount; doctor: Doctor }>;

  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  addAppointment: (appointment: Appointment) => Promise<void>;

  prescriptions: Prescription[];
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  addPrescription: (prescription: Prescription) => Promise<void>;

  signOut: () => void;
}

const STORAGE_KEYS = {
  session: "@hellodoc/session-v2",
  appointments: "@hellodoc/appointments-v2",
  prescriptions: "@hellodoc/prescriptions-v2",
  registeredPatients: "@hellodoc/registered-patients-v1",
  registeredDoctors: "@hellodoc/registered-doctors-v1",
  registeredDoctorProfiles: "@hellodoc/registered-doctor-profiles-v1",
} as const;

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
}

function parseStoredArray<T>(value: string | null, fallback: T[] = []): T[] {
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

function mergeById<T extends { id: string }>(base: T[], added: T[]): T[] {
  const map = new Map<string, T>();
  base.forEach((item) => map.set(item.id, item));
  added.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

export function AppProvider({ children }: AppProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("Patient");
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(null);

  const [patientAccounts, setPatientAccounts] =
    useState<PatientAccount[]>(PATIENT_ACCOUNTS);
  const [doctorAccounts, setDoctorAccounts] =
    useState<DoctorAccount[]>(DOCTOR_ACCOUNTS);
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);

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
        const [
          storedSession,
          storedAppointments,
          storedPrescriptions,
          storedPatients,
          storedDoctorAccounts,
          storedDoctorProfiles,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.session),
          AsyncStorage.getItem(STORAGE_KEYS.appointments),
          AsyncStorage.getItem(STORAGE_KEYS.prescriptions),
          AsyncStorage.getItem(STORAGE_KEYS.registeredPatients),
          AsyncStorage.getItem(STORAGE_KEYS.registeredDoctors),
          AsyncStorage.getItem(STORAGE_KEYS.registeredDoctorProfiles),
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
        const registeredPatients = parseStoredArray<PatientAccount>(storedPatients);
        const registeredDoctorAccounts =
          parseStoredArray<DoctorAccount>(storedDoctorAccounts);
        const registeredDoctorProfiles =
          parseStoredArray<Doctor>(storedDoctorProfiles);

        appointmentsRef.current = restoredAppointments;
        prescriptionsRef.current = restoredPrescriptions;

        setAppointments(restoredAppointments);
        setPrescriptions(restoredPrescriptions);
        setPatientAccounts(mergeById(PATIENT_ACCOUNTS, registeredPatients));
        setDoctorAccounts(
          mergeById(DOCTOR_ACCOUNTS, registeredDoctorAccounts)
        );
        setDoctors(mergeById(DOCTORS, registeredDoctorProfiles));
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

  const emailExists = useCallback(
    (email: string) => {
      const normalized = email.trim().toLowerCase();
      return (
        patientAccounts.some(
          (account) => account.email.toLowerCase() === normalized
        ) ||
        doctorAccounts.some(
          (account) => account.email.toLowerCase() === normalized
        )
      );
    },
    [doctorAccounts, patientAccounts]
  );

  const registerPatient = useCallback(
    async (input: RegisterPatientInput): Promise<PatientAccount> => {
      const normalizedEmail = input.email.trim().toLowerCase();

      if (emailExists(normalizedEmail)) {
        throw new Error("An account already exists with this email.");
      }

      const credential = await createPasswordCredential(input.password);
      const account: PatientAccount = {
        id: `patient-${Crypto.randomUUID()}`,
        name: input.name.trim(),
        email: normalizedEmail,
        ...credential,
        isRegistered: true,
        createdAt: new Date().toISOString(),
      };

      const registeredPatients = [
        ...patientAccounts.filter((item) => item.isRegistered),
        account,
      ];
      const nextAccounts = [...PATIENT_ACCOUNTS, ...registeredPatients];

      setPatientAccounts(nextAccounts);
      await AsyncStorage.setItem(
        STORAGE_KEYS.registeredPatients,
        JSON.stringify(registeredPatients)
      );

      return account;
    },
    [emailExists, patientAccounts]
  );

  const registerDoctor = useCallback(
    async (
      input: RegisterDoctorInput
    ): Promise<{ account: DoctorAccount; doctor: Doctor }> => {
      const normalizedEmail = input.email.trim().toLowerCase();

      if (emailExists(normalizedEmail)) {
        throw new Error("An account already exists with this email.");
      }

      const credential = await createPasswordCredential(input.password);
      const uniqueId = Crypto.randomUUID();
      const doctorId = `doctor-${uniqueId}`;
      const createdAt = new Date().toISOString();

      const account: DoctorAccount = {
        id: `doctor-account-${uniqueId}`,
        doctorId,
        name: input.name.trim(),
        specialty: input.specialization.trim(),
        email: normalizedEmail,
        ...credential,
        isRegistered: true,
        createdAt,
      };

      const doctor: Doctor = {
        id: doctorId,
        name: input.name.trim(),
        specialization: input.specialization.trim(),
        qualification: input.qualification.trim(),
        experience: 0,
        hospital: input.hospital.trim(),
        location: input.location.trim(),
        fee: input.fee,
        rating: 5,
        availability: "Available for booking",
        imageUrl: `https://i.pravatar.cc/300?u=${encodeURIComponent(
          normalizedEmail
        )}`,
        about:
          input.about?.trim() ||
          `${input.name.trim()} is a registered HelloDoc doctor.`,
        languages: ["Bangla", "English"],
      };

      const registeredAccounts = [
        ...doctorAccounts.filter((item) => item.isRegistered),
        account,
      ];
      const registeredProfiles = [
        ...doctors.filter((item) => item.id.startsWith("doctor-")),
        doctor,
      ];

      setDoctorAccounts([...DOCTOR_ACCOUNTS, ...registeredAccounts]);
      setDoctors([...DOCTORS, ...registeredProfiles]);

      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.registeredDoctors,
          JSON.stringify(registeredAccounts)
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.registeredDoctorProfiles,
          JSON.stringify(registeredProfiles)
        ),
      ]);

      return { account, doctor };
    },
    [doctorAccounts, doctors, emailExists]
  );

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
      patientAccounts,
      doctorAccounts,
      doctors,
      emailExists,
      registerPatient,
      registerDoctor,
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
      doctorAccounts,
      doctors,
      emailExists,
      isHydrated,
      patientAccounts,
      prescriptions,
      registerDoctor,
      registerPatient,
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
