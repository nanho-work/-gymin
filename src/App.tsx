import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { GymDetailPage } from "@/pages/GymDetailPage";
import { GymListPage } from "@/pages/GymListPage";
import { GymRegisterPage } from "@/pages/GymRegisterPage";
import { HiringJobsPage } from "@/pages/HiringJobsPage";
import { HomePage } from "@/pages/HomePage";
import { OwnerBoardPage } from "@/pages/OwnerBoardPage";
import { SeekingJobsPage } from "@/pages/SeekingJobsPage";
import { TrainerBoardPage } from "@/pages/TrainerBoardPage";
import { TrainerDetailPage } from "@/pages/TrainerDetailPage";
import { TrainerRegisterPage } from "@/pages/TrainerRegisterPage";

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gyms" element={<GymListPage />} />
        <Route path="/gyms/new" element={<GymRegisterPage />} />
        <Route path="/gyms/:gymId" element={<GymDetailPage />} />
        <Route path="/jobs/hiring" element={<HiringJobsPage />} />
        <Route path="/jobs/seeking" element={<SeekingJobsPage />} />
        <Route path="/trainers/new" element={<TrainerRegisterPage />} />
        <Route path="/trainers/:trainerId" element={<TrainerDetailPage />} />
        <Route path="/boards/owners" element={<OwnerBoardPage />} />
        <Route path="/boards/trainers" element={<TrainerBoardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}
