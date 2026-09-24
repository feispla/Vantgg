-- Query indexes for VANT list, registration, and sync-claim paths.
-- Additive and idempotent: no data is changed or removed.

create index if not exists tournaments_status_starts_at_idx
  on tournaments (status, starts_at asc);

create index if not exists tournament_entries_tournament_status_idx
  on tournament_entries (tournament_id, status);

create index if not exists tournament_entries_user_status_idx
  on tournament_entries (user_id, status);

create index if not exists vant_sync_events_claim_idx
  on vant_sync_events (status, lease_until, created_at)
  where status = 'pending';

create index if not exists support_tickets_status_created_at_idx
  on support_tickets (status, created_at desc);
