import React, { createContext, useContext, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  subject: string;
  professor: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  subject: string;
  title: string;
  date: string;
  time: string;
}

export interface StudySession {
  id: string;
  subject: string;
  minutes: number;
  date: string;
}

type AppDataContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
};

const AppDataContext = createContext<AppDataContextType | null>(null);

// Todo arranca vacío: así un usuario nuevo no ve datos de ejemplo
export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  return (
    <AppDataContext.Provider value={{ tasks, setTasks, exams, setExams, sessions, setSessions }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData debe ser utilizado dentro de AppDataProvider');
  return context;
};