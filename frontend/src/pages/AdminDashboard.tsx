import { Check, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { api, getErrorMessage } from "../lib/api";
import type { Interest, InterestStatus } from "../lib/types";

const userName = (user: Interest["fromUserId"] | Interest["toUserId"] | null | undefined) => {
  return user?.name || "Unknown user";
};

export function AdminDashboard() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadInterests = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.get<Interest[]>("/interests/all");
      setInterests(data);
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, []);

  const updateStatus = async (id: string, status: InterestStatus) => {
    try {
      await api.put(`/interests/${id}/status`, { status });
      await loadInterests();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blush text-rosewood">
          <ShieldCheck size={28} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Admin</p>
          <h1 className="mt-1 text-4xl font-bold text-ink">Interest approvals</h1>
        </div>
      </div>

      {message ? <p className="card p-4 text-sm font-semibold text-slate-700">{message}</p> : null}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading admin dashboard...</div>
        ) : interests.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No interests have been sent yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">From</th>
                  <th className="px-5 py-4">To</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interests.map((interest) => (
                  <tr key={interest._id}>
                    <td className="px-5 py-4 font-semibold text-ink">{userName(interest.fromUserId)}</td>
                    <td className="px-5 py-4 text-slate-600">{userName(interest.toUserId)}</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(interest.date).toLocaleDateString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={interest.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="btn-secondary px-3 py-2" onClick={() => updateStatus(interest._id, "approved")} title="Approve">
                          <Check size={16} />
                        </button>
                        <button className="btn-secondary px-3 py-2" onClick={() => updateStatus(interest._id, "rejected")} title="Reject">
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}