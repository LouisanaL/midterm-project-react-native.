// src/context/SavedJobsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from '../types';

interface SavedJobsContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType>({
  savedJobs: [],
  saveJob: () => {},
  removeJob: () => {},
  isJobSaved: () => false,
});

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    setSavedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev;
      return [...prev, job];
    });
  };

  const removeJob = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const isJobSaved = (jobId: string) => savedJobs.some((j) => j.id === jobId);

  return (
    <SavedJobsContext.Provider value={{ savedJobs, saveJob, removeJob, isJobSaved }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);