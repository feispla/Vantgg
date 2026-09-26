-- Player highlights, verified badges, and rank definitions.
-- Applied to both Supabase projects (vantgg + vantcall-admin).

create table if not exists player_highlights (
  id text primary key default (md5(random()::text || clock_timestamp()::text)),
  user_id text not null,
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  platform text not null default 'upload',
  duration_seconds integer,
  game text not null default 'valorant',
  agent text,
  map text,
  views integer not null default 0,
  likes integer not null default 0,
  status text not null default 'pending',
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists player_highlights_user_id_idx on player_highlights (user_id, created_at desc);
create index if not exists player_highlights_status_idx on player_highlights (status, created_at desc);
create index if not exists player_highlights_game_idx on player_highlights (game, created_at desc);

create table if not exists verified_badges (
  user_id text primary key,
  badge_type text not null default 'verified',
  badge_tier text not null default 'bronze',
  icon text not null default 'shield',
  color text not null default '#cd7f32',
  title text,
  description text,
  awarded_by text,
  awarded_at timestamptz not null default now(),
  expires_at timestamptz,
  active boolean not null default true
);
create index if not exists verified_badges_active_idx on verified_badges (active, badge_tier);

create table if not exists rank_definitions (
  rank_key text primary key,
  display_name text not null,
  tier text not null,
  color text not null,
  icon text not null,
  min_mmr integer not null default 0,
  max_mmr integer,
  sort_order integer not null default 0
);

insert into rank_definitions (rank_key, display_name, tier, color, icon, min_mmr, max_mmr, sort_order) values
  ('unranked', 'Sin rango', 'none', '#808080', 'circle', 0, 0, 0),
  ('iron', 'Iron', 'iron', '#8b8b8b', 'shield', 1, 499, 1),
  ('bronze', 'Bronze', 'bronze', '#cd7f32', 'shield', 500, 999, 2),
  ('silver', 'Silver', 'silver', '#c0c0c0', 'shield', 1000, 1499, 3),
  ('gold', 'Gold', 'gold', '#ffd700', 'shield', 1500, 1999, 4),
  ('platinum', 'Platinum', 'platinum', '#00d4aa', 'shield', 2000, 2499, 5),
  ('diamond', 'Diamond', 'diamond', '#00b4d8', 'shield', 2500, 2999, 6),
  ('ascendant', 'Ascendant', 'ascendant', '#00ff88', 'shield', 3000, 3499, 7),
  ('immortal', 'Immortal', 'immortal', '#a855f7', 'shield', 3500, 3999, 8),
  ('radiant', 'Radiant', 'radiant', '#ff4d4d', 'crown', 4000, 99999, 9)
on conflict (rank_key) do nothing;

alter table player_highlights enable row level security;
alter table verified_badges enable row level security;
alter table rank_definitions enable row level security;
