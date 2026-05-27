// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { BrowsePage } from "../pages/BrowsePage";

export const Route = createFileRoute("/browse")({
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <BrowsePage />
      </AppLayout>
    </ProtectedRoute>
  )
});
