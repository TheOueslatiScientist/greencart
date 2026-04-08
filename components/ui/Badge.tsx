import { cn } from "@/lib/utils";
import type { Badge as BadgeType } from "@/types";

const badgeConfig: Record<
  BadgeType,
  { label: string; className: string; icon: string }
> = {
  bio: {
    label: "Bio",
    className: "bg-green-100 text-green-700 border border-green-200",
    icon: "🌿",
  },
  local: {
    label: "Local",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    icon: "📍",
  },
  antigaspi: {
    label: "Anti-gaspi",
    className: "bg-orange-100 text-orange-700 border border-orange-200",
    icon: "♻️",
  },
  promo: {
    label: "Promo",
    className: "bg-red-100 text-red-600 border border-red-200",
    icon: "🏷️",
  },
  saison: {
    label: "De saison",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    icon: "🌱",
  },
};

interface BadgeProps {
  type: BadgeType;
  className?: string;
  showIcon?: boolean;
}

export function Badge({ type, className, showIcon = true }: BadgeProps) {
  const config = badgeConfig[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}

interface BadgeListProps {
  badges: BadgeType[];
  max?: number;
  className?: string;
}

export function BadgeList({ badges, max = 3, className }: BadgeListProps) {
  const visible = badges.slice(0, max);
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((b) => (
        <Badge key={b} type={b} />
      ))}
    </div>
  );
}
