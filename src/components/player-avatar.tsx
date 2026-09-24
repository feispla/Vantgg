import { avatarDataUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export function PlayerAvatar({
  src,
  name,
  seed,
  size = 64,
  className,
}: {
  src?: string | null;
  name: string;
  seed?: string | null;
  size?: number;
  className?: string;
}) {
  const url = src && src.length > 8 ? src : avatarDataUrl(seed || name || "vant");
  return (
    <img
      src={url}
      alt={name}
      width={size}
      height={size}
      className={cn("rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-white/10", className)}
      style={{ width: size, height: size }}
    />
  );
}
