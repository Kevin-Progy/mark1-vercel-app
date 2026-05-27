import axios from "axios";
import { useAuthStore } from "./store";

export const api = axios.create({
  baseURL: "/api"
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const originalUrl = config.url || "";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.method?.toLowerCase() === "get" && originalUrl === "/profile/me") {
    config.url = "/profile/getProfile";
    config.params = { ...(config.params || {}), me: "true" };
  }

  if (config.method?.toLowerCase() === "put" && originalUrl === "/profile/me") {
    config.url = "/profile/updateProfile";
  }

  if (config.method?.toLowerCase() === "get" && originalUrl === "/profile/all") {
    config.url = "/profile/getProfile";
    config.params = { ...(config.params || {}), all: "true" };
  }

  if (config.method?.toLowerCase() === "get" && originalUrl.startsWith("/profile/")) {
    config.url = "/profile/getProfile";
    config.params = { ...(config.params || {}), id: originalUrl.replace("/profile/", "") };
  }

  if (config.method?.toLowerCase() === "post" && originalUrl.startsWith("/interests/send/")) {
    config.url = "/interest/sendInterest";
    config.data = {
      ...(config.data || {}),
      toUserId: originalUrl.replace("/interests/send/", "")
    };
  }

  if (config.method?.toLowerCase() === "get" && originalUrl === "/interests/sent") {
    config.url = "/interest/getInterests";
    config.params = { ...(config.params || {}), type: "sent" };
  }

  if (config.method?.toLowerCase() === "get" && originalUrl === "/interests/received") {
    config.url = "/interest/getInterests";
    config.params = { ...(config.params || {}), type: "received" };
  }

  if (config.method?.toLowerCase() === "get" && originalUrl === "/interests/all") {
    config.url = "/interest/getInterests";
    config.params = { ...(config.params || {}), type: "all" };
  }

  if (config.method?.toLowerCase() === "put" && originalUrl.startsWith("/interests/") && originalUrl.endsWith("/status")) {
    config.url = "/interest/getInterests";
    config.data = {
      ...(config.data || {}),
      id: originalUrl.replace("/interests/", "").replace("/status", "")
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  return "Something went wrong";
};
