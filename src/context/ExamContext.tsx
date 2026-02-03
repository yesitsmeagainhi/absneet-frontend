// src/context/ExamContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXAM_STORAGE_KEY = 'topinexam_selected_exam';

export interface Exam {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  active?: boolean;
  order?: number;
}

interface ExamContextValue {
  selectedExam: Exam | null;
  setSelectedExam: (exam: Exam) => Promise<void>;
  clearSelectedExam: () => Promise<void>;
  isLoading: boolean;
}

const ExamContext = createContext<ExamContextValue | undefined>(undefined);

export function ExamProvider({ children }: { children: ReactNode }) {
  const [selectedExam, setSelectedExamState] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted exam on mount
  useEffect(() => {
    loadPersistedExam();
  }, []);

  const loadPersistedExam = async () => {
    try {
      const stored = await AsyncStorage.getItem(EXAM_STORAGE_KEY);
      if (stored) {
        const exam = JSON.parse(stored) as Exam;
        setSelectedExamState(exam);
      }
    } catch (error) {
      console.error('[ExamContext] Failed to load persisted exam:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedExam = async (exam: Exam) => {
    try {
      await AsyncStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exam));
      setSelectedExamState(exam);
    } catch (error) {
      console.error('[ExamContext] Failed to persist exam:', error);
      // Still update state even if persistence fails
      setSelectedExamState(exam);
    }
  };

  const clearSelectedExam = async () => {
    try {
      await AsyncStorage.removeItem(EXAM_STORAGE_KEY);
      setSelectedExamState(null);
    } catch (error) {
      console.error('[ExamContext] Failed to clear exam:', error);
      setSelectedExamState(null);
    }
  };

  return (
    <ExamContext.Provider
      value={{
        selectedExam,
        setSelectedExam,
        clearSelectedExam,
        isLoading,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used inside ExamProvider');
  }
  return context;
}
