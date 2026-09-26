import { useEffect, useState } from "react";
import { getSocialLinks, type SocialLink } from "@/lib/platform/social-links.server";

const ICONS: Record<string, string> = {
  discord: "🎮",
  twitch: "📺",
  tiktok: "🎵",
  x: "✖️",
  kick: "🦶",
  youtube: "▶️",
  instagram: "📷",
  facebook: "👤",
};

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    getSocialLinks().then((res) => setLinks(res.links)).catch(() => {});
  }, []);

  if (links.length === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-subtle hover:text-accent transition-colors"
            title={link.label}
          >
            {ICONS[link.platform] || "🔗"}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-muted hover:text-fg hover:border-accent transition-colors"
        >
          <span>{ICONS[link.platform] || "🔗"}</span>
          <span>{link.label}</span>
          {link.handle && <span className="text-subtle text-xs">@{link.handle}</span>}
        </a>
      ))}
    </div>
  );
}
