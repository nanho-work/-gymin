import boardData from "@/data/boards.json";
import gymData from "@/data/gyms.json";
import jobData from "@/data/jobs.json";
import trainerData from "@/data/trainers.json";
import type { BoardPost, Gym, JobPost, JobType, Trainer } from "@/types/domain";

export const gyms = gymData as Gym[];
export const trainers = trainerData as Trainer[];
export const jobs = jobData as JobPost[];
export const boardPosts = boardData as BoardPost[];

export function getGymById(id: string | undefined) {
  return gyms.find((gym) => gym.id === id);
}

export function getTrainerById(id: string | undefined) {
  return trainers.find((trainer) => trainer.id === id);
}

export function getJobsByType(type: JobType) {
  return jobs.filter((job) => job.type === type);
}

export function getBoardPostsByAudience(audience: "owners" | "trainers") {
  return boardPosts.filter((post) => post.audience === audience);
}
