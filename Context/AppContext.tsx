import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  user: any;
  setUser: (user: any) => void;
  appointments: any[];
  setAppointments: (appointments: any[]) => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  appointments: [],
  setAppointments: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        appointments: Array.isArray(appointments) ? appointments : [],
        setAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    return {
      user: null,
      setUser: () => {},
      appointments: [],
      setAppointments: () => {},
    };
  }
  return context;
};

export default AppContext;