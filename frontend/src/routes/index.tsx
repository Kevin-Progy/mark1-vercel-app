// @ts-nocheck
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../lib/store";

function IndexRoute() {
  const token = useAuthStore((state) => state.token);
  return <Navigate to={token ? "/browse" : "/login"} />;
}

export const Route = createFileRoute("/")({
  component: IndexRoute
});
