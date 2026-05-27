// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfileViewPage } from "../pages/ProfileViewPage";

export const Route = createFileRoute("/profile/$profileId")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <ProfileViewPage />
      </AppLayout>
    </ProtectedRoute>
  )
});
