// src/context/AppliedJobsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, ApplicationForm, AppliedJob, ApplicationStatus } from '../types';

// the AppliedJob interface is now defined in types/index

interface AppliedJobsContextType {
  appliedJobs: AppliedJob[];
  addAppliedJob: (job: Job, form: ApplicationForm) => void;
  removeAppliedJob: (jobId: string) => void;
  isJobApplied: (jobId: string) => boolean;
  updateStatus: (jobId: string, status: ApplicationStatus) => void;
}

const AppliedJobsContext = createContext<AppliedJobsContextType>({
  appliedJobs: [],
  addAppliedJob: () => {},
  removeAppliedJob: () => {},
  isJobApplied: () => false,
  updateStatus: () => {},
});

export const AppliedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);

  const addAppliedJob = (job: Job, form: ApplicationForm) => {
    setAppliedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev;
      const newApplied: AppliedJob = {
        ...job,
        appliedAt: new Date().toISOString(),
        form,
        status: 'submitted',
      };
      return [...prev, newApplied];
    });
  };

  const updateStatus = (jobId: string, status: ApplicationStatus) => {
    setAppliedJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
  };

  const removeAppliedJob = (jobId: string) => {
    setAppliedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const isJobApplied = (jobId: string) => appliedJobs.some((j) => j.id === jobId);

  return (
    <AppliedJobsContext.Provider
      value={{ appliedJobs, addAppliedJob, removeAppliedJob, isJobApplied, updateStatus }}
    >
      {children}
    </AppliedJobsContext.Provider>
  );
};

export const useAppliedJobs = () => useContext(AppliedJobsContext);
