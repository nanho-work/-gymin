export type Trainer = {
  id: string;
  name: string;
  age: number;
  birthYear: string;
  gender: string;
  contact: string;
  residenceRegion: string;
  profileImage: string;
  headline: string;
  area: string;
  experienceYears: number;
  specialties: string[];
  workType: string;
  desiredRoles: string[];
  availability: string;
  verifiedProfile: boolean;
  summary: string;
  workHistory: Array<{
    gymName: string;
    period: string;
    role: string;
  }>;
  certifications: string[];
  portfolioLinks: Array<{
    label: string;
    url: string;
  }>;
  mediaItems: string[];
  mediaImages: Array<{
    label: string;
    url: string;
  }>;
  preferredConditions: string[];
  portfolioNotes: string[];
};

export type JobType = "hiring";

export type JobPost = {
  id: string;
  type: JobType;
  gymId?: string;
  trainerId?: string;
  title: string;
  authorName: string;
  area: string;
  employmentType: string;
  compensation: string;
  schedule: string;
  postedAt: string;
  tags: string[];
  summary: string;
  status: string;
  imageUrl?: string;
};

export type Application = {
  id: string;
  jobId: string;
  trainerId: string;
  status: string;
  appliedAt: string;
  message: string;
};
