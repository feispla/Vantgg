-- CROSAIM operational tables. Text ids (generated in app) so PGLite + Neon
-- stay in sync without gen_random_uuid / pgcrypto.

create table if not exists purchases (
  id text primary key,
  plan_id text not null,
  stripe_session_id text unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  email text,
  discord_username text,
  amount_total integer,
  currency text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  fulfilled_by text
);

create index if not exists purchases_status_idx on purchases (status);

create table if not exists tryout_applications (
  id text primary key,
  user_id text,
  gamertag text not null,
  discord_username text not null,
  role text not null,
  game text not null,
  note text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists tryout_applications_user_id_idx on tryout_applications (user_id);
create index if not exists tryout_applications_status_idx on tryout_applications (status);

create table if not exists event_rsvps (
  id text primary key,
  user_id text not null,
  event_id text not null,
  display_name text not null,
  discord_username text not null,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create index if not exists event_rsvps_event_id_idx on event_rsvps (event_id);

create table if not exists user_roles (
  user_id text not null,
  role_id text not null,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table if not exists audit_logs (
  id text primary key,
  actor_user_id text,
  action text not null,
  resource_type text,
  resource_id text,
  metadata text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on audit_logs (created_at);
