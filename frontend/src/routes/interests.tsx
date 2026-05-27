// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { InterestsPage } from "../pages/InterestsPage";

export const Route = createFileRoute("/interests")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <InterestsPage />
      </AppLayout>
    </ProtectedRoute>
  )
});
