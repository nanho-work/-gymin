import applicationData from "@/data/applications.json";
import gymData from "@/data/gyms.json";
import jobData from "@/data/jobs.json";
import trainerData from "@/data/trainers.json";
import type { Application, Gym, JobPost, JobType, Trainer } from "@/types/domain";

export const applications = applicationData as Application[];
export const gyms = gymData as Gym[];
export const trainers = trainerData as Trainer[];
export const jobs = jobData as JobPost[];

export function getGymById(id: string | undefined) {
  return gyms.find((gym) => gym.id === id);
}

export function getTrainerById(id: string | undefined) {
  return trainers.find((trainer) => trainer.id === id);
}

export function getJobsByType(type: JobType) {
  return jobs.filter((job) => job.type === type);
}

export function getJobsByGymId(gymId: string | undefined) {
  return jobs.filter((job) => job.gymId === gymId);
}

export function getJobById(id: string | undefined) {
  return jobs.find((job) => job.id === id);
}

export function getApplicationsByJobId(jobId: string | undefined) {
  return applications.filter((application) => application.jobId === jobId);
}
