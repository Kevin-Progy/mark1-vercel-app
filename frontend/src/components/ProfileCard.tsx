// @ts-nocheck
import { Link } from "@tanstack/react-router";
import { Heart, Lock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { InterestStatus, Profile } from "../lib/types";

type ProfileCardProps = {
  profile: Profile;
  onSendInterest: (profile: Profile) => void;
  sending?: boolean;
  interestStatus?: InterestStatus;
};

export function ProfileCard({ profile, onSendInterest, sending, interestStatus }: ProfileCardProps) {
  return (
    <article className="card overflow-hidden">
      <div className="h-52 bg-blush">
        {profile.photo ? (
          <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-4xl font-bold text-rosewood">
            {profile.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Link to="/profile/$profileId" params={{ profileId: profile._id }} className="text-xl font-bold text-ink hover:text-rosewood">
              {profile.name}
            </Link>
            {interestStatus ? <StatusBadge status={interestStatus} /> : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {profile.age ? `${profile.age} years` : "Age not added"} / {profile.gender || "Gender not added"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
          <p className="flex items-center gap-2">
            <Lock size={16} className="text-rosewood" />
            Full profile opens after admin approval
          </p>
        </div>

        <button className="btn-primary w-full" onClick={() => onSendInterest(profile)} disabled={sending || Boolean(interestStatus)}>
          <Heart size={17} />
          {sending ? "Sending..." : interestStatus ? "Interest Sent" : "Send Interest"}
        </button>
      </div>
    </article>
  );
}