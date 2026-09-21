import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AppShell } from "@/components/app-shell";
import { PlayerAvatar } from "@/components/player-avatar";
import { RankChip, RankInsignia } from "@/components/rank-insignia";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/catalog";
import { getMyAccount, rerollMyAvatar, updateMyAvatar, updateMyProfile } from "@/lib/platform/profiles";
import { withTimeout } from "@/lib/platform/http";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileBody />
    </RequireAuth>
  );
}

async function fileToAvatar(file: File): Promise<string> {
  if (file.size > 2_000_000) throw new Error("La imagen pesa demasiado (máx 2 MB).");
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  const scale = Math.max(256 / bitmap.width, 256 / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (256 - w) / 2, (256 - h) / 2, w, h);
  const url = canvas.toDataURL("image/jpeg", 0.82);
  if (url.length > 180000) throw new Error("La imagen comprimida sigue siendo demasiado grande.");
  return url;
}

function ProfileBody() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyAccount>> | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("España");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    withTimeout(getMyAccount(), 10000)
      .then((d) => {
        setData(d);
        setDisplayName(d.profile.display_name ?? d.user.name ?? "");
        setUsername(d.profile.username ?? "");
        setCountry(d.profile.country ?? "España");
        setAvatar(d.profile.avatar_url ?? d.user.image);
      })
      .catch((err) => setMsg(err instanceof Error ? err.message : "No se pudo cargar."));
  }, []);

  if (!data) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
        {msg ? <p className="mt-4 text-sm text-danger">{msg}</p> : null}
      </main>
    );
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await withTimeout(updateMyProfile({ data: { displayName, username, country } }), 8000);
      setMsg("Perfil actualizado.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function reroll() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await withTimeout(rerollMyAvatar(), 8000);
      setAvatar(res.avatarUrl);
      setMsg("Logo nuevo asignado.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "No se pudo generar.");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const url = await fileToAvatar(file);
      await withTimeout(updateMyAvatar({ data: { avatarUrl: url } }), 8000);
      setAvatar(url);
      setMsg("Logo actualizado.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "No se pudo subir.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <AppShell title="Perfil" kicker="Identidad">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <PlayerAvatar src={avatar} name={username || "VANT"} seed={data.user.id} size={72} />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-bg p-0.5">
              <RankInsignia rankKey={data.rank.key} size="sm" />
            </span>
          </div>
          <div>
            <p className="font-display text-xl">{data.profile.username ?? "sin username"}</p>
            <p className="text-sm text-muted">{data.user.email}</p>
            <RankChip rankKey={data.rank.key} points={data.profile.points} className="mt-2" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
              {data.user.emailVerified ? "Verificado" : "Sin verificar"}
            </p>
            <p className="mt-1 text-xs text-subtle">Alta: {new Date(data.user.createdAt).toLocaleDateString("es")}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" variant="ghost" disabled={busy} onClick={() => void reroll()}>
            Generar otro logo
          </Button>
          <Button type="button" variant="ghost" disabled={busy} onClick={() => fileRef.current?.click()}>
            Subir logo
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
        </div>
        <form onSubmit={save} className="mt-8 grid gap-3 sm:max-w-md">
          <label className="text-xs text-muted">
            Nombre
            <input className="field mt-1" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
          <label className="text-xs text-muted">
            Username
            <input className="field mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="text-xs text-muted">
            País
            <select className="field mt-1" value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted">
            Email (no se cambia aquí)
            <input className="field mt-1 opacity-60" value={data.user.email ?? ""} readOnly />
          </label>
          {msg ? <p className="text-sm text-cyan">{msg}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "Guardando…" : "Guardar"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
