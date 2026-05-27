// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminDashboard } from "../pages/AdminDashboard";

export const Route = createFileRoute("/admin")({
  component: () => (
    <ProtectedRoute adminOnly>
      <AppLayout>
        <AdminDashboard />
      </AppLayout>
    </ProtectedRoute>
  )
});
