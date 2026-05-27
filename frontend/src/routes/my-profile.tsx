// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { MyProfilePage } from "../pages/MyProfilePage";

export const Route = createFileRoute("/my-profile")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <MyProfilePage />
      </AppLayout>
    </ProtectedRoute>
  )
});
