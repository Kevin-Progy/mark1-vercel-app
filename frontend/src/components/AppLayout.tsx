// @ts-nocheck
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Heart, LayoutDashboard, LogOut, UserRound, UsersRound } from "lucide-react";
import { useAuthStore } from "../lib/store";

const navItems = [
  { to: "/browse", label: "Browse", icon: UsersRound },
  { to: "/my-profile", label: "My Profile", icon: UserRound },
  { to: "/interests", label: "Interests", icon: Heart }
];

export function AppLayout({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuthStore();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-pearl/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/browse" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rosewood text-lg font-bold text-white">
              M1
            </span>
            <div>
              <p className="text-lg font-bold text-ink">PENTECOST MATRIMONY</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active ? "bg-blush text-rosewood" : "text-slate-600 hover:bg-white hover:text-ink"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
            {user?.role === "admin" ? (
              <Link
                to="/admin"
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  pathname === "/admin" ? "bg-blush text-rosewood" : "text-slate-600 hover:bg-white hover:text-ink"
                }`}
              >
                <LayoutDashboard size={17} />
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button className="btn-secondary px-3 py-2" onClick={logout} title="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-4 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="btn-secondary whitespace-nowrap px-3 py-2">
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
          {user?.role === "admin" ? (
            <Link to="/admin" className="btn-secondary whitespace-nowrap px-3 py-2">
              <LayoutDashboard size={16} />
              Admin
            </Link>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}
