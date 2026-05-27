// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { api, getErrorMessage } from "../lib/api";
import { useAuthStore } from "../lib/store";
import type { AuthResponse } from "../lib/types";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post<AuthResponse>("/auth/register", form);
      setAuth(data.token, data.user);
      navigate({ to: data.user.role === "admin" ? "/admin" : "/my-profile" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="card w-full max-w-lg p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Mark 1</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Register, complete your profile, and start discovering matches.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" className="input mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input mt-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input mt-2" type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="role">Account type</label>
            <select id="role" className="input mt-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-rosewood hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
