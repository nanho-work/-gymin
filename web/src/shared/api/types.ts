export type Page<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type PlatformStats = {
  total_members: number;
  trainer_members: number;
  business_members: number;
  trainer_profiles: number;
  centers: number;
  verified_centers: number;
  total_job_posts: number;
  open_job_posts: number;
  submitted_applications: number;
};
