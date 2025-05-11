import { createContext, useState, useContext, ReactNode } from 'react';

interface ScheduleData {
  region: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface ScheduleContextType {
  scheduleData: ScheduleData;
  setScheduleData: React.Dispatch<React.SetStateAction<ScheduleData>>;
}

const defaultState: ScheduleData = {
  region: '',
  title: '',
  startDate: '',
  endDate: '',
};

export const ScheduleContext = createContext<ScheduleContextType | null>(null);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>(defaultState);

  return (
    <ScheduleContext.Provider value={{ scheduleData, setScheduleData }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("useSchedule must be used within ScheduleProvider");
  return context;
};