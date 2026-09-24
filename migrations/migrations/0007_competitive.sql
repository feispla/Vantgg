-- Ranked play: placements, streaks, peak rank, match queue.

alter table profiles add column if not exists placements_left integer not null default 5;
alter table profiles add column if not exists placement_wins integer not null default 0;
alter table profiles add column if not exists streak integer not null default 0;
alter table profiles add column if not exists peak_rank_key text not null default 'unranked';

create table if not exists ranked_queue (
  id text primary key,
  user_id text not null unique,
  opponent_name text not null,
  opponent_rank_key text not null,
  opponent_mmr integer not null,
  opponent_times text not null,
  created_at timestamptz not null default now()
);

create index if not exists ranked_queue_user_id_idx on ranked_queue (user_id);
