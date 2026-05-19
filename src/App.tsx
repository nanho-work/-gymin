import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AuthPage } from "@/pages/AuthPage";
import { BusinessSignupPage } from "@/pages/BusinessSignupPage";
import { GeneralSignupPage } from "@/pages/GeneralSignupPage";
import { GymDetailPage } from "@/pages/GymDetailPage";
import { GymRegisterPage } from "@/pages/GymRegisterPage";
import { HiringJobCreatePage } from "@/pages/HiringJobCreatePage";
import { HiringJobsPage } from "@/pages/HiringJobsPage";
import { HomePage } from "@/pages/HomePage";
import { OwnerHomePage } from "@/pages/OwnerHomePage";
import { OwnerJobApplicantsPage } from "@/pages/OwnerJobApplicantsPage";
import { TrainerDetailPage } from "@/pages/TrainerDetailPage";
import { TrainerHomePage } from "@/pages/TrainerHomePage";
import { TrainerRegisterPage } from "@/pages/TrainerRegisterPage";

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup/business" element={<BusinessSignupPage />} />
        <Route path="/signup/general" element={<GeneralSignupPage />} />
        <Route path="/gyms/new" element={<GymRegisterPage />} />
        <Route path="/gyms/:gymId" element={<GymDetailPage />} />
        <Route path="/jobs/hiring" element={<HiringJobsPage />} />
        <Route path="/jobs/hiring/new" element={<HiringJobCreatePage />} />
        <Route path="/owner" element={<OwnerHomePage />} />
        <Route path="/owner/jobs/:jobId/applicants" element={<OwnerJobApplicantsPage />} />
        <Route path="/trainer" element={<TrainerHomePage />} />
        <Route path="/trainers/new" element={<TrainerRegisterPage />} />
        <Route path="/trainers/:trainerId" element={<TrainerDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}
