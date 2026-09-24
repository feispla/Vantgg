-- VANT platform: profiles, commerce, tickets, ranked, tournaments, mail, support.
-- Additive and idempotent. Existing CROSAIM tables stay in place.

alter table purchases add column if not exists user_id text;
alter table purchases add column if not exists product_id text;
alter table purchases add column if not exists payment_method text;
alter table purchases add column if not exists stripe_payment_intent text;
alter table purchases add column if not exists stripe_event_id text;
alter table purchases add column if not exists ticket_code text;

create index if not exists purchases_user_id_idx on purchases (user_id);
create index if not exists purchases_product_id_idx on purchases (product_id);

create table if not exists profiles (
  user_id text primary key,
  username text unique,
  display_name text,
  country text,
  avatar_url text,
  email_verified boolean not null default false,
  verification_status text not null default 'PENDING',
  verification_note text,
  rank_key text not null default 'unranked',
  xp integer not null default 0,
  points integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_points_idx on profiles (points desc);
create index if not exists profiles_username_idx on profiles (username);

create table if not exists auth_tokens (
  id text primary key,
  user_id text,
  email text not null,
  type text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists auth_tokens_email_type_idx on auth_tokens (email, type);

create table if not exists email_outbox (
  id text primary key,
  to_email text not null,
  template text not null,
  subject text not null,
  body text not null,
  action_url text,
  status text not null default 'queued',
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_outbox_to_email_idx on email_outbox (to_email, created_at desc);

create table if not exists stripe_events (
  event_id text primary key,
  type text not null,
  payment_id text,
  customer_id text,
  user_id text,
  product_id text,
  amount integer,
  currency text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists tickets (
  id text primary key,
  user_id text not null,
  purchase_id text not null,
  product_id text not null,
  code text not null unique,
  tier text not null,
  status text not null default 'PAID',
  created_at timestamptz not null default now()
);

create index if not exists tickets_user_id_idx on tickets (user_id);
create index if not exists tickets_code_idx on tickets (code);

create table if not exists entitlements (
  user_id text not null,
  key text not null,
  purchase_id text,
  created_at timestamptz not null default now(),
  primary key (user_id, key)
);

create table if not exists tournaments (
  id text primary key,
  name text not null,
  blurb text not null default '',
  status text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer not null,
  prize text,
  entry_label text,
  min_tier text not null default 'basic',
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists tournament_entries (
  id text primary key,
  tournament_id text not null,
  user_id text not null,
  ticket_id text,
  status text not null default 'registered',
  created_at timestamptz not null default now(),
  unique (tournament_id, user_id)
);

create index if not exists tournament_entries_user_id_idx on tournament_entries (user_id);

create table if not exists support_tickets (
  id text primary key,
  user_id text,
  name text not null,
  email text not null,
  category text not null,
  purchase_id text,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists rate_limits (
  key text primary key,
  hits integer not null default 0,
  window_start timestamptz not null default now()
);

create table if not exists ranked_history (
  id text primary key,
  user_id text not null,
  title text not null,
  result text not null,
  points_delta integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ranked_history_user_id_idx on ranked_history (user_id, created_at desc);

insert into tournaments (id, name, blurb, status, starts_at, ends_at, capacity, prize, entry_label, min_tier, is_private)
values
  (
    'vant-open-01',
    'VANT Open',
    'Bracket abierto. Ticket BASIC o superior.',
    'open',
    '2026-10-04 18:00:00+00',
    '2026-10-05 23:00:00+00',
    64,
    '€250 + puntos Ranked',
    'BASIC+',
    'basic',
    false
  ),
  (
    'vant-pro-series-01',
    'VANT Pro Series',
    'Circuito semanal. Ticket PRO o ELITE.',
    'open',
    '2026-10-11 18:00:00+00',
    '2026-10-12 23:00:00+00',
    32,
    '€750 + ranking',
    'PRO+',
    'pro',
    false
  ),
  (
    'vant-elite-inv-01',
    'VANT Elite Invitational',
    'Invitational cerrado. Ticket ELITE.',
    'open',
    '2026-10-18 17:00:00+00',
    '2026-10-19 22:00:00+00',
    16,
    '€2.000',
    'ELITE',
    'elite',
    false
  ),
  (
    'vant-private-scrim-01',
    'Scrims privadas Operator',
    'Sala privada. Requiere ticket de pago y sesión autenticada.',
    'open',
    '2026-09-29 18:30:00+00',
    '2026-09-29 22:00:00+00',
    10,
    'Puntos Ranked',
    'PRO+',
    'pro',
    true
  )
on conflict (id) do nothing;
