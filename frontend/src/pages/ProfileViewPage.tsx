// @ts-nocheck
import { useParams } from "@tanstack/react-router";
import { Briefcase, Calendar, Heart, Home, Lock, Phone, Ruler, Send, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { api, getErrorMessage } from "../lib/api";
import { useAuthStore } from "../lib/store";
import type { Interest, Profile } from "../lib/types";

const userIdOf = (userValue: Profile["userId"]) => userValue.id || userValue._id || "";

export function ProfileViewPage() {
  const { profileId } = useParams({ from: "/profile/$profileId" });
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sent, setSent] = useState<Interest[]>([]);
  const [received, setReceived] = useState<Interest[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [profileRes, sentRes, receivedRes] = await Promise.all([
        api.get<Profile>(`/profile/${profileId}`),
        api.get<Interest[]>("/interests/sent"),
        api.get<Interest[]>("/interests/received")
      ]);
      setProfile(profileRes.data);
      setSent(sentRes.data);
      setReceived(receivedRes.data);
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profileId]);

  const matchedInterest = useMemo(() => {
    if (!profile || !user) return undefined;
    const targetUserId = userIdOf(profile.userId);
    return [...sent, ...received].find((interest) => {
      const fromId = interest.fromUserId?.id || interest.fromUserId?._id;
      const toId = interest.toUserId?.id || interest.toUserId?._id;
      return (fromId === user.id && toId === targetUserId) || (fromId === targetUserId && toId === user.id);
    });
  }, [profile, received, sent, user]);

  const canViewDetails = Boolean(profile?.canViewDetails);
  const contactVisible = canViewDetails;

  const sendInterest = async () => {
    if (!profile) return;
    setSending(true);
    setMessage("");

    try {
      await api.post(`/interests/send/${userIdOf(profile.userId)}`);
      setMessage("Interest sent successfully.");
      await loadData();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="card p-8 text-center text-slate-500">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="card p-8 text-center text-slate-500">{message || "Profile not found."}</div>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="card overflow-hidden">
          <div className="aspect-[4/5] bg-blush">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-6xl font-bold text-rosewood">{profile.name.slice(0, 1).toUpperCase()}</div>
            )}
          </div>
          <div className="space-y-4 p-5">
            <button className="btn-primary w-full" onClick={sendInterest} disabled={sending}>
              <Heart size={18} />
              {sending ? "Sending..." : "Send Interest"}
            </button>
            {matchedInterest ? (
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-600">Interest</span>
                <StatusBadge status={matchedInterest.status} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Profile Details</p>
          <h1 className="mt-2 text-4xl font-bold text-ink">{profile.name}</h1>

          {!canViewDetails ? (
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-rosewood">
                  <Lock size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink">Profile details are locked</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Full details will be visible only after the interest is approved by admin.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info icon={<Users size={18} />} label="Age / Gender" value={`${profile.age || "Not added"} / ${profile.gender || "Not added"}`} />
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Info icon={<Calendar size={18} />} label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not added"} />
                <Info icon={<Users size={18} />} label="Age / Gender" value={`${profile.age || "Not added"} / ${profile.gender || "Not added"}`} />
                <Info icon={<Ruler size={18} />} label="Height" value={profile.height || "Not added"} />
                <Info icon={<Users size={18} />} label="Marital Status" value={profile.maritalStatus || "Not added"} />
                <Info icon={<Briefcase size={18} />} label="Qualification" value={profile.qualification || "Not added"} />
                <Info icon={<Briefcase size={18} />} label="Profession" value={profile.profession || "Not added"} />
                <Info icon={<Briefcase size={18} />} label="Income" value={profile.income || "Not added"} />
                <Info icon={<Users size={18} />} label="Community" value={profile.community || "Not added"} />
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-bold text-ink">Languages Known</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.languages?.length ? profile.languages.map((language) => <span key={language} className="badge bg-slate-100 text-slate-600">{language}</span>) : <span className="text-sm text-slate-500">Not added</span>}
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <TextBlock title="Father's Name" value={profile.fatherName} />
                <TextBlock title="Mother's Name" value={profile.motherName} />
                <TextBlock title="Family Status" value={profile.familyStatus} />
                <TextBlock title="Home Town" value={profile.homeTown} />
                <TextBlock title="Current Residence" value={profile.currentResidence} />
                <TextBlock title="Siblings" value={profile.siblings} />
                <TextBlock title="Local Faith Home" value={profile.localFaithHome} />
                <TextBlock title="Center Faith Home" value={profile.centerFaithHome} />
                <TextBlock title="Expectations / Preferences" value={profile.expectations} />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Contact</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Contact information</h2>
          </div>
          {!contactVisible ? <Lock className="text-slate-400" size={24} /> : null}
        </div>
        {contactVisible ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Info icon={<Phone size={18} />} label="Parent's Contact Number" value={profile.parentsContactNumber || "Not added"} />
            <Info icon={<Phone size={18} />} label="Parent's Alternate Contact" value={profile.parentsAlternateContactNumber || "Not added"} />
            <Info icon={<Send size={18} />} label="Telegram Number" value={profile.telegramNumber || "Not added"} />
            <Info icon={<Home size={18} />} label="Current Residence" value={profile.currentResidence || "Not added"} />
          </div>
        ) : (
          <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
            Contact details are visible only after the interest is approved by admin.
          </p>
        )}
      </section>
      {message ? <p className="card p-4 text-sm font-semibold text-slate-700">{message}</p> : null}
    </div>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        <span className="text-rosewood">{icon}</span>
        {label}
      </div>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{value || "Not added"}</p>
    </div>
  );
}
