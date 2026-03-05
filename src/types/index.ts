// src/types/index.ts

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  type: string;
  category: string;
  applyUrl?: string;
  tags?: string[];
  postedAt?: string;
  companyLogo?: string;
  companyImage?: string;
}

export interface ApplicationForm {
  name: string;
  email: string;
  contactNumber: string;
  whyHireYou: string;
}

export type ApplicationStatus = 'submitted' | 'viewed' | 'rejected' | 'accepted';

export interface AppliedJob extends Job {
  appliedAt: string;
  form: ApplicationForm;
  status: ApplicationStatus;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  contactNumber?: string;
  whyHireYou?: string;
}

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  ApplicationForm: { job: Job; fromSavedJobs?: boolean };
  JobDetail: { job: Job; fromSavedJobs?: boolean };
  AppliedJobs: undefined; // screen that lists jobs user has applied to
  AppliedJobDetail: { job: AppliedJob };
};

export type BottomTabParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
};