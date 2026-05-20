export type RatingBreakdown = {
  settlement: number;
  workEnvironment: number;
  contractClarity: number;
  dayOff: number;
  salesPressure: number;
  incentive: number;
};

export type Gym = {
  id: string;
  name: string;
  area: string;
  address: string;
  category: string;
  verified: boolean;
  ownerVerified: boolean;
  registrationStatus: string;
  summary: string;
  heroImage: string;
  tags: string[];
  ratings: RatingBreakdown;
  benefits: string[];
  facilities: string[];
  hiringStatus: string;
  reviewPolicy: string;
  contactNote: string;
};

export type Trainer = {
  id: string;
  name: string;
  age: number;
  birthDate: string;
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
};

export type Application = {
  id: string;
  jobId: string;
  trainerId: string;
  status: string;
  appliedAt: string;
  message: string;
};
