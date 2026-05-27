import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { api, getErrorMessage } from "../lib/api";
import type { Interest, InterestStatus } from "../lib/types";

const userName = (user: Interest["fromUserId"] | Interest["toUserId"] | null | undefined) => {
  return user?.name || "Unknown user";
};

export function InterestsPage() {
  const [sent, setSent] = useState<Interest[]>([]);
  const [received, setReceived] = useState<Interest[]>([]);
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadInterests = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [sentRes, receivedRes] = await Promise.all([
        api.get<Interest[]>("/interests/sent"),
        api.get<Interest[]>("/interests/received")
      ]);
      setSent(sentRes.data);
      setReceived(receivedRes.data);
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

  const rows = tab === "received" ? received : sent;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Interests</p>
        <h1 className="mt-2 text-4xl font-bold text-ink">Track connection requests</h1>
      </div>

      <div className="card p-2">
        <div className="grid grid-cols-2 gap-2">
          <button className={`rounded-xl px-4 py-3 text-sm font-semibold ${tab === "received" ? "bg-blush text-rosewood" : "text-slate-600"}`} onClick={() => setTab("received")}>
            Received
          </button>
          <button className={`rounded-xl px-4 py-3 text-sm font-semibold ${tab === "sent" ? "bg-blush text-rosewood" : "text-slate-600"}`} onClick={() => setTab("sent")}>
            Sent
          </button>
        </div>
      </div>

      {message ? <p className="card p-4 text-sm font-semibold text-slate-700">{message}</p> : null}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading interests...</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No interests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">From</th>
                  <th className="px-5 py-4">To</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((interest) => (
                  <tr key={interest._id}>
                    <td className="px-5 py-4 font-semibold text-ink">{userName(interest.fromUserId)}</td>
                    <td className="px-5 py-4 text-slate-600">{userName(interest.toUserId)}</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(interest.date).toLocaleDateString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={interest.status} /></td>
                    <td className="px-5 py-4">
                      {tab === "received" && interest.status === "pending" ? (
                        <div className="flex gap-2">
                          <button className="btn-secondary px-3 py-2" onClick={() => updateStatus(interest._id, "approved")} title="Approve">
                            <Check size={16} />
                          </button>
                          <button className="btn-secondary px-3 py-2" onClick={() => updateStatus(interest._id, "rejected")} title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
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