// src/hooks/useJobs.ts
import { useState, useEffect, useCallback } from 'react';
import uuid from 'react-native-uuid';
import { Job } from '../types';

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const stripHtmlTags = (text: string): string => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
};

// Generate a consistent logo URL from company name using UI Avatars or Clearbit
const getCompanyLogoUrl = (companyName: string, logoUrl?: string): string => {
  if (logoUrl && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))) {
    return logoUrl;
  }
  const clean = encodeURIComponent((companyName || 'Company').trim().substring(0, 50));
  return `https://ui-avatars.com/api/?name=${clean}&background=random&color=fff&size=128&bold=true&rounded=true`;
};

// Get a relevant banner image from Unsplash based on category
const getCategoryImage = (category: string, type: string): string => {
  const term = encodeURIComponent(
    category?.toLowerCase().includes('tech') || type?.toLowerCase().includes('engineer')
      ? 'technology office'
      : category?.toLowerCase().includes('health')
      ? 'healthcare medical'
      : category?.toLowerCase().includes('finance')
      ? 'finance business'
      : category?.toLowerCase().includes('design')
      ? 'design creative studio'
      : category?.toLowerCase().includes('market')
      ? 'marketing business'
      : 'modern office workspace'
  );
  return `https://source.unsplash.com/800x400/?${term}`;
};

const mapApiJobToJob = (apiJob: any): Job => {
  const company = stripHtmlTags(apiJob.companyName || apiJob.company || 'Unknown Company');
  const category = stripHtmlTags(apiJob.jobCategory || apiJob.category || 'General');
  const type = stripHtmlTags(apiJob.jobType || apiJob.employmentType || 'Full-time');

  return {
    id: uuid.v4() as string,
    title: stripHtmlTags(apiJob.title || apiJob.jobTitle || 'Unknown Title'),
    company,
    location: stripHtmlTags(apiJob.location || apiJob.jobLocation || 'Remote'),
    salary:
      apiJob.minSalary && apiJob.maxSalary
        ? `₱${Number(apiJob.minSalary).toLocaleString()} - ₱${Number(apiJob.maxSalary).toLocaleString()}`
        : stripHtmlTags(apiJob.salary || 'Competitive'),
    description: stripHtmlTags(apiJob.jobDescription || apiJob.description || 'No description available.'),
    type,
    category,
    applyUrl: apiJob.url || apiJob.applyUrl || '',
    tags: apiJob.tags || [],
    postedAt: apiJob.postedAt || apiJob.createdAt || '',
    companyLogo: getCompanyLogoUrl(company, apiJob.companyLogo || apiJob.logo),
    companyImage: getCategoryImage(category, type),
  };
};

export const useJobs = (): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://empllo.com/api/v1');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();

      let rawJobs: any[] = [];
      if (Array.isArray(data)) {
        rawJobs = data;
      } else if (data.jobs && Array.isArray(data.jobs)) {
        rawJobs = data.jobs;
      } else if (data.data && Array.isArray(data.data)) {
        rawJobs = data.data;
      } else {
        const firstArray = Object.values(data).find((v) => Array.isArray(v));
        if (firstArray) {
          rawJobs = firstArray as any[];
        }
      }

      const mappedJobs = rawJobs.map(mapApiJobToJob);
      setJobs(mappedJobs);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
};