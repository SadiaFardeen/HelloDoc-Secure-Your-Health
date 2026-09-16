import React, { createContext, useContext, useState } from "react";

interface LogContextType {
  logs: any[];
  addLog: (log: any) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
});

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<any[]>([]);

  const addLog = (log: any) => {
    setLogs((prev) => (Array.isArray(prev) ? [...prev, log] : [log]));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider value={{ logs: Array.isArray(logs) ? logs : [], addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context || !Array.isArray(context.logs)) {
    return {
      logs: [],
      addLog: () => {},
      clearLogs: () => {},
    };
  }
  return context;
};

export default LogContext;