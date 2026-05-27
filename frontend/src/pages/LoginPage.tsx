// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { FormEvent, useState } from "react";
import { api, getErrorMessage } from "../lib/api";
import { useAuthStore } from "../lib/store";
import type { AuthResponse } from "../lib/types";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
      setAuth(data.token, data.user);
      navigate({ to: data.user.role === "admin" ? "/admin" : "/browse" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center bg-rosewood px-8 py-12 text-white sm:px-14">
        <div className="max-w-xl">
          <div className="mb-12 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <HeartHandshake size={30} />
          </div>
          <h1 className="text-5xl font-bold tracking-normal sm:text-6xl">PENTECOST MATRIMONY</h1>
          <p className="mt-6 text-lg leading-8 text-white/80">
            Ecclesiastes 3:11 He hath made every thing beautiful in his time
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {["Verified profiles", "Real interests", "Admin review"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="card w-full max-w-md p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Welcome back</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Login to continue</h2>
            <p className="mt-2 text-sm text-slate-500">Admin users are redirected to the dashboard after login.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to Mark 1?{" "}
            <Link to="/register" className="font-semibold text-rosewood hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
