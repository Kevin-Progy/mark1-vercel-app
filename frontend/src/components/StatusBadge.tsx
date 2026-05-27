import type { InterestStatus } from "../lib/types";

const styles: Record<InterestStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700"
};

export function StatusBadge({ status }: { status: InterestStatus }) {
  return <span className={`badge capitalize ${styles[status]}`}>{status}</span>;
}
