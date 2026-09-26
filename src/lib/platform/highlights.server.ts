import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import { enqueueSyncEvent } from "@/lib/platform/vant-sync.server";

export type Highlight = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  platform: string;
  durationSeconds: number | null;
  game: string;
  agent: string | null;
  map: string | null;
  views: number;
  likes: number;
  status: string;
  createdAt: string;
};

export const listHighlights = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<Highlight[]>`
    select h.id, h.user_id, h.title, h.description, h.video_url, h.thumbnail_url,
           h.platform, h.duration_seconds, h.game, h.agent, h.map, h.views, h.likes,
           h.status, h.created_at
    from player_highlights h
    where h.status = 'approved'
    order by h.created_at desc
    limit 30
  `;
  return { highlights: rows };
});

export const listMyHighlights = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Highlight[]>`
      select id, user_id as userId, title, description, video_url, thumbnail_url,
             platform, duration_seconds, game, agent, map, views, likes, status, created_at
      from player_highlights
      where user_id = ${context.userId}
      order by created_at desc
    `;
    return { highlights: rows };
  });

export const uploadHighlight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    title: z.string().min(3).max(120),
    description: z.string().max(500).optional(),
    videoUrl: z.string().url().max(500),
    thumbnailUrl: z.string().url().max(500).optional(),
    platform: z.string().max(40).default("upload"),
    durationSeconds: z.number().int().optional(),
    game: z.string().max(40).default("valorant"),
    agent: z.string().max(40).optional(),
    map: z.string().max(40).optional(),
  }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into player_highlights (id, user_id, title, description, video_url, thumbnail_url,
        platform, duration_seconds, game, agent, map, status)
      values (${id}, ${context.userId}, ${data.title}, ${data.description ?? null},
        ${data.videoUrl}, ${data.thumbnailUrl ?? null}, ${data.platform},
        ${data.durationSeconds ?? null}, ${data.game}, ${data.agent ?? null},
        ${data.map ?? null}, 'pending')
    `;

    await enqueueSyncEvent({
      eventType: "highlight.uploaded",
      idempotencyKey: `highlight:upload:${id}`,
      payload: { userId: context.userId, highlightId: id, title: data.title, game: data.game },
    });

    return { id };
  });

export const likeHighlight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(2).max(60) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      update player_highlights set likes = likes + 1, updated_at = now()
      where id = ${data.id} and status = 'approved'
    `;
    return { ok: true };
  });

export const approveHighlight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(2).max(60) }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      update player_highlights set status = 'approved', approved_by = ${context.userId}, approved_at = now()
      where id = ${data.id}
    `;
    return { ok: true };
  });
