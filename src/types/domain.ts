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
  headline: string;
  area: string;
  experienceYears: number;
  specialties: string[];
  desiredRoles: string[];
  availability: string;
  verifiedProfile: boolean;
  summary: string;
  preferredConditions: string[];
  portfolioNotes: string[];
};

export type JobType = "hiring" | "seeking";

export type JobPost = {
  id: string;
  type: JobType;
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

export type BoardAudience = "owners" | "trainers";

export type BoardPost = {
  id: string;
  audience: BoardAudience;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  createdAt: string;
  comments: number;
  lockedForBusinessVerification: boolean;
};
