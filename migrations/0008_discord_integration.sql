-- Discord bot integration: canonical web-linked player identity and idempotent applications.
-- The bot source lives under integrations/vantbot; this migration is the only
-- schema source used by the web and Supabase deployments.
-- IDs use application-compatible text defaults so the local PGLite fallback does
-- not require the pgcrypto extension.

alter table profiles add column if not exists discord_id text;
alter table profiles add column if not exists discord_username text;
create unique index if not exists profiles_discord_id_unique_idx
  on profiles (discord_id)
  where discord_id is not null;

create table if not exists postulaciones (
  id text primary key default (md5(random()::text || clock_timestamp()::text)),
  nombre text not null,
  discord_id text,
  discord_username text,
  rol text,
  rango text,
  region text,
  descripcion text,
  foto_url text,
  estado text not null default 'POSTULACIÓN',
  motivo_rechazo text,
  discord_webhook_id text,
  discord_postulacion_message_id text,
  discord_revision_message_id text,
  discord_aprobacion_message_id text,
  revisado_por_discord_id text,
  state_changed_by_discord_id text,
  state_changed_by_type text,
  state_changed_at timestamptz not null default now(),
  interview_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  roster_at timestamptz,
  tryout_at timestamptz,
  payload_original text not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table postulaciones add column if not exists nombre text;
alter table postulaciones add column if not exists discord_id text;
alter table postulaciones add column if not exists discord_username text;
alter table postulaciones add column if not exists rol text;
alter table postulaciones add column if not exists region text;
alter table postulaciones add column if not exists descripcion text;
alter table postulaciones add column if not exists foto_url text;
alter table postulaciones add column if not exists motivo_rechazo text;
alter table postulaciones add column if not exists discord_webhook_id text;
alter table postulaciones add column if not exists discord_postulacion_message_id text;
alter table postulaciones add column if not exists discord_revision_message_id text;
alter table postulaciones add column if not exists discord_aprobacion_message_id text;
alter table postulaciones add column if not exists revisado_por_discord_id text;
alter table postulaciones add column if not exists state_changed_by_discord_id text;
alter table postulaciones add column if not exists state_changed_by_type text;
alter table postulaciones add column if not exists state_changed_at timestamptz default now();
alter table postulaciones add column if not exists interview_at timestamptz;
alter table postulaciones add column if not exists approved_at timestamptz;
alter table postulaciones add column if not exists rejected_at timestamptz;
alter table postulaciones add column if not exists roster_at timestamptz;
alter table postulaciones add column if not exists tryout_at timestamptz;
alter table postulaciones add column if not exists payload_original text default '{}';
alter table postulaciones add column if not exists reviewed_at timestamptz;

create index if not exists postulaciones_estado_idx on postulaciones (estado);
create index if not exists postulaciones_discord_id_idx on postulaciones (discord_id);
create index if not exists postulaciones_created_at_idx on postulaciones (created_at desc);
create unique index if not exists postulaciones_discord_message_unique_idx
  on postulaciones (discord_postulacion_message_id)
  where discord_postulacion_message_id is not null;

create table if not exists postulaciones_auditoria (
  id text primary key default (md5(random()::text || clock_timestamp()::text)),
  postulacion_id text not null,
  evento_id text not null unique default (md5(random()::text || clock_timestamp()::text)),
  estado_anterior text,
  estado_nuevo text not null,
  actor_discord_id text,
  actor_tipo text not null default 'bot',
  fuente text not null default 'discord',
  detalle text not null default '{}',
  created_at timestamptz not null default now()
);

alter table postulaciones_auditoria add column if not exists evento_id text default (md5(random()::text || clock_timestamp()::text));
alter table postulaciones_auditoria add column if not exists actor_discord_id text;
alter table postulaciones_auditoria add column if not exists actor_tipo text default 'bot';
alter table postulaciones_auditoria add column if not exists fuente text default 'discord';
alter table postulaciones_auditoria add column if not exists detalle text default '{}';
create index if not exists postulaciones_auditoria_postulacion_created_idx
  on postulaciones_auditoria (postulacion_id, created_at desc);

alter table postulaciones enable row level security;
alter table postulaciones_auditoria enable row level security;
