// @ts-nocheck
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuthStore } from "../lib/store";

type ProtectedRouteProps = {
  children: ReactNode;
  adminOnly?: boolean;
};

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/browse" />;
  }

  return <>{children}</>;
}
