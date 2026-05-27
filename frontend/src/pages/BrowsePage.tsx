import { Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ProfileCard } from "../components/ProfileCard";
import { api, getErrorMessage } from "../lib/api";
import { useAuthStore } from "../lib/store";
import type { Interest, InterestStatus, Profile } from "../lib/types";

const userIdOf = (userValue: Profile["userId"]) => userValue.id || userValue._id || "";
const interestUserIdOf = (userValue: Interest["toUserId"]) => userValue?.id || userValue?._id || "";

export function BrowsePage() {
  const user = useAuthStore((state) => state.user);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filters, setFilters] = useState({ search: "", minAge: "", maxAge: "", location: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState("");
  const [sentInterestStatus, setSentInterestStatus] = useState<Record<string, InterestStatus>>({});

  const loadProfiles = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [profilesRes, sentRes] = await Promise.all([
        api.get<Profile[]>("/profile/all", { params: filters }),
        api.get<Interest[]>("/interests/sent")
      ]);
      const nextStatus: Record<string, InterestStatus> = {};

      sentRes.data.forEach((interest) => {
        const toUserId = interestUserIdOf(interest.toUserId);
        if (toUserId) {
          nextStatus[toUserId] = interest.status;
        }
      });

      setSentInterestStatus(nextStatus);
      setProfiles(profilesRes.data.filter((profile) => userIdOf(profile.userId) !== user?.id));
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleFilter = (event: FormEvent) => {
    event.preventDefault();
    loadProfiles();
  };

  const sendInterest = async (profile: Profile) => {
    setSendingId(profile._id);
    setMessage("");
    try {
      await api.post(`/interests/send/${userIdOf(profile.userId)}`);
      setMessage(`Interest sent to ${profile.name}.`);
      await loadProfiles();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSendingId("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Browse</p>
          <h1 className="mt-2 text-4xl font-bold text-ink">Discover profiles</h1>
        </div>
      </div>

      <form className="card grid gap-4 p-5 md:grid-cols-[1fr_150px_150px_1fr_auto]" onSubmit={handleFilter}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-3.5 text-slate-400" size={18} />
          <input className="input pl-11" placeholder="Search name, qualification, profession" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <input className="input" type="number" min={18} placeholder="Min age" value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} />
        <input className="input" type="number" min={18} placeholder="Max age" value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} />
        <input className="input" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <button className="btn-primary">Filter</button>
      </form>

      {message ? <p className="card p-4 text-sm font-semibold text-slate-700">{message}</p> : null}

      {loading ? (
        <div className="card p-8 text-center text-slate-500">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No profiles found. Complete profiles will appear here.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile._id}
              profile={profile}
              onSendInterest={sendInterest}
              sending={sendingId === profile._id}
              interestStatus={sentInterestStatus[userIdOf(profile.userId)]}
            />
          ))}
        </div>
      )}
    </div>
  );
}